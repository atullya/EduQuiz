"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Edit,
  MapPin,
  School,
  UserCheck,
  BarChart3,
  TrendingUp,
  Activity,
  Plus,
  Search,
  Menu,
  X,
  Bell,
  Home,
  FileText,
  ChevronRight,
  Sparkles,
  Target,
  Shield,
  Database,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState({
    username: "admin_atullya",
    email: "admin@atullya.edu",
    profile: {
      firstName: "Atullya",
      lastName: "Admin",
      phone: "+1 (555) 999-0000",
      address: "123 Admin Street, Education City, EC 12345",
    },
  });

  // Mock admin user data
  const user = {
    username: "admin_atullya",
    email: "admin@atullya.edu",
    role: "admin",
    profile: {
      firstName: "Atullya",
      lastName: "Admin",
      phone: "+1 (555) 999-0000",
      address: "123 Admin Street, Education City, EC 12345",
    },
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsEditDialogOpen(false);
    alert("Profile updated successfully!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const profileField = name.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Mock data for admin dashboard
  const mockStats = {
    totalStudents: 1250,
    totalTeachers: 85,
    totalClasses: 45,
    totalSubjects: 12,
    activeUsers: 1180,
    pendingApprovals: 8,
  };

  const mockClasses = [
    {
      id: 1,
      name: "Mathematics",
      section: "A",
      grade: "10",
      students: 28,
      teacher: "Mr. John Smith",
      room: "101",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: 2,
      name: "Physics",
      section: "B",
      grade: "11",
      students: 25,
      teacher: "Dr. Sarah Johnson",
      room: "201",
      color: "from-green-500 to-teal-600",
    },
    {
      id: 3,
      name: "Chemistry",
      section: "A",
      grade: "12",
      students: 22,
      teacher: "Prof. Michael Brown",
      room: "301",
      color: "from-orange-500 to-red-600",
    },
  ];

  const mockTeachers = [
    {
      id: 1,
      name: "John Smith",
      subject: "Mathematics",
      classes: 3,
      students: 85,
      experience: "8 years",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      subject: "Physics",
      classes: 2,
      students: 60,
      experience: "12 years",
    },
    {
      id: 3,
      name: "Michael Brown",
      subject: "Chemistry",
      classes: 2,
      students: 55,
      experience: "15 years",
    },
    {
      id: 4,
      name: "Emily Davis",
      subject: "English",
      classes: 4,
      students: 120,
      experience: "6 years",
    },
  ];

  const mockStudents = [
    {
      id: 1,
      name: "Alice Johnson",
      class: "10A",
      grade: "A",
      attendance: "95%",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      class: "11B",
      grade: "B+",
      attendance: "92%",
      status: "Active",
    },
    {
      id: 3,
      name: "Carol Wilson",
      class: "12A",
      grade: "A-",
      attendance: "98%",
      status: "Active",
    },
    {
      id: 4,
      name: "David Brown",
      class: "10B",
      grade: "B",
      attendance: "88%",
      status: "Warning",
    },
  ];

  const mockRecentActivities = [
    {
      id: 1,
      action: "New student enrolled",
      user: "Alice Johnson",
      time: "2 hours ago",
      type: "enrollment",
    },
    {
      id: 2,
      action: "Class schedule updated",
      user: "John Smith",
      time: "4 hours ago",
      type: "schedule",
    },
    {
      id: 3,
      action: "Assignment created",
      user: "Sarah Johnson",
      time: "6 hours ago",
      type: "assignment",
    },
    {
      id: 4,
      action: "Grade submitted",
      user: "Michael Brown",
      time: "8 hours ago",
      type: "grade",
    },
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classes", label: "Classes", icon: BookOpen },
    { id: "mcq-generator", label: "MCQ Generator", icon: FileText },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "system", label: "System", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 to-yellow-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">
                      Welcome back, {user?.profile?.firstName}! 👑
                    </h1>
                    <p className="text-orange-100 text-lg font-medium">
                      Manage your school with confidence
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-semibold tracking-wide">
                        Total Students
                      </p>
                      <p className="text-3xl font-bold text-blue-700 tracking-tight">
                        {mockStats.totalStudents}
                      </p>
                      <p className="text-blue-500 text-xs mt-1 font-medium">
                        Enrolled this year
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-blue-200/50 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-semibold tracking-wide">
                        Total Teachers
                      </p>
                      <p className="text-3xl font-bold text-green-700 tracking-tight">
                        {mockStats.totalTeachers}
                      </p>
                      <p className="text-green-500 text-xs mt-1 font-medium">
                        Active faculty
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-green-200/50 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-semibold tracking-wide">
                        Total Classes
                      </p>
                      <p className="text-3xl font-bold text-purple-700 tracking-tight">
                        {mockStats.totalClasses}
                      </p>
                      <p className="text-purple-500 text-xs mt-1 font-medium">
                        Active classes
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-purple-200/50 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-semibold tracking-wide">
                        Active Users
                      </p>
                      <p className="text-3xl font-bold text-orange-700 tracking-tight">
                        {mockStats.activeUsers}
                      </p>
                      <p className="text-orange-500 text-xs mt-1 font-medium">
                        Online today
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-orange-200/50 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-semibold tracking-wide">
                        Pending Approvals
                      </p>
                      <p className="text-3xl font-bold text-red-700 tracking-tight">
                        {mockStats.pendingApprovals}
                      </p>
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        Requires attention
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-red-200/50 rounded-full"></div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-600 text-sm font-semibold tracking-wide">
                        System Health
                      </p>
                      <p className="text-3xl font-bold text-indigo-700 tracking-tight">
                        99.9%
                      </p>
                      <p className="text-indigo-500 text-xs mt-1 font-medium">
                        Uptime this month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-indigo-200/50 rounded-full"></div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold tracking-tight">
                  <Activity className="mr-3 h-6 w-6 text-indigo-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Student
                  </Button>
                  <Button className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
                    <Users className="mr-2 h-5 w-5" />
                    Add Teacher
                  </Button>
                  <Button className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Create Class
                  </Button>
                  <Button className="h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold tracking-tight">
                  <Activity className="mr-3 h-6 w-6 text-green-600" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.type === "enrollment"
                            ? "bg-blue-500"
                            : activity.type === "schedule"
                            ? "bg-green-500"
                            : activity.type === "assignment"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600">
                          by {activity.user}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "students":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Student Management
              </h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10 rounded-xl border-gray-300"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {mockStudents.map((student) => (
                <Card
                  key={student.id}
                  className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-gray-600">Class {student.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <Badge
                            className={`${
                              student.grade.includes("A")
                                ? "bg-green-100 text-green-800"
                                : student.grade.includes("B")
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {student.grade}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Grade</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">
                            {student.attendance}
                          </p>
                          <p className="text-xs text-gray-500">Attendance</p>
                        </div>
                        <div className="text-center">
                          <Badge
                            className={`${
                              student.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {student.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Status</p>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-xl border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "teachers":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Teacher Management
              </h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search teachers..."
                    className="pl-10 rounded-xl border-gray-300"
                  />
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-xl shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Teacher
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {mockTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {teacher.name}
                          </h4>
                          <p className="text-gray-600">
                            {teacher.subject} Teacher
                          </p>
                          <p className="text-sm text-gray-500">
                            {teacher.experience} experience
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">
                            {teacher.classes}
                          </p>
                          <p className="text-xs text-gray-500">Classes</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">
                            {teacher.students}
                          </p>
                          <p className="text-xs text-gray-500">Students</p>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-xl border-green-300 text-green-600 hover:bg-green-50"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "classes":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Class Management
              </h2>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </div>
            <div className="grid gap-6">
              {mockClasses.map((classItem) => (
                <Card
                  key={classItem.id}
                  className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${classItem.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {classItem.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              Section {classItem.section}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-purple-300 text-purple-700"
                            >
                              Grade {classItem.grade}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {classItem.students} students
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              Room {classItem.room}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Teacher: {classItem.teacher}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="rounded-xl border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Students
                        </Button>
                        <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl">
                          Manage
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "mcq-generator":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    MCQ Generator
                  </h2>
                  <p className="text-gray-600">
                    AI-Powered Question Generation
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center">
                  <Sparkles className="mr-3 h-6 w-6 text-purple-600" />
                  Generate MCQs for Your School
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-blue-200 hover:border-blue-400">
                    <CardContent className="p-6 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Text Input
                      </h3>
                      <p className="text-sm text-gray-600">
                        Generate questions from text content
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-purple-200 hover:border-purple-400">
                    <CardContent className="p-6 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        PDF Upload
                      </h3>
                      <p className="text-sm text-gray-600">
                        Extract and generate from PDF documents
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-lg px-8 py-3">
                    <Target className="mr-2 h-5 w-5" />
                    Start Generating MCQs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            Content for {activeTab}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Atullya Admin
                </h2>
                <p className="text-xs text-gray-500">School Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.profile?.firstName?.[0]}
                {user?.profile?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  System Administrator
                </p>
              </div>
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Admin Profile</DialogTitle>
                    <DialogDescription>
                      Update your administrative information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="profile.firstName"
                          value={profileData.profile.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="profile.lastName"
                          value={profileData.profile.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="profile.phone"
                        value={profileData.profile.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
                      >
                        Update Profile
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200/50">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {activeTab === "overview"
                      ? "Admin Dashboard"
                      : activeTab.replace("-", " ")}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.profile?.firstName?.[0]}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{renderContent()}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
