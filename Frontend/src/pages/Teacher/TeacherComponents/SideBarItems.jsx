// SideBarItems.jsx
import React from "react";
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  Home,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react";

const SideBarItems = ({ activeTab, setActiveTab }) => {
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "classes", label: "My Classes", icon: BookOpen },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "students", label: "Students", icon: Users },
    // { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "analytics", label: "MCQ's", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: Settings },
  ];

  return (
    <nav className="p-4 space-y-2">
      {sidebarItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
            activeTab === id
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
          {activeTab === id && <ChevronRight className="h-4 w-4 ml-auto" />}
        </button>
      ))}
    </nav>
  );
};

export default SideBarItems;
