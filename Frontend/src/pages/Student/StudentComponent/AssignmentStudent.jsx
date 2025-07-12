"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, User, Eye, Send, Edit } from "lucide-react";
import { apiService } from "../../../services/apiServices";
import { format } from "date-fns";
import SubmissionViewDialogue from "../../Teacher/TeacherComponents/SubmissionViewDialogue";
import SubmitAssignmentDialogue from "./SubmitAssignmentDialogue";
// import SubmissionViewDialogue from "../assignments/TeacherComponents/SubmissionViewDialogue"; // Re-use this
// import SubmitAssignmentDialogue from "../assignments/StudentComponents/SubmitAssignmentDialogue"; // New submission dialog

const AssignmentStudent = ({ user }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [assignmentToSubmit, setAssignmentToSubmit] = useState(null);

  const [isViewSubmissionOpen, setIsViewSubmissionOpen] = useState(false);
  const [currentSubmissionText, setCurrentSubmissionText] = useState("");
  const [currentStudentName, setCurrentStudentName] = useState(""); // Will be current user's name
  const [currentAssignmentTitle, setCurrentAssignmentTitle] = useState("");

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getStudentAssignments();
      if (res.success) {
        setAssignments(res.assignments);
      } else {
        setError(res.message || "Failed to fetch assignments.");
      }
    } catch (err) {
      console.error("Failed to fetch student assignments:", err);
      setError(
        err.message || "Error fetching assignments. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "student" && user?._id) {
      fetchAssignments();
    } else if (user) {
      setError("You are not authorized to view this page.");
      setLoading(false);
    }
  }, [user?._id]);

  const handleOpenSubmitDialog = (assignment) => {
    setAssignmentToSubmit(assignment);
    setIsSubmitDialogOpen(true);
  };

  const handleOpenViewSubmissionDialog = (submissionText, assignmentTitle) => {
    setCurrentSubmissionText(submissionText);
    setCurrentStudentName(
      `${user?.profile?.firstName || ""} ${
        user?.profile?.lastName || ""
      }`.trim()
    );
    setCurrentAssignmentTitle(assignmentTitle);
    setIsViewSubmissionOpen(true);
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-6 text-center text-gray-600">Loading user info...</p>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-6 text-center text-gray-600">
          Loading your assignments...
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            <BookOpen className="inline-block h-10 w-10 mr-3 text-purple-700" />
            My Assignments
          </h2>
          <p className="text-lg text-gray-600">
            View and submit your assigned tasks.
          </p>
        </div>

        <div className="space-y-6">
          {assignments.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
              <Calendar className="w-16 h-16 text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold mb-2">
                No Assignments Yet!
              </h3>
              <p className="text-md text-gray-600 max-w-md">
                It looks like your teachers haven't assigned any tasks for your
                class. Check back later!
              </p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <Card
                key={assignment._id}
                className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-xl font-bold text-gray-900">
                        {assignment.title}
                      </h4>
                      {assignment.subject && (
                        <Badge className="bg-blue-100 text-blue-800 text-sm px-2.5 py-0.5 rounded-full">
                          {assignment.subject}
                        </Badge>
                      )}
                      {assignment.isSubmitted ? (
                        <Badge className="bg-green-100 text-green-800 text-sm px-2.5 py-0.5 rounded-full">
                          Submitted
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-red-300 text-red-800 text-sm px-2.5 py-0.5 rounded-full"
                        >
                          Not Submitted
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 text-base">
                      {assignment.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {format(new Date(assignment.dueDate), "PPP")}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      Assigned by: {assignment.teacher.firstName}{" "}
                      {assignment.teacher.lastName}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                    {assignment.isSubmitted ? (
                      <Button
                        onClick={() =>
                          handleOpenViewSubmissionDialog(
                            assignment.submission.submissionText,
                            assignment.title
                          )
                        }
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full py-3 font-semibold shadow-md"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Submission
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleOpenSubmitDialog(assignment)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full py-3 font-semibold shadow-md"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Submit Assignment
                      </Button>
                    )}
                    {assignment.isSubmitted && ( // Allow editing submitted assignments
                      <Button
                        onClick={() => handleOpenSubmitDialog(assignment)}
                        variant="outline"
                        className="text-blue-600 hover:text-blue-800 border-blue-600 hover:border-blue-800 rounded-full py-3 font-semibold shadow-md"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Submission
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Submit/Edit Assignment Dialog */}
      {assignmentToSubmit && (
        <SubmitAssignmentDialogue
          open={isSubmitDialogOpen}
          onOpenChange={setIsSubmitDialogOpen}
          assignment={assignmentToSubmit}
          onSubmissionSuccess={fetchAssignments} // Refresh list after submission
        />
      )}

      {/* View Submission Dialog */}
      <SubmissionViewDialogue
        open={isViewSubmissionOpen}
        onOpenChange={setIsViewSubmissionOpen}
        submissionText={currentSubmissionText}
        studentName={currentStudentName}
        assignmentTitle={currentAssignmentTitle}
      />
    </div>
  );
};

export default AssignmentStudent;
