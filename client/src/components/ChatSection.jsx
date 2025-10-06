import React, { useRef, useState, useEffect } from 'react'
import InputSection from './InputSection'
import { BookOpenIcon, UserIcon } from 'lucide-react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from "react-markdown"
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

function ChatSection() {

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const { chatId } = useParams();
  const location = useLocation();




  const url = import.meta.env.VITE_SHIKSHYAAI_URL;

  useEffect(() => {

    const fetchChatsById = async () => {
      try {
        const response = await axios.get(`${url}/get-chats/${chatId}`, {
          withCredentials: true
        })

        // Normalize old messages to have 'sender'
        const normalizedMessages = (response.data.conversation.messages || []).map(m => ({
          sender: m.sender || (m.role === "user" ? "user" : "assistant"),
          text: m.text,
          time: m.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }));

        setMessages(normalizedMessages || []);

      } catch (error) {
        console.log("error: ", error)
      }
    }

    if (location.pathname === `/c/${chatId}`) {
      fetchChatsById();
    }

  }, [chatId])

  // auto scroll to bottom when chat or conversation changes

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  const renderMessage = (msg) => {
    // match ```lang\ncode``` or ```\ncode```
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(msg)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: msg.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'code', language: match[1] || 'javascript', content: match[2] });
      lastIndex = codeRegex.lastIndex;
    }

    if (lastIndex < msg.length) {
      parts.push({ type: 'text', content: msg.substring(lastIndex) });
    }

    return parts.map((p, idx) => {
      if (p.type === 'text') {
        return (
          <div key={idx} className="prose prose-sm max-w-none">
            <ReactMarkdown>{p.content}</ReactMarkdown>
          </div>
        );
      }
      return (
        <SyntaxHighlighter
          key={idx}
          language={p.language}
          style={materialLight}
          wrapLongLines={true}
          showLineNumbers={false}
        >
          {p.content}
        </SyntaxHighlighter>
      );
    });
  };


  return (
    <div className='h-full flex flex-col'>



      {
        location.pathname === "/" &&
        (
          <div className="bg-white p-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-800 text-center">
              Welcome to ShikshyaAI, your friendly learning assistant
            </h2>
          </div>
        )
      }

      {
        messages.length === 0 && (
          <div className="bg-white p-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-800 text-center">
              Welcome to ShikshyaAI, your friendly learning assistant
            </h2>
          </div>


        )


      }




      <div className='flex-1 overflow-y-auto p-4 space-y-4'>


        {
          location.pathname === "/" && (
            <div className='flex flex-col items-center justify-center h-full text-center text-gray-400'>
              <BookOpenIcon className='text-blue-300 size-20' />
              <p className="text-lg">Start a conversation</p>
              <p className="text-sm">Ask any question about your studies</p>
            </div>
          )
        }




        {
          messages.length === 0 &&

          (

            <div className='flex flex-col items-center justify-center h-full text-center text-gray-400'>
              <BookOpenIcon className='text-blue-300 size-20' />
              <p className="text-lg">Start a conversation</p>
              <p className="text-sm">Ask any question about your studies</p>
            </div>
          )
        }

        {location.pathname !== "/" && messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] sm:max-w-[70%] ${m.sender === "user" ? "flex-row-reverse items-end" : "items-start"}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${m.sender === "user" ? "bg-indigo-100 ml-2" : "bg-purple-100 mr-2"}`}>
                {m.sender === "user" ? <UserIcon className="h-5 w-5 text-indigo-600" /> : <BookOpenIcon className="h-5 w-5 text-purple-600" />}
              </div>
              <div className={`py-2 px-4 rounded-xl shadow-sm ${m.sender === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-white border border-purple-100 rounded-bl-none"}`}>
                <p className={m.sender === "user" ? "text-white" : "text-gray-800"}>{renderMessage(m.text)}</p>
                <div className={`text-xs mt-1 ${m.sender === "user" ? "text-indigo-200" : "text-gray-400"}`}>{m.time}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>



        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <BookOpenIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="py-2 px-4 rounded-xl shadow-sm bg-white border border-purple-100 rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className='p-4 border-t border-gray-100 bg-white'>
        <InputSection messages={messages} setIsTyping={setIsTyping} setMessages={setMessages} />
      </div>

    </div>
  )
}

export default ChatSection
