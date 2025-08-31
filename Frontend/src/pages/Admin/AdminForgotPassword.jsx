import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiServices";
import axios from "axios";
export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email }
      );
      console.log(res.data); // <-- check what comes here
      setToken(res.data.token);
      setMessage(res.data.message);
    } catch (err) {
      console.log(err.response?.data); // <-- check backend error
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-20 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Enter your admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button className="bg-blue-600 text-white p-2 rounded">
          Request Reset
        </button>
      </form>

      {message && <p className="mt-3 text-gray-700">{message}</p>}
      {token && (
        <div className="mt-2 text-sm bg-gray-100 p-2 rounded break-all">
          Reset Token: {token}
        </div>
      )}

      {token && (
        <button
          onClick={() => navigate(`/admin/reset-password/${token}`)}
          className="mt-3 bg-green-600 text-white p-2 rounded"
        >
          Go to Reset Password
        </button>
      )}
    </div>
  );
}
