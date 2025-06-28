"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Settings,
  Users,
  BookOpen,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  X,
} from "lucide-react"
// import apiService from "@/api/apiService"
// import { toast } from "react-hot-toast"

export default function ManageClassModal({ isOpen, onClose, classId, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    grade: "",
    roomNo: "",
    subjects: [],
    schedule: [],
    teacher: "",
    students: [],
    time: "",
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [allTeachers, setAllTeachers] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const grades = ["9", "10", "11", "12"]
  const sections = ["A", "B", "C", "D", "E"]
  const availableSubjects = [
    "Math",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
    "Music",
    "Physical Education",
  ]
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Mock data for demo
  const mockTeachers = [
    { _id: "1", username: "john.smith", email: "john@school.edu", profile: { firstName: "John", lastName: "Smith" } },
    {
      _id: "2",
      username: "sarah.johnson",
      email: "sarah@school.edu",
      profile: { firstName: "Sarah", lastName: "Johnson" },
    },
    {
      _id: "3",
      username: "michael.brown",
      email: "michael@school.edu",
      profile: { firstName: "Michael", lastName: "Brown" },
    },
  ]

  const mockStudents = [
    {
      _id: "1",
      username: "alice.wilson",
      email: "alice@school.edu",
      profile: { firstName: "Alice", lastName: "Wilson" },
    },
    { _id: "2", username: "bob.davis", email: "bob@school.edu", profile: { firstName: "Bob", lastName: "Davis" } },
    {
      _id: "3",
      username: "carol.miller",
      email: "carol@school.edu",
      profile: { firstName: "Carol", lastName: "Miller" },
    },
    {
      _id: "4",
      username: "david.garcia",
      email: "david@school.edu",
      profile: { firstName: "David", lastName: "Garcia" },
    },
  ]

  // Fetch class info & users
  useEffect(() => {
    if (classId && isOpen) {
      fetchData()
    }
  }, [classId, isOpen])

  const fetchData = async () => {
    setInitialLoading(true)
    try {
      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock class data
      const mockClassData = {
        name: "Mathematics Advanced",
        section: "A",
        grade: "10",
        roomNo: "202",
        subjects: ["Math", "Physics"],
        schedule: ["Monday", "Wednesday", "Friday"],
        teacher: "1",
        students: ["1", "2"],
        time: "09:00-10:00",
      }

      setFormData(mockClassData)
      setAllTeachers(mockTeachers)
      setAllStudents(mockStudents)

      // Real API calls would be:
      // const [classRes, teacherRes, studentRes] = await Promise.all([
      //   apiService.getClassById(classId),
      //   apiService.getAllTeachers(),
      //   apiService.getAllStudents(),
      // ])
      // setFormData(classRes.data)
      // setAllTeachers(teacherRes.data)
      // setAllStudents(studentRes.data)
    } catch (err) {
      console.error("Error loading modal data", err)
      setError("Failed to load class data")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubjectChange = (subject, checked) => {
    setFormData((prev) => ({
      ...prev,
      subjects: checked ? [...prev.subjects, subject] : prev.subjects.filter((s) => s !== subject),
    }))
    setError("")
  }

  const handleScheduleChange = (day, checked) => {
    setFormData((prev) => ({
      ...prev,
      schedule: checked ? [...prev.schedule, day] : prev.schedule.filter((d) => d !== day),
    }))
    setError("")
  }

  const handleStudentChange = (studentId, checked) => {
    setFormData((prev) => ({
      ...prev,
      students: checked ? [...prev.students, studentId] : prev.students.filter((s) => s !== studentId),
    }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Class name is required"), false
    if (!formData.section) return setError("Section is required"), false
    if (!formData.grade) return setError("Grade is required"), false
    if (!formData.roomNo.trim()) return setError("Room number is required"), false
    if (formData.subjects.length === 0) return setError("At least one subject is required"), false
    if (formData.schedule.length === 0) return setError("At least one schedule day is required"), false
    return true
  }

  const handleUpdate = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Real API call would be:
      // const res = await apiService.editClass(classId, formData)
      // toast.success("Class updated!")

      console.log("Class updated:", formData)
      setSuccess(true)

      setTimeout(() => {
        onSuccess?.()
        onClose()
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Update failed")
      // toast.error(err.response?.data?.message || "Update failed.")
    } finally {
      setLoading(false)
    }
  }

  const resetAndClose = () => {
    setError("")
    setSuccess(false)
    onClose()
  }

  const getTeacherName = (teacherId) => {
    const teacher = allTeachers.find((t) => t._id === teacherId)
    return teacher
      ? `${teacher.profile?.firstName || teacher.username} ${teacher.profile?.lastName || ""}`.trim()
      : "Unknown"
  }

  const getStudentName = (studentId) => {
    const student = allStudents.find((s) => s._id === studentId)
    return student
      ? `${student.profile?.firstName || student.username} ${student.profile?.lastName || ""}`.trim()
      : "Unknown"
  }

  if (initialLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={resetAndClose}>
        <DialogContent className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading class data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            Manage Class
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Update class information, assign teachers and students, and manage schedules.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">Class updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Class Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics Advanced"
                  disabled={loading}
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Section *</Label>
                <Select
                  value={formData.section}
                  onValueChange={(v) => handleSelectChange("section", v)}
                  disabled={loading}
                >
                  <SelectTrigger className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                <Label className="text-sm font-medium text-gray-700">Grade *</Label>
                <Select value={formData.grade} onValueChange={(v) => handleSelectChange("grade", v)} disabled={loading}>
                  <SelectTrigger className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                <Label className="text-sm font-medium text-gray-700">Room Number *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 202, 101A"
                    disabled={loading}
                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 09:00-10:00"
                    disabled={loading}
                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Subjects *</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableSubjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={(checked) => handleSubjectChange(subject, checked)}
                    disabled={loading}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`subject-${subject}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>

            {formData.subjects.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Selected subjects:</strong> {formData.subjects.join(", ")}
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
              <h3 className="text-lg font-semibold text-gray-900">Schedule *</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formData.schedule.includes(day)}
                    onCheckedChange={(checked) => handleScheduleChange(day, checked)}
                    disabled={loading}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`day-${day}`} className="text-sm font-medium text-gray-700 cursor-pointer">
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

          {/* Teacher Assignment Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Assign Teacher</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Select Teacher</Label>
              <Select
                value={formData.teacher}
                onValueChange={(v) => handleSelectChange("teacher", v)}
                disabled={loading}
              >
                <SelectTrigger className="rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No teacher assigned</SelectItem>
                  {allTeachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getTeacherName(teacher._id)}</span>
                        <span className="text-gray-500 text-sm">({teacher.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.teacher && formData.teacher !== "none" && (
                <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Assigned teacher:</strong> {getTeacherName(formData.teacher)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Student Assignment Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Assign Students</h3>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Select Students</Label>
              <ScrollArea className="h-48 w-full border rounded-lg p-4">
                <div className="space-y-3">
                  {allStudents.map((student) => (
                    <div key={student._id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`student-${student._id}`}
                        checked={formData.students.includes(student._id)}
                        onCheckedChange={(checked) => handleStudentChange(student._id, checked)}
                        disabled={loading}
                        className="rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`student-${student._id}`}
                        className="flex-1 text-sm font-medium text-gray-700 cursor-pointer flex items-center justify-between"
                      >
                        <span>{getStudentName(student._id)}</span>
                        <span className="text-gray-500 text-xs">{student.email}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {formData.students.length > 0 && (
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-800 mb-2">
                    <strong>Assigned students ({formData.students.length}):</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.students.map((studentId) => (
                      <Badge key={studentId} variant="secondary" className="bg-indigo-100 text-indigo-800">
                        {getStudentName(studentId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
              onClick={resetAndClose}
              disabled={loading}
              className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Class
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
