import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { apiService } from "../../services/apiServices";
import AddAssignmentDialogue from "./TeacherComponents/AddAssignmentDialogue";

const AssignmentPage = ({ user }) => {
  const [assignments, setAssignments] = useState([]);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);

  const fetchAssignments = async () => {
    try {
      const data = await apiService.getMyAssignedWithSubmissions();
      setAssignments(data);
    } catch (err) {
      console.error("Failed to fetch assignments:", err.message);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
        <Button
          onClick={() => setIsAssignmentOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <AddAssignmentDialogue
        open={isAssignmentOpen}
        onOpenChange={setIsAssignmentOpen}
        onAssignmentAdded={fetchAssignments}
        user={user} // Refresh assignments after adding
      />

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card
            key={assignment._id}
            className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {assignment.title}
                    </h4>
                    {assignment.priority && (
                      <Badge
                        className={
                          assignment.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : assignment.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {assignment.priority} priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {assignment.subject} {assignment.class.grade}{" "}
                    {assignment.class.section}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {assignment.dueDate.slice(0, 10)}
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="text-lg font-bold text-gray-900">
                    {assignment.submittedCount}/{assignment.totalStudents}
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                      style={{
                        width: `${
                          (assignment.submittedCount /
                            assignment.totalStudents) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(
                      (assignment.submittedCount / assignment.totalStudents) *
                        100
                    )}
                    % complete
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssignmentPage;
