import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, Plus, FileText, Code,Globe  } from 'lucide-react';

import axios from "axios"
import { useParams , useNavigate  } from 'react-router-dom';


const InputSection=({setIsTyping,messages,setMessages})=> {
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef(null);  
  const {chatId}=useParams();
  const Navigate=useNavigate();






  


  const handleSend=async()=>{
    if(!message.trim()) return

    const timestamp=new Date().toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit" });
    const userMsg={sender:"user", text:message, time:timestamp};


    setMessages(prev=> [...prev, userMsg])

    setMessage("");
    setIsTyping(true);

   




    try {
      // convert chat to openai messages format

      const messagesForAI = messages.map(c => ({
        role: c.sender === "user" ? "user" : "assistant",
        content: c.text
      })).concat([{ role: "user", content: message }]);

      const res=await axios.post("http://localhost:5000/api/chat",
        {messages:messagesForAI,chatId:chatId},
        {withCredentials: true}
      );

      Navigate(`/c/${res.data.chatId}`)

      

      const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev=>[...prev, {sender:"assistant",text:res.data.answer, time:botTimestamp }])

    } catch (error) {

    console.log(error)

     const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
     setMessages(prev=> [...prev, {sender:"assistant",text:"AI Error. Try again", time:botTimestamp}])
      
    }finally{
      setIsTyping(false)
    }
  };


    const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };






  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuSelect = (option) => {
    if (option === 'file') {
      alert('File upload triggered'); // Replace with file input logic
    } else if (option === 'code') {
      setMessage((prev) => prev + ' [Code Snippet]');
    } else if (option === 'template') {
      setMessage((prev) => prev + '');
    }
    setMenuOpen(false);
    textareaRef.current.focus();
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.menu-container') && !e.target.closest('.plus-btn')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center w-full rounded-lg bg-gray-50 p-2">
      {/* Plus button */}
      <div className="relative flex-shrink-0">
        <button
          onClick={toggleMenu}
          className="plus-btn p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="menu-container absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
              onClick={() => handleMenuSelect('file')}
            >
              <FileText className="w-4 h-4" /> Upload File
            </button>
            <button
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
              onClick={() => handleMenuSelect('code')}
            >
              <Code className="w-4 h-4" /> Insert Code
            </button>
            <button
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
              onClick={() => handleMenuSelect('web search')}
            >
            <Globe className='w-4 h-4'/> Web Search
            </button>
          </div>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onInput={handleInput}
        placeholder="Type your message..."
        onKeyPress={handleKeyPress}
        className="flex-1 ml-2 min-h-[40px] max-h-52 p-2 text-base leading-6 bg-gray-50 rounded-lg resize-none overflow-hidden focus:outline-none"
      />

      {/* Send button */}
      <button
      onClick={handleSend}
        disabled={!message.trim()}
        className={`ml-2 p-2 rounded-full transition-colors duration-200 ${
          message.trim()
            ? 'bg-blue-600 text-white hover:bg-indigo-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <SendIcon className='h-5 w-5' />
      </button>
    </div>
  );
}

export default InputSection;
