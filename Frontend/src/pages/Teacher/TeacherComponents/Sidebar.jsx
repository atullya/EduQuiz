import React, { useEffect, useState } from "react";
import { GraduationCap, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileSection from "./ProfileSection";
import SideBarItems from "./SideBarItems";

import { apiService } from "../../../services/apiServices";
let handleLogout = async () => {
  try {
    const res = await apiService.logout();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  user,
}) => (
  <div>
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo + Name */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">EduDash</h2>
              <p className="text-xs text-gray-500">Teacher Portal</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Profile Section */}
        <ProfileSection user={user} />

        <SideBarItems activeTab={activeTab} setActiveTab={setActiveTab} />
    <div className="p-4 border-t border-gray-200/50">
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Logout
      </Button>
    </div>
      </div>
    </div>
  </div>
);

export default Sidebar;
