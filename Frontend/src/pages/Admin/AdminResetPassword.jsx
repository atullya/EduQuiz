import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        { newPassword }
      );
      setMessage(res.data.message);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.log(err.response?.data); // for debugging
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-20 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Admin Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button className="bg-green-600 text-white p-2 rounded">
          Reset Password
        </button>
      </form>

      {message && <p className="mt-3 text-gray-700">{message}</p>}
    </div>
  );
}
