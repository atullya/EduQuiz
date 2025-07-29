"use client"

import { School, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import SideBarItems from "./SideBarItems"
import { apiService } from "../../../services/apiServices"

const handleLogout = async () => {
  try {
    const res = await apiService.logout()
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, user }) => (
  <div>
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">EduDash</h2>
              <p className="text-sm text-gray-500">Admin Portal</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
              {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.username || "Loading..."}</p>
              <p className="text-xs text-gray-500 truncate">System Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <SideBarItems activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
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

    {/* Mobile Overlay */}
    {sidebarOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
    )}
  </div>
)

export default Sidebar
