"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Plus,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  CalendarIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap,
  BookOpen,
} from "lucide-react"

const AddTeacherModal = ({ open, onOpenChange, onTeacherAdded }) => {
  const [formData, setFormData] = useState({
    // User credentials
    username: "",
    email: "",
    password: "",
    role: "teacher",

    // Profile information
    profile: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      dateOfBirth: null,
      teacherId: "",
      subjects: [],
      qualification: "",
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const subjectOptions = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "History",
    "Geography",
    "Economics",
    "Political Science",
    "Computer Science",
    "Physical Education",
    "Art",
    "Music",
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("profile.")) {
      const profileField = name.replace("profile.", "")
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [profileField]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    setError("")
  }

  const handleDateSelect = (date) => {
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, dateOfBirth: date },
    }))
    setError("")
  }

  const handleSubjectToggle = (subject) => {
    setFormData((prev) => {
      const subjects = prev.profile.subjects.includes(subject)
        ? prev.profile.subjects.filter((s) => s !== subject)
        : [...prev.profile.subjects, subject]
      return {
        ...prev,
        profile: { ...prev.profile, subjects },
      }
    })
    setError("")
  }

  const generateUsername = () => {
    const firstName = formData.profile.firstName.toLowerCase()
    const lastName = formData.profile.lastName.toLowerCase()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `${firstName}.${lastName}${random}`
  }

  const generateTeacherId = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    return `TCH${year}${random}`
  }

  const validateForm = () => {
    if (!formData.username.trim()) return setError("Username is required"), false
    if (!formData.email.trim()) return setError("Email is required"), false
    if (!formData.password.trim()) return setError("Password is required"), false
    if (!formData.profile.firstName.trim()) return setError("First name is required"), false
    if (!formData.profile.lastName.trim()) return setError("Last name is required"), false
    if (!formData.profile.phone.trim()) return setError("Phone number is required"), false
    if (!formData.profile.teacherId.trim()) return setError("Teacher ID is required"), false
    if (!formData.profile.qualification.trim()) return setError("Qualification is required"), false
    if (formData.profile.subjects.length === 0) return setError("Select at least one subject"), false
    if (!formData.profile.dateOfBirth) return setError("Date of birth is required"), false

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return setError("Invalid email format"), false

    // Phone validation
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.profile.phone.replace(/\D/g, ""))) {
      return setError("Phone must be 10 digits"), false
    }

    // Password validation
    if (formData.password.length < 6) return setError("Password must be at least 6 characters"), false

    return true
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "teacher",
      profile: {
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        dateOfBirth: null,
        teacherId: "",
        subjects: [],
        qualification: "",
      },
    })
    setError("")
    setSuccess(false)
    setShowPassword(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would make the actual API call to create user
      // const res = await apiService.createUser(formData);
      console.log("Teacher user created:", formData)

      setSuccess(true)
      setTimeout(() => {
        resetForm()
        onOpenChange(false)
        if (onTeacherAdded) onTeacherAdded()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create teacher")
    } finally {
      setIsSubmitting(false)
    }
  }

  const autoFillUsername = () => {
    if (formData.profile.firstName && formData.profile.lastName) {
      const username = generateUsername()
      setFormData((prev) => ({ ...prev, username }))
    }
  }

  const autoFillTeacherId = () => {
    const teacherId = generateTeacherId()
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, teacherId },
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-none max-h-[95vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            Create New Teacher Account
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Set up a complete teacher profile with login credentials and professional information.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              Teacher account created successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Credentials Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Account Credentials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Username *</Label>
                <div className="flex gap-2">
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="teacher.username"
                    disabled={isSubmitting}
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={autoFillUsername}
                    disabled={!formData.profile.firstName || !formData.profile.lastName}
                    className="rounded-lg"
                  >
                    Auto
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="teacher@school.edu"
                    disabled={isSubmitting}
                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter secure password"
                    disabled={isSubmitting}
                    className="pl-10 pr-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">First Name *</Label>
                <Input
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  disabled={isSubmitting}
                  className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Last Name *</Label>
                <Input
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                  className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="profile.phone"
                    value={formData.profile.phone}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    disabled={isSubmitting}
                    className="pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      className="w-full justify-start text-left font-normal rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.profile.dateOfBirth ? format(formData.profile.dateOfBirth, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.profile.dateOfBirth}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <Input
                    name="profile.address"
                    value={formData.profile.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    disabled={isSubmitting}
                    className="pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Teacher ID *</Label>
                <div className="flex gap-2">
                  <Input
                    name="profile.teacherId"
                    value={formData.profile.teacherId}
                    onChange={handleInputChange}
                    placeholder="TCH20240001"
                    disabled={isSubmitting}
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={autoFillTeacherId} className="rounded-lg">
                    Auto
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Qualification *</Label>
                <Input
                  name="profile.qualification"
                  value={formData.profile.qualification}
                  onChange={handleInputChange}
                  placeholder="e.g., M.Sc. Mathematics, B.Ed."
                  disabled={isSubmitting}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Subjects * (Select at least one)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  {subjectOptions.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.profile.subjects.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                        disabled={isSubmitting}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <Label htmlFor={subject} className="text-sm font-medium text-gray-700 cursor-pointer">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.profile.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.profile.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        <BookOpen className="w-3 h-3 mr-1" />
                        {subject}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Teacher Account
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTeacherModal
