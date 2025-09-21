"use client"

import React, { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import { SettingsIcon, PanelLeft, CircleUser, ChevronDown } from "lucide-react"
import InputSection from "./InputSection"
import ChatSection from "./ChatSection"

export default function Layout({ children }) {
    const [activeTab, setActiveTab] = useState('Chats')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Show sidebar by default on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition duration-200 ease-in-out z-30 md:relative md:translate-x-0 w-64 bg-white shadow-lg`}
      >
        {/* Close button only on small screens */}
        <div className="flex justify-end md:hidden p-2">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <PanelLeft className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Sidebar content */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-100 p-4 flex items-center justify-between">
          {/* Mobile menu button */}
          <div>

          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md inline-flex items-center justify-center text-gray-500 hover:text-gray-600 hover:bg-gray-200 md:hidden"
              aria-label="Open sidebar"
            >
              <PanelLeft className="h-6 w-6 text-gray-500" />
            </button>
          )}

</div>
          {/* Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-700">{activeTab}</h1>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-2">
       
            <button className="rounded-full p-2 bg-gray-50 text-gray-500 hover:bg-gray-100">
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
            <ChatSection/>
        </main>
      </div>
    </div>
  )
}
