"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, Loader2, Edit, Eye } from "lucide-react"; // Import Eye icon
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiService } from "../../services/apiServices";
import AddAssignmentDialogue from "./TeacherComponents/AddAssignmentDialogue";
import EditAssignmentDialogue from "./TeacherComponents/EditAssignmentDialogue";
import AssignmentDetailsDialogue from "./TeacherComponents/AssignmentDetailsDialogue"; // Import the new details dialog

const AssignmentPage = ({ user }) => {
  const [assignments, setAssignments] = useState([]);
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
  const [assignmentToEdit, setAssignmentToEdit] = useState(null); // State to store assignment data for editing

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false); // State for details dialog
  const [assignmentIdForDetails, setAssignmentIdForDetails] = useState(null); // State to store assignment ID for details

  const fetchAssignments = async () => {
    try {
      const data = await apiService.getMyAssignedWithSubmissions();
      setAssignments(data);
    } catch (err) {
      console.error("Failed to fetch assignments:", err.message);
    }
  };

  // Function to handle delete button click
  const handleDeleteClick = (assignmentId) => {
    setAssignmentToDelete(assignmentId);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm and execute deletion
  const confirmDelete = async () => {
    if (!assignmentToDelete) return;

    setIsDeleting(true);
    try {
      const res = await apiService.deleteAssignedAssignment(assignmentToDelete);
      if (res.success) {
        console.log("Assignment deleted successfully.");
        fetchAssignments(); // Refresh assignments list
      } else {
        console.error("Failed to delete assignment:", res.message);
      }
    } catch (err) {
      console.error("Error deleting assignment:", err.message);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
  };

  // Function to handle edit button click
  const handleEditClick = (assignment) => {
    setAssignmentToEdit(assignment);
    setIsEditDialogOpen(true);
  };

  // Function to handle view details button click
  const handleViewDetailsClick = (assignmentId) => {
    setAssignmentIdForDetails(assignmentId);
    setIsDetailsDialogOpen(true);
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
        onAssignmentAdded={fetchAssignments} // Refresh assignments after adding
        user={user}
      />
      {assignmentToEdit && ( // Only render EditAssignmentDialogue if an assignment is selected for editing
        <EditAssignmentDialogue
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onAssignmentUpdated={fetchAssignments} // Refresh assignments after updating
          assignment={assignmentToEdit}
          user={user}
        />
      )}
      {assignmentIdForDetails && ( // Only render AssignmentDetailsDialogue if an assignment ID is selected
        <AssignmentDetailsDialogue
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          assignmentId={assignmentIdForDetails}
        />
      )}
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
                    {/* Display subject as a badge */}
                    {assignment.subject && (
                      <Badge className="bg-blue-100 text-blue-800 text-sm px-2.5 py-0.5 rounded-full">
                        {assignment.subject}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">
                    Grade {assignment.class.grade} Section{" "}
                    {assignment.class.section}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due: {assignment.dueDate.slice(0, 10)}
                  </div>
                </div>
                <div className="text-right space-y-2 flex flex-col items-end">
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
                  <div className="flex gap-2 mt-2">
                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetailsClick(assignment._id)}
                      className="text-purple-600 hover:text-purple-800 border-purple-600 hover:border-purple-800"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(assignment)}
                      className="text-blue-600 hover:text-blue-800 border-blue-600 hover:border-blue-800"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(assignment._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting && assignmentToDelete === assignment._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              assignment and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssignmentPage;
