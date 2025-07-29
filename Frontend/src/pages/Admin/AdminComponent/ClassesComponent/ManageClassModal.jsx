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
import { Settings, MapPin, Clock, CheckCircle, AlertCircle, Loader2, Save, X } from "lucide-react"
import { apiService } from "../../../../services/apiServices"

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
    "Mathematics",
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

  // Fetch class info & users
  useEffect(() => {
    if (classId && isOpen) {
      fetchData()
    }
  }, [classId, isOpen])

  const fetchData = async () => {
    setInitialLoading(true)
    setError("")

    try {
      console.log("Fetching data for classId:", classId)

      // Fetch teachers and students from the API endpoints
      const [teachersRes, studentsRes] = await Promise.all([
        apiService.getTeacherDetails(), // Changed from getAllTeacherClasses
        apiService.getStudentsDetails(), // Changed from getAllStudentClasses
      ])

      console.log("Teachers fetched:", teachersRes)
      console.log("Students fetched:", studentsRes)

      setAllTeachers(Array.isArray(teachersRes) ? teachersRes : [])
      setAllStudents(Array.isArray(studentsRes) ? studentsRes : [])

      // Fetch existing class data for editing
      if (classId) {
        try {
          // Try different API endpoints to get class data
          let classData = null

          // Try method 1: Direct class fetch
          try {
            const classRes = await apiService.getClassById?.(classId)
            if (classRes?.success && classRes?.data) {
              classData = classRes.data
            } else if (classRes && !classRes.success) {
              classData = classRes
            }
          } catch (err) {
            console.log("getClassById failed, trying alternative method")
          }

          // Try method 2: Get all classes and find the one we need
          if (!classData) {
            try {
              const allClassesRes = await apiService.getClasses()
              console.log("All classes response:", allClassesRes)

              if (allClassesRes?.classes) {
                classData = allClassesRes.classes.find((cls) => cls._id === classId)
              } else if (Array.isArray(allClassesRes)) {
                classData = allClassesRes.find((cls) => cls._id === classId)
              }
            } catch (err) {
              console.log("getClasses failed:", err)
            }
          }

          console.log("Final class data:", classData)

          if (classData) {
            setFormData({
              name: classData.name || "",
              section: classData.section || "",
              grade: classData.grade || "",
              roomNo: classData.roomNo || "",
              subjects: Array.isArray(classData.subjects) ? classData.subjects : [],
              schedule: Array.isArray(classData.schedule) ? classData.schedule : [],
              teacher: classData.teacher?._id || classData.teacher || "",
              students: Array.isArray(classData.students)
                ? classData.students.map((s) => (typeof s === "object" ? s._id : s))
                : [],
              time: classData.time || "",
            })
          } else {
            setError("Could not load class data")
          }
        } catch (err) {
          console.error("Error fetching class data:", err)
          setError("Failed to load class information")
        }
      }
    } catch (err) {
      console.error("Error loading modal data:", err)
      setError("Failed to load data: " + (err.message || "Unknown error"))
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
    if (!formData.name.trim()) {
      setError("Class name is required")
      return false
    }
    if (!formData.section) {
      setError("Section is required")
      return false
    }
    if (!formData.grade) {
      setError("Grade is required")
      return false
    }
    if (!formData.roomNo.trim()) {
      setError("Room number is required")
      return false
    }
    if (formData.subjects.length === 0) {
      setError("At least one subject is required")
      return false
    }
    if (formData.schedule.length === 0) {
      setError("At least one schedule day is required")
      return false
    }
    return true
  }

  const handleUpdate = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      console.log("Updating class with data:", formData)

      const updateData = {
        ...formData,
        teacher: formData.teacher === "none" ? null : formData.teacher,
      }

      const res = await apiService.updateClass(classId, updateData)
      console.log("Class updated successfully:", res)

      setSuccess(true)

      setTimeout(() => {
        if (onSuccess) onSuccess()
        resetAndClose()
      }, 1500)
    } catch (err) {
      console.error("Update error:", err)
      setError(err.response?.data?.message || err.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  const resetAndClose = () => {
    setFormData({
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
    setError("")
    setSuccess(false)
    onClose()
  }

  const getTeacherName = (teacherId) => {
    const teacher = allTeachers.find((t) => t._id === teacherId)
    if (!teacher) return "Unknown"

    const firstName = teacher.profile?.firstName || ""
    const lastName = teacher.profile?.lastName || ""
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : teacher.username
  }

  const getStudentName = (studentId) => {
    const student = allStudents.find((s) => s._id === studentId)
    if (!student) return "Unknown"

    const firstName = student.profile?.firstName || ""
    const lastName = student.profile?.lastName || ""
    return firstName || lastName ? `${firstName} ${lastName}`.trim() : student.username
  }

  if (initialLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={resetAndClose}>
        <DialogContent className="max-w-2xl">
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Manage Class
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update class information, assign teachers and students, and manage schedules
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Class updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Class Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics Advanced"
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Section *</Label>
                <Select
                  value={formData.section}
                  onValueChange={(v) => handleSelectChange("section", v)}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-1">
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
              <div>
                <Label className="text-sm font-medium text-gray-700">Grade *</Label>
                <Select value={formData.grade} onValueChange={(v) => handleSelectChange("grade", v)} disabled={loading}>
                  <SelectTrigger className="mt-1">
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
              <div>
                <Label className="text-sm font-medium text-gray-700">Room Number *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 202, 101A"
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Time</Label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 09:00-10:00"
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Subjects *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSubjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={(checked) => handleSubjectChange(subject, checked)}
                    disabled={loading}
                  />
                  <Label htmlFor={`subject-${subject}`} className="text-sm text-gray-700 cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
            {formData.subjects.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Selected:</strong> {formData.subjects.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Schedule *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formData.schedule.includes(day)}
                    onCheckedChange={(checked) => handleScheduleChange(day, checked)}
                    disabled={loading}
                  />
                  <Label htmlFor={`day-${day}`} className="text-sm text-gray-700 cursor-pointer">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
            {formData.schedule.length > 0 && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Selected:</strong> {formData.schedule.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Teacher Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Assign Teacher</h3>
            <div>
              <Label className="text-sm font-medium text-gray-700">Select Teacher</Label>
              <Select
                value={formData.teacher}
                onValueChange={(v) => handleSelectChange("teacher", v)}
                disabled={loading}
              >
                <SelectTrigger className="mt-1">
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
                    <strong>Assigned:</strong> {getTeacherName(formData.teacher)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Student Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Assign Students</h3>
            <div>
              <Label className="text-sm font-medium text-gray-700">Select Students</Label>
              <ScrollArea className="h-48 w-full border rounded-lg p-4 mt-1">
                <div className="space-y-3">
                  {allStudents.map((student) => (
                    <div key={student._id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`student-${student._id}`}
                        checked={formData.students.includes(student._id)}
                        onCheckedChange={(checked) => handleStudentChange(student._id, checked)}
                        disabled={loading}
                      />
                      <Label
                        htmlFor={`student-${student._id}`}
                        className="flex-1 text-sm text-gray-700 cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-medium">{getStudentName(student._id)}</span>
                        <span className="text-gray-500 text-xs">{student.email}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {formData.students.length > 0 && (
                <div className="p-3 bg-indigo-50 rounded-lg mt-2">
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
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={resetAndClose} disabled={loading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
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
