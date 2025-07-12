"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { apiService } from "../../../services/apiServices";

const SubmitAssignmentDialogue = ({
  open,
  onOpenChange,
  assignment,
  onSubmissionSuccess,
}) => {
  const [submissionText, setSubmissionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && assignment) {
      // Pre-fill with existing submission if available
      setSubmissionText(assignment.submission?.submissionText || "");
      setError(null); // Clear previous errors
    }
  }, [open, assignment]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.submitAssignment(
        assignment._id,
        submissionText
      );
      if (res.success) {
        console.log("Assignment submitted successfully:", res.message);
        onSubmissionSuccess(); // Callback to refresh the parent list
        onOpenChange(false); // Close the dialog
      } else {
        setError(res.message || "Failed to submit assignment.");
        console.error("Failed to submit assignment:", res.message);
      }
    } catch (err) {
      setError(err.message || "Error submitting assignment.");
      console.error("Error submitting assignment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {assignment?.isSubmitted ? "Edit Submission" : "Submit Assignment"}
          </DialogTitle>
          <DialogDescription>
            {assignment?.isSubmitted
              ? `You can update your submission for "${assignment?.title}".`
              : `Submit your work for "${assignment?.title}".`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="submissionText" className="text-base">
              Your Submission
            </Label>
            <Textarea
              id="submissionText"
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Type your assignment submission here..."
              rows={10}
              className="min-h-[150px]"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : assignment?.isSubmitted ? (
              "Update Submission"
            ) : (
              "Submit Assignment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitAssignmentDialogue;
