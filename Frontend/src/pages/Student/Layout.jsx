import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContexts";
import Sidebar from "./StudentComponent/Sidebar";
import Topbar from "./StudentComponent/Topbar";
import OverViewPage from "./StudentComponent/OverViewPage";
import MainMCQ from "./TakeMCQPage/MainMCQ";
import MyClasses from "./StudentComponent/MyClasses";
import StudentProgress from "./StudentComponent/StudentProgress";
import AssignmentStudent from "./StudentComponent/AssignmentStudent";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("quiz");
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
        <Topbar />
        <main className="p-6 flex-1 overflow-auto">
          {/* Render content based on active tab */}
          {activeTab === "overview" && (
            <div>
              <OverViewPage user={user} />
            </div>
          )}
          {activeTab === "assignment" && (
            <div>
              {" "}
              <AssignmentStudent user={user} />
            </div>
          )}
          {activeTab === "teachers" && <div>sdfds</div>}
          {activeTab === "classes" && (
            <div>
              <MyClasses user={user} />
            </div>
          )}
          {activeTab === "quiz" && (
            <div>
              {" "}
              <MainMCQ user={user} />
            </div>
          )}
          {/* {activeTab === "reports" && <div>📅 Schedule content here</div>}
          {activeTab === "system" && <div>⚙️ Settings content here</div>} */}
          {activeTab === "reports" && (
            <div>
              <StudentProgress studentId={user._id} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;
