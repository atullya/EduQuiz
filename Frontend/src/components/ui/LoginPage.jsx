"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    if (user.role === "teacher") {
      return <TeacherDashboard user={user} onLogout={handleLogout} />;
    } else if (user.role === "student") {
      return <StudentDashboard user={user} onLogout={handleLogout} />;
    }
  }

  const mockUsers = {
    teacher: {
      email: "teacher@school.edu",
      password: "teacher123",
      name: "Ms. Johnson",
    },
    student: {
      email: "student@school.edu",
      password: "student123",
      name: "Alex Smith",
    },
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors above" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    setTimeout(() => {
      const mockUser = mockUsers[formData.role];

      if (
        formData.email === mockUser.email &&
        formData.password === mockUser.password
      ) {
        setMessage({
          type: "success",
          text: `Welcome back, ${mockUser.name}! Redirecting to your dashboard...`,
        });

        setTimeout(() => {
          handleLogin({
            role: formData.role,
            name: mockUser.name,
            email: formData.email,
          });
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: "Invalid email or password. Please try again.",
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">School Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">I am a:</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger
                    className={errors.role ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Teacher
                      </div>
                    </SelectItem>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Student
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {message.text && (
                <Alert
                  className={
                    message.type === "success"
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }
                >
                  <div className="flex items-center gap-2">
                    {message.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription
                      className={
                        message.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {message.text}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Demo Credentials:
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  <strong>Teacher:</strong> teacher@school.edu / teacher123
                </div>
                <div>
                  <strong>Student:</strong> student@school.edu / student123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Need help? Contact the IT department</p>
        </div>
      </div>
    </div>
  );
}
