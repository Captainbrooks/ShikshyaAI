import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SendIcon, BookOpenIcon, UserIcon } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when chat updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { sender: "user", text: message, time: timestamp };

    setChat(prev => [...prev, userMsg]);

    setMessage("");
    setIsTyping(true);

    try {
      // Convert chat to OpenAI messages format
      const messagesForAI = chat
        .map(c => ({ role: c.sender === "user" ? "user" : "assistant", content: c.text }))
        .concat([{ role: "user", content: message }]);

      const res = await axios.post("http://localhost:5000/api/chat", { messages: messagesForAI });

      const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChat(prev => [...prev, { sender: "bot", text: res.data.answer, time: botTimestamp }]);
    } catch (err) {
      console.error(err);
      const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setChat(prev => [...prev, { sender: "bot", text: "AI error. Try again.", time: botTimestamp }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = msg => {
    // Detect code blocks
    const codeRegex = /```(.*?)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(msg)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: msg.substring(lastIndex, match.index) });
      }
      parts.push({ type: "code", language: match[1] || "javascript", content: match[2] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < msg.length) {
      parts.push({ type: "text", content: msg.substring(lastIndex) });
    }

    return parts.map((p, idx) =>
      p.type === "text" ? (
        <span key={idx}>{p.content}</span>
      ) : (
        <SyntaxHighlighter key={idx} language={p.language} style={materialLight}>
          {p.content}
        </SyntaxHighlighter>
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-purple-50 w-full">
      <header className="bg-white shadow-sm p-4 flex items-center justify-center">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto w-full">
          <BookOpenIcon className="text-indigo-600 h-8 w-8" />
          <h1 className="text-2xl font-bold text-indigo-700">ShikshyaAI</h1>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-md h-full flex flex-col">
          <div className="p-4 border-b border-gray-100 text-center">
            <h2 className="text-lg font-medium text-gray-700">Welcome to ShikshyaAI</h2>
            <p className="text-sm text-gray-500">Your friendly learning assistant for Nepali students</p>
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <BookOpenIcon className="h-12 w-12 mb-3 text-indigo-200" />
                <p className="text-lg">Ask me anything about your studies!</p>
                <p className="text-sm">I'm here to help with your learning journey.</p>
              </div>
            )}

            {chat.map((m, idx) => (
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

          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`ml-2 p-2 rounded-full transition-colors duration-200 ${message.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                <SendIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
