import React, { useEffect, useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar from "./TopBar";
// import OverviewPage from "../OverviewPage";
import { useAuth } from "../../contexts/AuthContexts";
import Header from "./AdminComponent/Topbar";
import Topbar from "./AdminComponent/Topbar";
import Sidebar from "./AdminComponent/SideBar";
import AdminOverview from "./AdminComponent/AdminOverview";
import StudentSegment from "./AdminComponent/StudentSegment";
import TeacherSegment from "./AdminComponent/TeacherSegment";
import ClassSegment from "./AdminComponent/ClassesComponent/ClassSegment";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("classes");
  const sidebarWidth = 256;
  const { checkAuth, user } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // console.log("User data in ProfileSection:", user);
  }, [user]);

  return (
    <div className="min-h-screen relative">
      {/* <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      /> */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />

      <div
        className="flex flex-col transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? sidebarWidth : 0,
          minHeight: "100vh",
        }}
      >
        <Topbar />
        <main className="p-6 flex-1 overflow-auto">
          {/* Render content based on active tab */}
          {activeTab === "overview" && <AdminOverview user={user} />}
          {activeTab === "students" && <StudentSegment user={user} />}
          {activeTab === "teachers" && <TeacherSegment user={user} />}
          {activeTab === "classes" && <ClassSegment user={user} />}
          {activeTab === "mcq-generator" && <div>📅 Schedule content here</div>}
          {activeTab === "reports" && <div>📅 Schedule content here</div>}
          {activeTab === "system" && <div>⚙️ Settings content here</div>}
          {activeTab === "settings" && <div>⚙️ Settings content here</div>}
        </main>
      </div>
    </div>
  );
};

export default Layout;
