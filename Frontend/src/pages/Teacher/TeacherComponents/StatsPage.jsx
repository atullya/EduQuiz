"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ClassCard from "./ClassCard";
import ProgressDialog from "./ProgressDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import ViewMCQsModal from "./ViewMCQsModal";
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

  // MCQ Modal states
  const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
  const [mcqsData, setMcqsData] = useState([]);
  const [mcqsLoading, setMcqsLoading] = useState(false);
  const [mcqsError, setMcqsError] = useState(null);
  const [selectedClassForMCQs, setSelectedClassForMCQs] = useState(null);

  const fetchSubjectsOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMCQwithClasses(user?._id);
      console.log("Fetched subjects with MCQs:", data);
      if (data.success) {
        setSubjectsWithMCQs(data.subjectsWithMCQs);
      } else {
        setError("Failed to fetch MCQ overview.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherProgressDetails = async (
    classId,
    section,
    subject,
    chapter
  ) => {
    setDialogLoading(true);
    setDialogError(null);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/smcq/teacher/progress?classId=${classId}&section=${section}&subject=${subject}&chapter=${chapter}`
      );
      console.log("Progress data:", res.data);
      if (res.data.success) {
        setSelectedClassProgress(res.data.progress);
      } else {
        setDialogError("Failed to fetch progress.");
      }
    } catch (err) {
      setDialogError("Error getting progress.");
    } finally {
      setDialogLoading(false);
    }
  };

  const fetchMCQs = async (classId, teacherId, subject, chapter) => {
    setMcqsLoading(true);
    setMcqsError(null);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/smcq/all-mcqs?classId=${classId}&teacherId=${teacherId}&subject=${subject}&chapter=${chapter}`
      );
      if (res.data.success) {
        setMcqsData(res.data.mcqs);
      } else {
        setMcqsError("Failed to fetch MCQs.");
      }
    } catch (err) {
      console.error("Error fetching MCQs:", err);
      setMcqsError("Error loading MCQs.");
    } finally {
      setMcqsLoading(false);
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
      const { classId, section, subject, chapter } = deleteTarget;
      const res = await axios.delete(
        `http://localhost:3000/api/smcq/teacher/delete-mcqs`,
        {
          params: {
            teacherId: user?._id,
            classId,
            section,
            subject,
            chapter,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        fetchSubjectsOverview();
      }
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleViewQuizzes = (classItem) => {
    setDialogClassOverview(classItem);
    setIsDialogOpen(true);
    fetchTeacherProgressDetails(
      classItem.classId,
      classItem.section,
      classItem.subject,
      classItem.chapter
    );
  };

  const handleViewMCQs = (classItem) => {
    setSelectedClassForMCQs(classItem);
    setIsMCQModalOpen(true);
    fetchMCQs(
      classItem.classId,
      user?._id,
      classItem.subject,
      classItem.chapter
    );
  };

  useEffect(() => {
    if (user?.role === "teacher" && user?._id) {
      fetchSubjectsOverview();
    } else if (user) {
      setError("You are not authorized to view this page.");
      setLoading(false);
    }
  }, [user?._id]); // Updated dependency to user

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user info...</p>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading data...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="border border-red-400 p-4 rounded bg-red-50">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Quiz Dashboard</h2>
          <p className="text-gray-600 text-sm mt-1">
            Your class-wise quiz list
          </p>
        </div>

        {subjectsWithMCQs.length === 0 ? (
          <div className="border border-gray-300 p-6 rounded text-center">
            <h3 className="text-lg font-medium mb-2">No Quizzes Found</h3>
            <p className="text-sm text-gray-600">
              You haven't created any quizzes yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {subjectsWithMCQs.map((classItem) => (
              <ClassCard
                key={`${classItem.classId}-${classItem.subject}-${classItem.chapter}`}
                classItem={classItem}
                handleDeleteClick={handleDeleteClick}
                handleViewQuizzes={handleViewQuizzes}
                handleViewMCQs={handleViewMCQs}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
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

      <ViewMCQsModal
        isOpen={isMCQModalOpen}
        onClose={() => setIsMCQModalOpen(false)}
        mcqs={mcqsData}
        loading={mcqsLoading}
        error={mcqsError}
        classInfo={selectedClassForMCQs}
      />
    </div>
  );
}
