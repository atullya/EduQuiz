"use client";
import { useEffect, useState } from "react";
import axios from "axios";

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
        console.log("Progress data:", res.data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg border border-red-200">
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }
  const formatChapter = (chapter) => {
    // Convert to string and trim
    let ch = chapter.toString().trim();

    // Remove any existing "chapter" word (case-insensitive)
    ch = ch.replace(/chapter\s*/i, "");

    // Return with "Chapter X" format
    return `Chapter ${ch}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            My Quiz Performance
          </h1>
          <p className="text-gray-600">
            Track your progress and see how you're improving!
          </p>
        </div>

        {!progress || progress.totalAttempts === 0 ? (
          <div className="text-center border-2 border-dashed border-gray-300 p-8 rounded-lg bg-white">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-xl font-medium text-gray-700 mb-2">
              No quizzes attempted yet.
            </p>
            <p className="text-gray-500">
              Start taking quizzes to see your progress here!
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="border border-blue-200 p-6 rounded-lg bg-white shadow-sm">
                <p className="text-sm text-blue-600 font-medium mb-1">
                  Total Attempts
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {progress.totalAttempts}
                </p>
                <p className="text-xs text-gray-500 mt-1">Quizzes completed</p>
              </div>
              <div className="border border-green-200 p-6 rounded-lg bg-white shadow-sm">
                <p className="text-sm text-green-600 font-medium mb-1">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {progress.averageScore.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Overall performance
                </p>
              </div>
              <div className="border border-purple-200 p-6 rounded-lg bg-white shadow-sm">
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Correct Answers
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  {progress.totalCorrectAnswers}
                </p>
                <p className="text-xs text-gray-500 mt-1">Right responses</p>
              </div>
              <div className="border border-orange-200 p-6 rounded-lg bg-white shadow-sm">
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Questions Answered
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  {progress.totalQuestionsAnswered}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total questions</p>
              </div>
            </div>

            {/* Performance Indicator */}
            <div className="mb-6 p-4 rounded-lg bg-white border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {progress.averageScore >= 80
                      ? "🎉 Excellent Performance!"
                      : progress.averageScore >= 60
                      ? "👍 Good Work!"
                      : "💪 Keep Practicing!"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {progress.averageScore >= 80
                      ? "You're doing amazing! Keep it up!"
                      : progress.averageScore >= 60
                      ? "You're on the right track. Keep improving!"
                      : "Don't give up! Practice makes perfect!"}
                  </p>
                </div>
                <div className="text-2xl">
                  {progress.averageScore >= 80
                    ? "🌟"
                    : progress.averageScore >= 60
                    ? "📈"
                    : "🎯"}
                </div>
              </div>
            </div>

            {/* Attempts Table */}
            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Quiz Attempts
              </h2>
              {attempts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">📝</div>
                  <p className="text-gray-600">No recent attempts available.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b-2 border-gray-200 bg-gray-50">
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Class
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Section
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Subject
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-700">
                          Chapter
                        </th>
                        <th className="py-3 px-4 text-right font-semibold text-gray-700">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((attempt, index) => (
                        <tr
                          key={attempt._id}
                          className={`border-b hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="py-3 px-4 text-gray-700">
                            {new Date(attempt.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {attempt.class?.name || attempt.class}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {attempt.section}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {attempt.subject}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {formatChapter(attempt.chapter)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`font-bold px-3 py-1 rounded-full text-sm ${
                                attempt.score >= 80
                                  ? "bg-green-100 text-green-800"
                                  : attempt.score >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {attempt.score.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
