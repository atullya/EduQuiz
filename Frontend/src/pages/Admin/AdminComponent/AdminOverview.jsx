import React, { useEffect } from "react";
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
import { apiService } from "../../../services/apiServices";
const AdminOverview = ({ user }) => {
 
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
  const [count, setCount] = React.useState(0);
  const getAllStats = async () => {
    try {
      const response = await apiService.getAllStats();
      setCount(response);
    //   console.log("Stats fetched successfully:", response);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  useEffect(() => {
    if (user && user.role === "admin") {
      getAllStats();
    }
  }, []);
  return (
    <div className="space-y-8">
      {" "}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 to-yellow-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                Welcome back, {user?.username}! 👑
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
                  {count.totalStudents}
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
                  {count.totalTeachers}
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
                  {count.totalClasses}
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
      </div>
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
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
