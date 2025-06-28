import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContexts";
import Layout from "./Layout";
// import Layout from "./TeacherComponents/Layout";

const TeacherDashboard = () => {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setLoading(false); // Auth check done
    };
    verify();
  }, [checkAuth]);
  useEffect(() => {
    if (user) {
      if (user.role !== "admin") {
        // Redirect if user is not a teacher
        window.location.href = "/";
      }
    }
  }, [user]);

  if (loading) {
    // Show spinner or blank while auth state is loading
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect only after loading finishes and user is not present
    window.location.href = "/";
    return null; // Prevent rendering anything after redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* <Layout></Layout> */}
      <Layout />
      asdf
    </div>
  );
};

export default TeacherDashboard;
