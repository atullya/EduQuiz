import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard.jsx";
import { AuthProvider } from "./contexts/AuthContexts.jsx";

const allRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/teacherDashboard",
    element: <TeacherDashboard />,
  },
  {
    path: "/studentDashboard",
    element: <StudentDashboard />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={allRoutes} />
    </AuthProvider>
  </StrictMode>
);
