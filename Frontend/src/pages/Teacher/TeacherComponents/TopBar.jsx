"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell, X } from "lucide-react";
import { apiService } from "../../../services/apiServices";

const Topbar = ({ sidebarOpen, setSidebarOpen, activeTab, user }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    console.log("User ID for fetching notifications:", user?._id);
    if (!user?._id) return;

    const fetchNotifications = async () => {
      try {
        const response = await apiService.getNotifications();
        console.log("Fetched notifications:", response);
        if (response.success) {
          setNotifications(response.notifications || []);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [user?._id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark notification as read
  const handleNotificationClick = async (id) => {
    const notification = notifications.find((n) => n._id === id);
    if (!notification || notification.readBy.includes(user._id)) return;

    try {
      const response = await apiService.markNotificationRead(id);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, readBy: [...n.readBy, user._id] } : n
          )
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.readBy.includes(user._id)
  ).length;

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left */}
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

        {/* Right */}
        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs flex items-center justify-center rounded-full px-1 font-medium shadow-sm">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-lg">
                  Notifications
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDropdown(false)}
                  className="hover:bg-gray-200 rounded-full w-8 h-8 p-0 transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isRead = notif.readBy.includes(user._id);
                    return (
                      <div
                        key={notif._id}
                        onClick={() => handleNotificationClick(notif._id)}
                        className={`px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0 ${
                          !isRead ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              !isRead ? "bg-blue-500" : "bg-gray-400"
                            }`}
                          >
                            <Bell className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm leading-relaxed ${
                                !isRead
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0] || "A"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
