"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, CheckCircle, XCircle, User, Eye } from "lucide-react"; // Import Eye icon
import { apiService } from "../../../services/apiServices";
import { format } from "date-fns";
import SubmissionViewDialogue from "./SubmissionViewDialogue"; // Import the new submission view dialog

const AssignmentDetailsDialogue = ({ open, onOpenChange, assignmentId }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSubmissionViewOpen, setIsSubmissionViewOpen] = useState(false);
  const [currentSubmissionText, setCurrentSubmissionText] = useState("");
  const [currentStudentName, setCurrentStudentName] = useState("");

  useEffect(() => {
    if (open && assignmentId) {
      const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await apiService.getAssignmentSubmissions(assignmentId);
          setDetails(data);
        } catch (err) {
          console.error("Failed to fetch assignment details:", err);
          setError(err.message || "Failed to load assignment details.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setDetails(null); // Clear details when dialog closes
    }
  }, [open, assignmentId]);

  const handleViewSubmissionClick = (submissionText, studentName) => {
    setCurrentSubmissionText(submissionText);
    setCurrentStudentName(studentName);
    setIsSubmissionViewOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Assignment Details
          </DialogTitle>
          <DialogDescription>
            {details?.assignmentTitle
              ? `Submissions for "${details.assignmentTitle}"`
              : "Loading assignment details..."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 flex-grow">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Loading submission details...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 flex-grow">{error}</div>
        ) : !details ? (
          <div className="p-6 text-center text-gray-600 flex-grow">
            No details found.
          </div>
        ) : (
          <ScrollArea className="flex-grow pr-4 -mr-4">
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Submitted: {details.submittedCount}
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Not Submitted: {details.notSubmitted.length}
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  Total Students: {details.totalStudents}
                </div>
              </div>

              <Separator />

              {details.submissions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" /> Submitted
                    Students
                  </h3>
                  <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[200px]">
                            Student Name
                          </TableHead>
                          <TableHead>Submitted At</TableHead>
                          <TableHead className="text-right">
                            Submission
                          </TableHead>{" "}
                          {/* New column */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {details.submissions.map((submission) => (
                          <TableRow
                            key={submission.student._id}
                            className="hover:bg-green-50 transition-colors"
                          >
                            <TableCell className="font-semibold text-base py-3">
                              {submission.student.profile?.firstName}{" "}
                              {submission.student.profile?.lastName}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {submission.submittedAt &&
                                format(
                                  new Date(submission.submittedAt),
                                  "PPP p"
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewSubmissionClick(
                                    submission.submissionText,
                                    `${submission.student.profile?.firstName} ${submission.student.profile?.lastName}`
                                  )
                                }
                                disabled={!submission.submissionText} // Disable if no text
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {details.notSubmitted.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" /> Not Submitted
                    Students
                  </h3>
                  <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[200px]">
                            Student Name
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {details.notSubmitted.map((student) => (
                          <TableRow
                            key={student._id}
                            className="hover:bg-red-50 transition-colors"
                          >
                            <TableCell className="font-semibold text-base py-3">
                              {student.profile?.firstName}{" "}
                              {student.profile?.lastName}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>

      {/* Submission View Dialog */}
      <SubmissionViewDialogue
        open={isSubmissionViewOpen}
        onOpenChange={setIsSubmissionViewOpen}
        submissionText={currentSubmissionText}
        studentName={currentStudentName}
        assignmentTitle={details?.assignmentTitle}
      />
    </Dialog>
  );
};

export default AssignmentDetailsDialogue;
