"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Target,
  CheckSquare,
  ClipboardList,
  History,
  Award,
  BookOpen,
} from "lucide-react";

const StudentProgress = ({ studentId }) => {
  const [progress, setProgress] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setError("Student ID is required.");
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/smcq/student/progress/${studentId}`
        );
        if (res.data.success) {
          setProgress(res.data.progress);
          setAttempts(res.data.attempts);
        } else {
          setError("Failed to fetch progress.");
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError(
          "Error fetching progress. Please check your network connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [studentId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-6 text-center text-gray-600">
          Loading quiz progress...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-6 text-center text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          My Quiz Performance
        </h2>

        {!progress || progress.totalAttempts === 0 ? (
          <Card className="p-12 text-center bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
            <Award className="w-16 h-16 text-yellow-500 mb-6" />
            <CardTitle className="text-2xl font-semibold mb-2">
              No Quizzes Attempted Yet
            </CardTitle>
            <p className="text-md text-gray-600 max-w-md">
              Start taking quizzes to see your progress and performance here!
            </p>
          </Card>
        ) : (
          <>
            {/* Progress Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Attempts
                  </CardTitle>
                  <BarChart className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-700">
                    {progress.totalAttempts}
                  </div>
                  <p className="text-xs text-gray-500">Quizzes completed</p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                  <Target className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-700">
                    {progress.averageScore.toFixed(2)}%
                  </div>
                  <p className="text-xs text-gray-500">Across all attempts</p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Correct Answers
                  </CardTitle>
                  <CheckSquare className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-700">
                    {progress.totalCorrectAnswers}
                  </div>
                  <p className="text-xs text-gray-500">
                    Total correct responses
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Questions Answered
                  </CardTitle>
                  <ClipboardList className="h-5 w-5 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-700">
                    {progress.totalQuestionsAnswered}
                  </div>
                  <p className="text-xs text-gray-500">Total questions faced</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Quiz Attempts Table */}
            <Card className="bg-white rounded-xl shadow-lg p-6">
              <CardTitle className="text-2xl font-bold mb-6 flex items-center gap-2">
                <History className="h-6 w-6 text-gray-700" />
                Recent Quiz Attempts
              </CardTitle>
              {attempts.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    No recent attempts to display.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your quiz history will appear here after you complete a
                    quiz.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Score (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attempts.map((attempt) => (
                        <TableRow
                          key={attempt._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {new Date(attempt.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {attempt.class?.name || attempt.class}
                          </TableCell>
                          <TableCell>{attempt.section}</TableCell>
                          <TableCell>{attempt.subject}</TableCell>
                          <TableCell className="text-right font-semibold">
                            <span
                              className={`${
                                attempt.score >= 70
                                  ? "text-green-600"
                                  : attempt.score >= 50
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {attempt.score.toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
