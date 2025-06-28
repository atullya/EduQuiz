"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  School,
  Users,
  BookOpen,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { apiService } from "../../../../services/apiServices";
const AddClassModal = ({ open, onOpenChange, onClassAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    grade: "",
    subjects: [],
    roomNo: "",
    schedule: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const grades = ["9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D", "E"];
  const availableSubjects = [
    "Science",
    "English",

    "Physics",
    "Chemistry",

    "Computer Science",
  ];
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubjectChange = (subject, checked) => {
    setFormData((prev) => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, subject]
        : prev.subjects.filter((s) => s !== subject),
    }));
    setError("");
  };

  const handleScheduleChange = (day, checked) => {
    setFormData((prev) => ({
      ...prev,
      schedule: checked
        ? [...prev.schedule, day]
        : prev.schedule.filter((d) => d !== day),
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Class name is required"), false;
    if (!formData.section) return setError("Section is required"), false;
    if (!formData.grade) return setError("Grade is required"), false;
    if (formData.subjects.length === 0)
      return setError("At least one subject is required"), false;
    if (!formData.roomNo.trim())
      return setError("Room number is required"), false;
    if (formData.schedule.length === 0)
      return setError("At least one schedule day is required"), false;

    // Room number validation (basic format check)
    const roomRegex = /^\d{1,4}[A-Z]?$/;
    if (!roomRegex.test(formData.roomNo))
      return setError("Invalid room number format (e.g., 202, 101A)"), false;

    return true;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      section: "",
      grade: "",
      subjects: [],
      roomNo: "",
      schedule: [],
    });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would make the actual API call to create class
      // const res = await apiService.createClass(formData);
      const res = await apiService.createOnlyClass(formData);
      console.log(res);

     

      if (!res || !res.success) {
        throw new Error(res.message || "Failed to create class");
      }

      console.log("Class created successfully:", res.data);
      console.log("Class data:", formData);

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
        if (onClassAdded) onClassAdded();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create class"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl !max-w-3xl !w-full max-h-[95vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
              <School className="h-6 w-6 text-white" />
            </div>
            Create New Class
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Set up a new class with subjects, schedule, and room assignment.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              Class created successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Class Name *
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Grade 10"
                  disabled={isSubmitting}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Section *
                </Label>
                <Select
                  value={formData.section}
                  onValueChange={(v) => handleSelectChange("section", v)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="rounded-lg w-full border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Grade *
                </Label>
                <Select
                  value={formData.grade}
                  onValueChange={(v) => handleSelectChange("grade", v)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="rounded-lg w-full border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Room Number *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 202, 101A"
                    disabled={isSubmitting}
                    className="pl-10 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Subjects *
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableSubjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={(checked) =>
                      handleSubjectChange(subject, checked)
                    }
                    disabled={isSubmitting}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`subject-${subject}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {subject}
                  </Label>
                </div>
              ))}
            </div>

            {formData.subjects.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected subjects:</strong>{" "}
                  {formData.subjects.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Schedule Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Schedule *
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formData.schedule.includes(day)}
                    onCheckedChange={(checked) =>
                      handleScheduleChange(day, checked)
                    }
                    disabled={isSubmitting}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`day-${day}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {day}
                  </Label>
                </div>
              ))}
            </div>

            {formData.schedule.length > 0 && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Selected days:</strong> {formData.schedule.join(", ")}
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg shadow-lg font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Class...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Class
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
