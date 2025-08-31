import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from "../../../services/apiServices";
import { User, Mail, Phone, Lock, IdCard, BookOpen, Users } from "lucide-react";

const EditStudentDialog = ({ open, onOpenChange, studentId, existingData }) => {
  const [profileData, setProfileData] = useState({
    profile: {
      firstName: "",
      lastName: "",
      phone: "",
      studentId: "",
      class: "",
      section: "",
    },
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (open && existingData) {
      setProfileData({
        profile: {
          firstName: existingData.profile?.firstName || "",
          lastName: existingData.profile?.lastName || "",
          phone: existingData.profile?.phone || "",
          studentId: existingData.profile?.studentId || "",
          class: existingData.profile?.class || "",
          section: existingData.profile?.section || "",
        },
        email: existingData.email || "",
        password: "",
      });
    }
  }, [open, studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, key] = name.split(".");
      setProfileData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await apiService.updateStudentProfile(studentId, profileData);
      alert("Profile updated successfully!");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl shadow-2xl animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Edit Student Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update your personal and academic information here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleProfileUpdate} className="space-y-6 pt-2">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <Input
                  id="firstName"
                  name="profile.firstName"
                  value={profileData.profile.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="pl-10"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <Input
                  id="lastName"
                  name="profile.lastName"
                  value={profileData.profile.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="pl-10"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                placeholder="student@email.com"
                className="pl-10"
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Input
                id="phone"
                name="profile.phone"
                value={profileData.profile.phone}
                onChange={handleInputChange}
                placeholder="9800000000"
                className="pl-10"
              />
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                value={profileData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="pl-10"
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentDialog;
