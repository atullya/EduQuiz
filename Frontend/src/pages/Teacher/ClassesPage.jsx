import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
} from "lucide-react";
import { apiService } from "../../services/apiServices";
const ClassesPage = ({ user }) => {
  const [classStatus, setClassStatus] = useState([]);
  const fetchTeacherStats = async () => {
    try {
      // Assuming user is logged in and is a teacher
      const data = await apiService.getAssignedClasses(user?._id);
      console.log("Teacher stats in classes:", data.classStudentCounts);
      setClassStatus(data.classStudentCounts);
      // Do something with the data (set to state, render, etc.)
    } catch (err) {
      console.error("Failed to fetch teacher stats", err.message);
    }
  };
  useEffect(() => {
    if (user && user.role === "teacher") {
      fetchTeacherStats();
    }
  }, [user]);
  return (
    <div className="font-sans antialiased">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
        <div className="grid gap-6">
          {classStatus?.map((classItem) => (
            <Card
              key={classItem.classId}
              className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {classItem.className}
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
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {classItem.studentCount} students
                        </div>
                        {classItem.maxStudents && (
                          <div className="flex items-center">
                            Max: {classItem.maxStudents}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {classItem.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          Room {classItem.roomNo}
                        </div>
                        <div className="flex items-center">
                          📅 {classItem.schedule?.join(", ")}
                        </div>
                      </div>
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
    </div>
  );
};

export default ClassesPage;
