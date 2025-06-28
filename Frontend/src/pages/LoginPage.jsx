import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  // jane.teacher@example.com
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("1234567890");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);

      // Redirect based on role
      if (userData.role === "teacher") {
        navigate("/teacherDashboard");
      } else if (userData.role === "admin") {
        navigate("/adminDashboard");
      } else if (userData.role === "student") {
        navigate("/studentDashboard");
      } else {
        alert("Unknown role, contact admin");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={email}
        placeholder="Email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        value={password}
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
