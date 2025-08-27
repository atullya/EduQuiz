"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { apiService } from "../../../services/apiServices";

export default function MainMCQ({ user }) {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStudentClassesWithQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      // API should return enrolledClasses with alreadyAttempted & hasQuizzes flags
      const data = await apiService.getClassesWithQuizzes(user._id);
      setEnrolledClasses(data.enrolledClasses);
    } catch (err) {
      setError("Failed to load classes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id && user.role === "student") {
      fetchStudentClassesWithQuizzes();
    } else if (user && user.role !== "student") {
      setError("You are not authorized to view student classes.");
      setLoading(false);
    }
  }, [user?._id]);

  if (!user)
    return (
      <div className="p-6 text-center text-gray-600">Loading user info...</div>
    );
  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">
        Loading your classes...
      </div>
    );
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            My Enrolled Classes
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrolledClasses.length === 0 ? (
            <div className="col-span-full p-10 text-center text-gray-600 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">No classes found.</p>
              <p className="text-sm text-gray-500 mt-1">
                It looks like you haven't been assigned to any classes yet.
              </p>
            </div>
          ) : (
            enrolledClasses.map((classItem) => (
              <Card
                key={classItem.classId}
                className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col"
              >
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {classItem.className}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            Section {classItem.section}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-purple-300 text-purple-700"
                          >
                            Grade {classItem.grade}
                          </Badge>
                          {classItem.subject && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              {classItem.subject}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    {classItem.hasQuizzes ? (
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1 px-3 py-1.5 text-base font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Quizzes Available ({classItem.quizzesCount})
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-200 text-gray-600 flex items-center gap-1 px-3 py-1.5 text-base font-semibold">
                        <XCircle className="w-4 h-4" />
                        No Quizzes
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-gray-600 flex-grow">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{classItem.totalStudents} students</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                    {/* Show View Details only if quiz was attempted */}

                    <Button
                      onClick={() =>
                        navigate(
                          `/quiz/details?studentId=${user._id}&classId=${classItem.classId}&section=${classItem.section}&subject=${classItem.subject}`
                        )
                      }
                      className="flex-grow bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl py-2.5"
                    >
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>

                    {/* Start Quiz button */}
                    {classItem.hasQuizzes && (
                      <Button
                        onClick={() =>
                          navigate(
                            `/quiz?classId=${classItem.classId}&section=${classItem.section}&subject=${classItem.subject}`,
                            { state: { userId: user._id } }
                          )
                        }
                        disabled={classItem.alreadyAttempted}
                        className={`flex-grow rounded-xl py-2.5 text-white ${
                          classItem.alreadyAttempted
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {classItem.alreadyAttempted
                          ? "Quiz Completed"
                          : "Start Quiz"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
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
