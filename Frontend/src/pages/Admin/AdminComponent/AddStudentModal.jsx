"use client";

import { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Plus,
  Mail,
  Phone,
  CalendarIcon,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { apiService } from "../../../services/apiServices";

const AddStudentModal = ({ open, onOpenChange, onStudentAdded }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    profile: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      dateOfBirth: null,
      class: "",
      section: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);

  useEffect(() => {
    getAllClasses();
  }, []);

  const getAllClasses = async () => {
    try {
      const classesData = await apiService.getClassForAdmin();
      console.log("Classes fetched successfully:", classesData);

      // Save only the array into state
      setClasses(classesData?.data || []);

      // Extract unique grades
      const uniqueGrades = [
        ...new Set(classesData?.data?.map((cls) => cls.grade) || []),
      ];
      setAvailableGrades(uniqueGrades.sort());
    } catch (error) {
      console.error("Failed to fetch classes", error.message);
      setClasses([]);
      setAvailableGrades([]);
    }
  };

  const getSectionsForGrade = (selectedGrade) => {
    if (!selectedGrade || !classes.length) return [];

    const sectionsForGrade = classes
      .filter((cls) => cls.grade === selectedGrade)
      .map((cls) => cls.section);

    return [...new Set(sectionsForGrade)].sort();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const profileField = name.replace("profile.", "");
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [profileField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSelectChange = (name, value) => {
    if (name.startsWith("profile.")) {
      const profileField = name.replace("profile.", "");

      // If grade is changed, reset section and update available sections
      if (profileField === "class") {
        const availableSections = getSectionsForGrade(value);
        setSections(availableSections);

        setFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            [profileField]: value,
            section: "", // Reset section when grade changes
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          profile: { ...prev.profile, [profileField]: value },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleDateSelect = (date) => {
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, dateOfBirth: date },
    }));
    setError("");
  };

  const generateUsername = () => {
    const firstName = formData.profile.firstName.toLowerCase();
    const lastName = formData.profile.lastName.toLowerCase();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${firstName}.${lastName}${random}`;
  };

  const validateForm = () => {
    if (!formData.username.trim())
      return setError("Username is required"), false;
    if (!formData.email.trim()) return setError("Email is required"), false;
    if (!formData.password.trim())
      return setError("Password is required"), false;
    if (!formData.profile.firstName.trim())
      return setError("First name is required"), false;
    if (!formData.profile.lastName.trim())
      return setError("Last name is required"), false;
    if (!formData.profile.phone.trim())
      return setError("Phone number is required"), false;
    if (!formData.profile.class) return setError("Select a class"), false;
    if (!formData.profile.section) return setError("Select a section"), false;
    // if (!formData.profile.dateOfBirth)
    //   return setError("Date of birth is required"), false;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return setError("Invalid email format"), false;

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.profile.phone.replace(/\D/g, ""))) {
      return setError("Phone must be 10 digits"), false;
    }

    // Password validation
    if (formData.password.length < 6)
      return setError("Password must be at least 6 characters"), false;

    return true;
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "student",
      profile: {
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        dateOfBirth: null,
        class: "",
        section: "",
      },
    });
    setSections([]);
    setError("");
    setSuccess(false);
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await apiService.register(formData);
      if (!res || !res.success) {
        throw new Error(res.message || "Failed to create student user");
      }
      console.log("Student user created successfully:", res.data);

      setSuccess(true);
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
        if (onStudentAdded) onStudentAdded();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create student"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl !max-w-5xl !w-full max-h-[95vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Add New Student
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the student's information to create their account
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Student account created successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@school.edu"
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="profile.phone"
                    value={formData.profile.phone}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <Label className="text-sm font-medium text-gray-700">
                  Date of Birth *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      className="w-full justify-start text-left font-normal mt-1 bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.profile.dateOfBirth
                        ? format(formData.profile.dateOfBirth, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.profile.dateOfBirth}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div> */}

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Input
                  name="profile.address"
                  value={formData.profile.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  disabled={isSubmitting}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <Label className="text-sm font-medium text-gray-700">
                  Username *
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="student.username"
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (
                      formData.profile.firstName &&
                      formData.profile.lastName
                    ) {
                      const generatedUsername = generateUsername();
                      setFormData((prev) => ({
                        ...prev,
                        username: generatedUsername,
                      }));
                    }
                  }}
                  disabled={
                    isSubmitting ||
                    !formData.profile.firstName ||
                    !formData.profile.lastName
                  }
                  className="whitespace-nowrap"
                >
                  Generate
                </Button>
              </div> */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Username *
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="student.username"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (
                        formData.profile.firstName &&
                        formData.profile.lastName
                      ) {
                        const generatedUsername = generateUsername();
                        setFormData((prev) => ({
                          ...prev,
                          username: generatedUsername,
                        }));
                      }
                    }}
                    disabled={
                      isSubmitting ||
                      !formData.profile.firstName ||
                      !formData.profile.lastName
                    }
                    className="whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <div className="relative mt-1">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter secure password"
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Academic Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Class *
                </Label>
                <Select
                  value={formData.profile.class}
                  onValueChange={(v) => handleSelectChange("profile.class", v)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...new Set(classes.map((cls) => cls.grade))].map(
                      (grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Section *
                </Label>
                <Select
                  value={formData.profile.section}
                  onValueChange={(v) =>
                    handleSelectChange("profile.section", v)
                  }
                  disabled={isSubmitting || !formData.profile.class}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue
                      placeholder={
                        formData.profile.class
                          ? "Select section"
                          : "Select class first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls._id} value={`${cls.section}`}>
                        {cls.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Student
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;
