import React, { useEffect, useRef, useState } from "react";
import {
  BookOpenIcon,
  MessageCircleIcon,
  GraduationCapIcon,
  SquarePen,
  CircleUser,
  Settings,
  LogOut,
} from "lucide-react";
import axios from "axios"

import { Link, useNavigate } from "react-router-dom";




const Sidebar = ({ activeTab, setActiveTab }) => {
  const [userSetting, setUserSetting] = useState(false);
  const dropdownRef = useRef(null);
  const navigate=useNavigate();

  const userId=Math.floor(Math.random() * 99999 + 1);


  const handleNewChat=async()=>{
    try {
          const res=await axios.post("http://localhost:5000/api/chat/new",{userId:userId});
    console.log(res)
    const chatId=res.data._id;

    navigate(`/c/${chatId}`)
    } catch (error) {
      console.log(error)
    }

  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserSetting(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 w-64 py-6 relative">
      {/* Logo */}
      <div className="px-6 mb-8 py-1.5 border-b-2 border-gray-50">
        <div className="flex justify-center items-center space-x-2">
          <BookOpenIcon className="text-indigo-600 h-8 w-8" />
          <h1 className="text-xl font-bold text-indigo-700">ShikshyaAI</h1>
        </div>
      </div>

      {/* New Conversation */}
      <div className="px-6 my-6">
       
        <button 
        onClick={handleNewChat}
        className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-colors duration-150">
          <SquarePen className="w-4 h-4" />
          <span className="text-sm font-medium">New Conversation</span>
        </button>
      
      </div>

      {/* Navigation Tabs */}
      <div className="px-3 mb-8">
        <div className="bg-gray-50 p-1 rounded-lg flex">
          <button
            onClick={() => setActiveTab("Chats")}
            className={`flex items-center justify-center rounded-md space-x-2 py-2 px-4 w-1/2 transition-all duration-200 ${
              activeTab === "Chats"
                ? "shadow-sm text-white bg-blue-500"
                : "text-gray-500 hover:text-gray-700 border-r-2 border-gray-300"
            }`}
          >
            <MessageCircleIcon className="h-4 w-4" />
            <span className="font-medium text-sm">Chats</span>
          </button>
          <button
            onClick={() => setActiveTab("Quizzes")}
            className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-md w-1/2 transition-all duration-200 ${
              activeTab === "Quizzes"
                ? "bg-blue-500 shadow-sm text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <GraduationCapIcon className="h-4 w-4" />
            <span className="font-medium text-sm">Quizzes</span>
          </button>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="px-6 flex-1">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Recent Conversations
        </h2>


        {
          activeTab && activeTab === "Chats" &&
        <div className="space-y-2">
          {["Math Homework", "Science Questions", "History Quiz Prep"].map(
            (title, index) => (
              <button
                key={index}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 
                ${
                  index === 0
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {title}
              </button>
            )
          )}
        </div>
}

{
  activeTab && activeTab === "Quizzes" &&
   <div className="space-y-2">
          {["Great Pyramid of Giza Quiz", "Mathematics Quiz", "Science Quiz"].map(
            (title, index) => (
              <button
                key={index}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 
                ${
                  index === 0
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {title}
              </button>
            )
          )}
        </div>
}
      </div>

      {/* User profile + dropdown */}
      <div className="px-6 relative" ref={dropdownRef}>
        <button
          onClick={() => setUserSetting(!userSetting)}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-gray-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
        >
          <CircleUser className="w-6 h-6" />
          <span className="text-sm font-medium">Milton Gaire</span>
        </button>

        {userSetting && (
          <div className="absolute bottom-14 left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
            <ul className="py-2 text-sm text-gray-700">
              <li>
                <button
                  onClick={() => alert("Settings clicked")}
                  className="flex w-full items-center px-4 py-2 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("Logging out...")}
                  className="flex w-full items-center px-4 py-2 hover:bg-gray-50 text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
