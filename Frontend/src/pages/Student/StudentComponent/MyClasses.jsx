"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  UserIcon,
} from "lucide-react";
import { apiService } from "../../../services/apiServices";

export default function MyClasses({ user }) {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAssignedClassesStudent(user._id);
      console.log("Student stats:", data.enrolledClasses);
      setEnrolledClasses(data.enrolledClasses);
    } catch (err) {
      console.error("Failed to fetch student stats", err);
      setError("Failed to load classes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    console.log("Fetching classes for user:", user._id);

    if (user.role === "student") {
      fetchStudentStats();
    } else {
      setError("You are not authorized to view student classes.");
      setLoading(false);
    }
  }, [user?._id]);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">Loading user info...</div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading your classes...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="font-sans antialiased">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            My Enrolled Classes
          </h2>
        </div>
        <div className="grid gap-6">
          {enrolledClasses.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No classes found.
            </div>
          ) : (
            enrolledClasses.map((classItem) => (
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
                            {classItem.totalStudents} students
                          </div>
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
                          {classItem.teacher && (
                            <div className="flex items-center">
                              <UserIcon className="w-4 h-4 mr-1" />
                              Teacher: {classItem.teacher.name} (
                              {classItem.teacher.email})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl">
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
