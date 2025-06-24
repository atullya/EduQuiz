import React, { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import {
  Plus,
  FileText,
  CalendarIcon,
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { apiService } from "../../../services/apiServices";

const AddAssignmentDialogue = ({
  open,
  onOpenChange,
  onAssignmentAdded,
  user,
}) => {
  const getAllAssignedClasses = async () => {
    try {
      // Fetch assigned classes for the teacher
      const data = await apiService.getAssignedClasses(user?._id);
      console.log("data", data);

      setTeacherClasses(data.classStudentCounts || []);
      setsubjectArray([
        ...new Set(data.classStudentCounts.flatMap((value) => value.subject)),
      ]);
    } catch (err) {
      console.error("Failed to fetch assigned classes:", err.message);
    }
  };
  useEffect(() => {
    if (user && user.role === "teacher") {
      getAllAssignedClasses();
    }
  }, [user]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    dueDate: null,
  });
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [subjectArray, setsubjectArray] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, dueDate: date }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) return setError("Title is required"), false;
    if (!formData.description.trim())
      return setError("Description is required"), false;
    if (!formData.subject) return setError("Select a subject"), false;
    if (!formData.class) return setError("Select a class"), false;
    if (!formData.dueDate) return setError("Select a due date"), false;
    if (formData.dueDate < new Date())
      return setError("Due date cannot be in the past"), false;
    return true;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      class: "",
      dueDate: null,
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
      const res = await apiService.createAssignment(formData);
      console.log("Assignment created:", res);

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
        onAssignmentAdded(); // Notify parent to refresh
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Assignment</DialogTitle>
          <DialogDescription>
            Fill the details below to create a new assignment.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Assignment created successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Assignment Title"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Assignment instructions"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(v) => handleSelectChange("subject", v)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectArray.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      <BookOpen className="mr-2 h-4 w-4" /> {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                value={formData.class}
                onValueChange={(v) => handleSelectChange("class", v)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map((c) => (
                    <SelectItem key={c.classId} value={c.classId}>
                      <Users className="mr-2 h-4 w-4" />
                      Grade {c.grade} (sec {c.section})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate
                    ? format(formData.dueDate, "PPP")
                    : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Create
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignmentDialogue;
