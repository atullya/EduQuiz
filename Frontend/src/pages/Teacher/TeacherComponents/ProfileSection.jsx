import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "./EditProfileDialog";
import { useAuth } from "../../../contexts/AuthContexts";

const ProfileSection = ({ user }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  //   const { checkAuth, user } = useAuth();

  //   useEffect(() => {
  //     checkAuth();
  //   }, []);

  //   useEffect(() => {
  //     console.log("User data in ProfileSection:", user);
  //   }, [user]);

  return (
    <div className="p-6 border-b border-gray-200/50">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
          {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user?.username || "Loading..."}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.role || "Unknown role"}
          </p>
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
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default ProfileSection;
