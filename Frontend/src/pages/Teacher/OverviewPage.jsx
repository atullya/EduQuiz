import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  TrendingUp,
  Activity,
  Plus,
} from "lucide-react";
import { apiService } from "../../services/apiServices";
import { useEffect, useState } from "react";

const OverviewPage = ({ user }) => {
  const [classStatus, setClassStatus] = useState("");

  const fetchTeacherStats = async () => {
    try {
      const data = await apiService.getAssignedClasses(user?._id);
      setClassStatus(data);
    } catch (err) {
      console.error("Failed to fetch teacher stats", err.message);
    }
  };

  useEffect(() => {
    if (user?.role === "teacher" && user?._id) {
      fetchTeacherStats(); // ✅ fixed function call
    }
  }, [user?._id, user?.role]);

  return (
    <div className="font-sans antialiased">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 tracking-tight">
                  Welcome back, {user?.profile.firstName} 👋
                </h1>
                <p className="text-purple-100 text-lg font-medium">
                  Ready to inspire minds today?
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-semibold tracking-wide">
                    My Classes
                  </p>
                  <p className="text-3xl font-bold text-blue-700 tracking-tight">
                    {classStatus?.totalClasses || 0}
                  </p>
                  <p className="text-blue-500 text-xs mt-1 font-medium">
                    Active this semester
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
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
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-green-700 tracking-tight">
                    {classStatus?.totalUniqueStudents || 0}
                  </p>
                  <p className="text-green-500 text-xs mt-1 font-medium">
                    Across all classes
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-green-200/50 rounded-full"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-semibold tracking-wide">
                    Assignments
                  </p>
                  <p className="text-3xl font-bold text-orange-700 tracking-tight">
                    8
                  </p>
                  <p className="text-orange-500 text-xs mt-1 font-medium">
                    Pending review
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-orange-200/50 rounded-full"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-semibold tracking-wide">
                    Avg. Performance
                  </p>
                  <p className="text-3xl font-bold text-purple-700 tracking-tight">
                    94%
                  </p>
                  <p className="text-purple-500 text-xs mt-1 font-medium">
                    This month
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-purple-200/50 rounded-full"></div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
                <Plus className="mr-2 h-5 w-5" />
                Create Assignment
              </Button>
              <Button className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
                <Users className="mr-2 h-5 w-5" />
                Take Attendance
              </Button>
              <Button className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
