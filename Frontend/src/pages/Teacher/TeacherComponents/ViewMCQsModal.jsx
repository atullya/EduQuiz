"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, User, Calendar, CheckCircle, X } from "lucide-react";

export default function ViewMCQsModal({
  isOpen,
  onClose,
  mcqs,
  loading,
  error,
  classInfo,
}) {
  if (!classInfo) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOptionStyle = (option, correctAnswer) => {
    if (option.key === correctAnswer) {
      return "bg-green-100 border-green-300 text-green-800";
    }
    return "bg-gray-50 border-gray-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[900px] max-w-[900px] h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-8 py-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            MCQs - {classInfo.subject}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            Class: {classInfo.className} | Section: {classInfo.section}
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading MCQs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          ) : !mcqs || mcqs.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No MCQs Found
                </p>
                <p className="text-gray-500 mb-4">
                  No MCQs have been created for this class yet.
                </p>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Header */}
              <div className="px-6 py-3 bg-blue-50 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-800">
                    Total MCQs: {mcqs.length}
                  </span>
                  <span className="text-blue-600">
                    Subject: {classInfo.subject}
                  </span>
                </div>
              </div>

              {/* MCQs List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {mcqs.map((mcq, index) => (
                    <Card key={mcq.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded flex-shrink-0">
                              Q{index + 1}
                            </span>
                            <span className="flex-1 break-words">
                              {mcq.question}
                            </span>
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {mcq.duration}s
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {mcq.teacher?.username}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(mcq.createdAt)}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700">
                            Options:
                          </p>
                          <div className="space-y-2">
                            {mcq.options.map((option) => (
                              <div
                                key={option._id}
                                className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${getOptionStyle(
                                  option,
                                  mcq.correctAnswer
                                )}`}
                              >
                                <span className="font-medium min-w-[20px] flex-shrink-0">
                                  {option.key}.
                                </span>
                                <span className="flex-1 break-words">
                                  {option.value}
                                </span>
                                {option.key === mcq.correctAnswer && (
                                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs font-medium text-green-800">
                              Correct Answer: {mcq.correctAnswer}
                            </p>
                            {mcq.explanation && (
                              <p className="text-xs text-green-700 mt-1 break-words">
                                Explanation: {mcq.explanation}
                              </p>
                            )}
                          </div>

                          {/* <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {mcq.questionType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Grade {mcq.class?.grade}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Section {mcq.class?.section}
                            </Badge>
                          </div> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
          <Button onClick={onClose} variant="outline">
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
