import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";
import OverviewPage from "../OverviewPage";
import { useAuth } from "../../../contexts/AuthContexts";
import ClassesPage from "../ClassesPage";
import AssignmentPage from "../AssignmentPage";
import MCQmain from "../MCQPage/MCQmain";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");
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
        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
        />
        <main className="p-6 flex-1 overflow-auto">
          {/* Render content based on active tab */}
          {activeTab === "overview" && <OverviewPage user={user} />}
          {activeTab === "classes" && <ClassesPage user={user} />}
          {activeTab === "assignments" && <AssignmentPage user={user} />}
          {activeTab === "students" && <div>👨‍🎓 Students content here</div>}
          {activeTab === "schedule" && <div>📅 Schedule content here</div>}
          {activeTab === "analytics" && <MCQmain user={user} />}
          {activeTab === "settings" && <div>⚙️ Settings content here</div>}
        </main>
      </div>
    </div>
  );
};

export default Layout;
