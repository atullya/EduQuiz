"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContexts";
import Topbar from "./AdminComponent/Topbar";
// import Sidebar from "./AdminComponent/SideBar"
import Sidebar from "./AdminComponent/Sidebar";
import AdminOverview from "./AdminComponent/AdminOverview";
import StudentSegment from "./AdminComponent/StudentSegment";
import TeacherSegment from "./AdminComponent/TeacherSegment";
import ClassSegment from "./AdminComponent/ClassesComponent/ClassSegment";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("teachers");
  const { checkAuth, user } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        <Topbar user={user} />
        <main className="p-6">
          {/* Render content based on active tab */}
          {activeTab === "overview" && (
            <AdminOverview user={user} setActiveTab={setActiveTab} />
          )}
          {activeTab === "students" && <StudentSegment user={user} />}
          {activeTab === "teachers" && <TeacherSegment user={user} />}
          {activeTab === "classes" && <ClassSegment user={user} />}
          {/* {activeTab === "settings" && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Settings
              </h2>
              <p className="text-gray-600">
                Settings content will be displayed here
              </p>
            </div>
          )} */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
