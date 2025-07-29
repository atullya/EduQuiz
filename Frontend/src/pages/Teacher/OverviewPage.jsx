import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Plus,
} from "lucide-react";
import { apiService } from "../../services/apiServices";
import { useEffect, useState } from "react";

const OverviewPage = ({ user, setActiveTab }) => {
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
      fetchTeacherStats();
    }
  }, [user?._id, user?.role]);

  return (
    <div className="max-w-8xl mx-auto p-6">
      {/* Simple Header */}
      <div className="bg-blue-500 rounded-lg p-6 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Hello, {user?.profile.firstName}!
        </h1>
        <p className="text-blue-100">Here's what's happening in your classes</p>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">My Classes</h3>
            <p className="text-2xl font-bold text-gray-900">
              {classStatus?.totalClasses || 0}
            </p>
            <p className="text-sm text-gray-500">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Students</h3>
            <p className="text-2xl font-bold text-gray-900">
              {classStatus?.totalUniqueStudents || 0}
            </p>
            <p className="text-sm text-gray-500">Total students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Assignments</h3>
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-500">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Avg Score</h3>
            <p className="text-2xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Simple Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              className="w-full h-12 text-lg"
              onClick={() => setActiveTab("assignments")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Assignment
            </Button>
            <Button variant="outline" className="w-full h-12 text-lg">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
