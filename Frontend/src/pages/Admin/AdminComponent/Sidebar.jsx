import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
// import ProfileSection from "./ProfileSection";
// import SideBarItems from "./SideBarItems";
import {
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Edit,
  MapPin,
  School,
  UserCheck,
  BarChart3,
  TrendingUp,
  Activity,
  Plus,
  Search,
  Menu,
  X,
  Bell,
  Home,
  FileText,
  ChevronRight,
  Sparkles,
  Target,
  Shield,
  Database,
} from "lucide-react";
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
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">EduDash</h2>
              <p className="text-xs text-gray-500">Admin Portal</p>
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
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {/* {user?.profile?.firstName} {user?.profile?.lastName} */}
                {user?.username || "Loading..."}
              </p>
              <p className="text-xs text-gray-500 truncate">
                System Administrator
              </p>
            </div>
            {/* <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Admin Profile</DialogTitle>
                    <DialogDescription>
                      Update your administrative information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="profile.firstName"
                          value={profileData.profile.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="profile.lastName"
                          value={profileData.profile.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="profile.phone"
                        value={profileData.profile.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
                      >
                        Update Profile
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog> */}
          </div>
        </div>
        <SideBarItems activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Navigation */}
        {/* <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav> */}

        {/* Logout */}
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
