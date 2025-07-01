import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContexts";
const StudenDashboard = () => {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  return <div>StudentDashboard</div>;
};

export default StudenDashboard;
