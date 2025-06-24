// Topbar.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";

const Topbar = ({ sidebarOpen, setSidebarOpen, activeTab }) => (
  <header className="bg-white/80  backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {activeTab}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
      </div>
    </div>
  </header>
);

export default Topbar;
