"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ChevronRight, XCircle } from "lucide-react";
import { apiService } from "../../../services/apiServices";

export default function MainMCQ({ user }) {
  const [chapterCards, setChapterCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStudentClassesWithQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getClassesWithQuizzes(user._id);

      const flattenedChapters = [];
      data.enrolledClasses.forEach((cls) => {
        cls.subjects.forEach((subject) => {
          subject.chapters.forEach((chapter) => {
            flattenedChapters.push({
              classId: cls.classId,
              className: cls.className,
              section: cls.section,
              grade: cls.grade,
              roomNo: cls.roomNo,
              teacher: cls.teacher,
              subject: subject.subject,
              chapter: chapter.chapter,
              quizCount: chapter.quizCount,
              totalStudents: cls.totalStudents,
              hasQuizzes: chapter.quizCount > 0,
              alreadyAttempted: false,
            });
          });
        });
      });

      setChapterCards(flattenedChapters);
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
    return <div className="p-6 text-center text-gray-600">Loading user info...</div>;
  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading your classes...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  const formatChapter = (chapter) => {
    let ch = chapter.toString().trim();
    ch = ch.replace(/chapter\s*/i, "");
    return `Chapter ${ch}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Quiz Chapters</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {chapterCards.length === 0 ? (
            <div className="col-span-full p-6 text-center text-gray-600 bg-white rounded shadow">
              <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
              <p>No quizzes found.</p>
            </div>
          ) : (
            chapterCards.map((item) => (
              <Card
                key={`${item.classId}-${item.subject}-${item.chapter}`}
                className="bg-white rounded shadow-sm"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.className}</h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm">
                          <Badge className="bg-gray-200 text-gray-800">
                            Section {item.section}
                          </Badge>
                          <Badge className="bg-gray-200 text-gray-800">
                            Grade {item.grade}
                          </Badge>
                          <Badge className="bg-gray-200 text-gray-800">
                            {item.subject}
                          </Badge>
                          <Badge className="bg-gray-200 text-gray-800">
                            {formatChapter(item.chapter)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col mt-3 gap-2">
                    {item.hasQuizzes ? (
                      <>
                        <Button
                          onClick={() =>
                            navigate(
                              `/quiz?classId=${item.classId}&section=${item.section}&subject=${item.subject}&chapter=${item.chapter}`,
                              { state: { userId: user._id } }
                            )
                          }
                          disabled={item.alreadyAttempted}
                          className={`w-full py-2 text-white rounded ${
                            item.alreadyAttempted ? "bg-gray-400" : "bg-green-600"
                          }`}
                        >
                          {item.alreadyAttempted ? "Quiz Completed" : `Start Quiz (${item.quizCount})`}
                        </Button>

                        <Button
                          onClick={() =>
                            navigate(
                              `/quiz/details?studentId=${user._id}&classId=${item.classId}&section=${item.section}&subject=${item.subject}&chapter=${item.chapter}`
                            )
                          }
                          className="w-full py-2 text-white rounded bg-purple-600 mt-1"
                        >
                          View Details
                        </Button>
                      </>
                    ) : (
                      <Badge className="bg-gray-200 text-gray-800 flex items-center gap-1 px-2 py-1">
                        <XCircle className="w-4 h-4" /> No Quizzes
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                    <Users className="w-4 h-4" />
                    <span>{item.totalStudents} students</span>
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
