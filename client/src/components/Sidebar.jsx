import React, { useEffect, useRef, useState } from "react";
import {
  BookOpenIcon,
  SquarePen,
  CircleUser,
  Settings,
  LogOut,
  SettingsIcon,
  ChevronUp
} from "lucide-react";
import axios from "axios"
import clsx from "clsx";
import { useParams } from "react-router-dom";

import { Link, useNavigate } from "react-router-dom";
import "../css/scrollbar.css"
import { motion } from "framer-motion";
import { MessageCircle, GraduationCap } from "lucide-react";



const Sidebar = ({ activeTab, setActiveTab }) => {
  const [userSetting, setUserSetting] = useState(false);
  const [titles, setTitles] = useState([])
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { chatId } = useParams();


  const handleNewChat = async () => {

    navigate("/");
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




  useEffect(() => {
    const fetchChats = async () => {


      try {
        const res = await axios.get(`http://localhost:5000/api/get-chats`, {
          withCredentials: true
        });



        const allChats = res.data.chats.map(chat => ({
          _id: chat._id,
          title: chat.title
        }));

        setTitles(allChats)






      } catch (error) {
        console.log("error: ", error)
      }

    }

    fetchChats();
  }, [])









  return (
    <div className="h-full flex flex-col justify-center bg-white border-r border-gray-200 w-64 py-2 relative">
      {/* Logo */}
      <div className="px-6 mb-8 py-3.5 border-b-2 border-gray-50">
        <div className="flex justify-center items-center space-x-2">
          <BookOpenIcon className="text-indigo-600 h-8 w-8" />
          <Link to={"/"}>
            <h1 className="text-xl font-bold text-indigo-700">ShikshyaAI</h1>
          </Link>
        </div>
      </div>

      {/* New Conversation */}


      <div className="px-6 my-2">

        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-colors duration-150">
          <SquarePen className="w-4 h-4" />
          <span className="text-sm font-medium">New Conversation</span>
        </button>

      </div>

      {/* Navigation Tabs */}
      <div className="px-3 my-4">
        <div className="relative bg-gray-100 p-1 rounded-xl flex text-sm font-medium">
          {/* Animated background pill */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-blue-500 shadow-sm ${activeTab === "Chats" ? "left-1" : "left-[50%]"
              }`}
          />

          {/* Chats */}
          <button
            onClick={() => setActiveTab("Chats")}
            className={`relative z-10 flex items-center justify-center space-x-2 py-2 w-1/2 rounded-lg transition-colors ${activeTab === "Chats"
              ? "text-white"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chats</span>
          </button>

          {/* Quizzes */}
          <button
            onClick={() => setActiveTab("Quizzes")}
            className={`relative z-10 flex items-center justify-center space-x-2 py-2 w-1/2 rounded-lg transition-colors ${activeTab === "Quizzes"
              ? "text-white"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Quizzes</span>
          </button>
        </div>
      </div>
      {/* Recent Conversations */}
      <div className="px-6 flex-1 overflow-y-scroll scroll-smooth scrollbar-custom">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Recent Conversations
        </h2>


        {activeTab === "Chats" && (
          <div className="overflow-auto space-y-2">
            {titles.map((chat) => (
              <Link
                key={chat._id}
                to={`/c/${chat._id}`}
                className={clsx(
                  "block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150",
                  chat._id === chatId ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {chat.title}
              </Link>
            ))}
          </div>
        )}



        {
          activeTab && activeTab === "Quizzes" &&
          <div className="space-y-2">
            {["Great Pyramid of Giza Quiz", "Mathematics Quiz", "Science Quiz"].map(
              (title, index) => (
                <button
                  key={index}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 
                ${index === 0
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

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setUserSetting(!userSetting)}
          className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-200 transition-colors duration-150"
        >
          <div className="flex items-center space-x-3">
            <img
              src="https://api.dicebear.com/7.x/initials/svg?seed=Milton%20Gaire"
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-gray-300 object-cover"
            />
            <span className="text-sm font-medium text-gray-800 truncate">
              Milton Gaire
            </span>
          </div>

          <ChevronUp
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${userSetting ? "rotate-180" : "rotate-0"
              }`}
          />
        </button>

        {userSetting && (
          <div className="absolute bottom-14 left-0 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <ul className="py-1 text-sm text-gray-700">
              <li>
                <button
                  onClick={() => alert("Settings clicked")}
                  className="flex w-full items-center px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2 text-gray-500" /> Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("Logging out...")}
                  className="flex w-full items-center px-4 py-2 hover:bg-gray-50 text-red-600 transition-colors"
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
