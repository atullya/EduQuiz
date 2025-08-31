import React, { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditStudentDialog from "./EditStudentDialog";

const StudentProfile = ({ user }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div className="p-6 border-b border-gray-200/50">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
          {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user?.username || "Loading..."}
          </p>
          <p className="text-xs text-gray-500 truncate">Student Dashboard</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Profile Dialog */}
      <EditStudentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        studentId={user?._id}
        existingData={user}
      />
    </div>
  );
};

export default StudentProfile;
