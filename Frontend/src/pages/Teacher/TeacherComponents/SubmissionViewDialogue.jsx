"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const SubmissionViewDialogue = ({
  open,
  onOpenChange,
  submissionText,
  studentName,
  assignmentTitle,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Student Submission
          </DialogTitle>
          <DialogDescription>
            Submission from <span className="font-semibold">{studentName}</span>{" "}
            for "<span className="font-semibold">{assignmentTitle}</span>"
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-4 border rounded-md bg-gray-50 text-gray-800 whitespace-pre-wrap">
          {submissionText || "No submission text provided."}
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionViewDialogue;
