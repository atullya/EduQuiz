"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ClassCard from "./ClassCard";
import ProgressDialog from "./ProgressDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { LayoutDashboard, GraduationCap } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { apiService } from "../../../services/apiServices";

export default function StatsPage({ user }) {
  const [subjectsWithMCQs, setSubjectsWithMCQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogClassOverview, setDialogClassOverview] = useState(null);
  const [selectedClassProgress, setSelectedClassProgress] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubjectsOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMCQwithClasses(user?._id);
      if (data.success) {
        setSubjectsWithMCQs(data.subjectsWithMCQs);
      } else {
        setError("Failed to fetch MCQ overview.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error fetching MCQ overview. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherProgressDetails = async (classId, section, subject) => {
    setDialogLoading(true);
    setDialogError(null);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/smcq/teacher/progress?classId=${classId}&section=${section}&subject=${subject}`
      );
      if (res.data.success) {
        setSelectedClassProgress(res.data.progress);
      } else {
        setDialogError(res.data.message || "Failed to fetch progress details.");
      }
    } catch (err) {
      console.error("Progress Fetch Error:", err);
      setDialogError("Error fetching progress details.");
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeleteClick = (classItem) => {
    setDeleteTarget(classItem);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { classId, section, subject } = deleteTarget;
      const res = await axios.delete(
        `http://localhost:3000/api/smcq/teacher/delete-mcqs`,
        {
          params: {
            teacherId: user?._id,
            classId,
            section,
            subject,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        fetchSubjectsOverview();
      } else {
        console.error("Failed to delete:", res.data.message);
      }
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleViewQuizzes = (classItem) => {
    setDialogClassOverview(classItem);
    setIsDialogOpen(true);
    fetchTeacherProgressDetails(classItem.classId, classItem.section, classItem.subject);
  };

  useEffect(() => {
    if (user?.role === "teacher" && user?._id) {
      fetchSubjectsOverview();
    } else if (user) {
      setError("You are not authorized to view this page.");
      setLoading(false);
    }
  }, [user?._id]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-6 text-center text-gray-600">Loading user info...</p>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-6 text-center text-gray-600">
          Loading your classes and quizzes...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-6 text-center text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            <LayoutDashboard className="inline-block h-10 w-10 mr-3 text-purple-700" />
            Quiz Management Dashboard
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjectsWithMCQs.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center">
              <GraduationCap className="w-16 h-16 text-gray-400 mb-6" />
              <CardTitle className="text-2xl font-semibold mb-2">
                No Quizzes Created Yet
              </CardTitle>
              <p className="text-md text-gray-600 max-w-md">
                It looks like you haven't created any quizzes for your classes. Start creating to see them here!
              </p>
            </div>
          ) : (
            subjectsWithMCQs.map((classItem) => (
              <ClassCard
                key={`${classItem.classId}-${classItem.subject}`}
                classItem={classItem}
                handleDeleteClick={handleDeleteClick}
                handleViewQuizzes={handleViewQuizzes}
                isDeleting={isDeleting}
              />
            ))
          )}
        </div>
      </div>

      <ProgressDialog
        isOpen={isDialogOpen}
        onClose={setIsDialogOpen}
        classOverview={dialogClassOverview}
        loading={dialogLoading}
        error={dialogError}
        progressData={selectedClassProgress}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        classInfo={deleteTarget}
      />
    </div>
  );
}
