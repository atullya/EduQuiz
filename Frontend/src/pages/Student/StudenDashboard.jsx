import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContexts";
import Layout from "./Layout";
const StudenDashboard = () => {
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
      if (user.role !== "student") {
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
    <div>
      StudentDashboard
      <Layout />
    </div>
  );
};

export default StudenDashboard;
