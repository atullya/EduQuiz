// Directory structure suggestion:
// components/
//   ClassCard.jsx
//   ProgressDialog.jsx
//   DeleteConfirmationDialog.jsx
// pages/
//   StatsPage.jsx (this will be the new main file)

// --- File: components/ClassCard.jsx ---
"use client";

import {
  BookOpen,
  CheckCircle,
  FileText,
  GraduationCap,
  Trash2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ClassCard({
  classItem,
  handleDeleteClick,
  handleViewQuizzes,
  isDeleting,
}) {
  return (
    <Card
      key={classItem.classId}
      className="relative border border-gray-100 bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 flex flex-col overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-500 to-purple-900 rounded-t-3xl opacity-80"></div>
      <CardContent className="p-6 flex-grow flex flex-col z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg -mt-10 border-4 border-white">
              <BookOpen className="w-10 h-10 text-purple-700" />
            </div>
            <div className="flex-grow pt-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {classItem.className}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 text-sm">
                  Section {classItem.section}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-purple-300 text-purple-700 text-sm"
                >
                  Grade {classItem.grade}
                </Badge>
                {classItem.subject && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-sm">
                    {classItem.subject}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 mt-2">
          <Badge className="bg-purple-600 text-white flex items-center gap-2 px-4 py-2 text-base font-semibold rounded-full shadow-md">
            <FileText className="w-4 h-4" />
            Total Quizzes: {classItem.quizCount}
          </Badge>
          <div className="flex flex-wrap gap-2 mt-3">
            {classItem.statusBreakdown.published > 0 && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Published: {classItem.statusBreakdown.published}
              </Badge>
            )}
            {classItem.statusBreakdown.draft > 0 && (
              <Badge className="bg-gray-200 text-gray-600 flex items-center gap-1 px-2.5 py-0.5 rounded-full">
                <XCircle className="w-3 h-3" />
                Draft: {classItem.statusBreakdown.draft}
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
          <Button
            onClick={() => handleDeleteClick(classItem)}
            variant="destructive"
            className="w-full sm:w-auto"
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Quizzes
          </Button>
          <Button
            onClick={() => handleViewQuizzes(classItem)}
            className="w-full sm:w-auto"
          >
            View Progress <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// The other two components ProgressDialog.jsx and DeleteConfirmationDialog.jsx are also needed. Shall I continue with those next?
