"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, GraduationCap, BarChart3, Activity, Plus } from "lucide-react"
import { apiService } from "../../../services/apiServices"

const AdminOverview = ({ user, setActiveTab }) => {
  const [count, setCount] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
  })

  const mockRecentActivities = [
    {
      id: 1,
      action: "New student enrolled",
      user: "Alice Johnson",
      time: "2 hours ago",
      type: "enrollment",
    },
    {
      id: 2,
      action: "Class schedule updated",
      user: "John Smith",
      time: "4 hours ago",
      type: "schedule",
    },
    {
      id: 3,
      action: "Assignment created",
      user: "Sarah Johnson",
      time: "6 hours ago",
      type: "assignment",
    },
    {
      id: 4,
      action: "Grade submitted",
      user: "Michael Brown",
      time: "8 hours ago",
      type: "grade",
    },
  ]

  const getAllStats = async () => {
    try {
      const response = await apiService.getAllStats()
      setCount(response)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    if (user && user.role === "admin") {
      getAllStats()
    }
  }, [user])

  return (
    <div className="max-w-8xl mx-auto p-6">
      {/* Simple Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}! 👑</h1>
        <p className="text-blue-100">Manage your school with confidence</p>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <GraduationCap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Total Students</h3>
            <p className="text-2xl font-bold text-gray-900">{count.totalStudents || 0}</p>
            <p className="text-sm text-gray-500">Enrolled this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Total Teachers</h3>
            <p className="text-2xl font-bold text-gray-900">{count.totalTeachers || 0}</p>
            <p className="text-sm text-gray-500">Active faculty</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">Total Classes</h3>
            <p className="text-2xl font-bold text-gray-900">{count.totalClasses || 0}</p>
            <p className="text-sm text-gray-500">Active classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Simple Action Buttons */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button className="h-12 text-lg bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("students")}>
              <Plus className="w-5 h-5 mr-2" />
              Add Student
            </Button>
            <Button className="h-12 text-lg bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("teachers")}>
              <Users className="w-5 h-5 mr-2" />
              Add Teacher
            </Button>
            <Button className="h-12 text-lg bg-purple-600 hover:bg-purple-700" onClick={() => setActiveTab("classes")}>
              <BookOpen className="w-5 h-5 mr-2" />
              Create Class
            </Button>
            <Button variant="outline" className="h-12 text-lg bg-transparent">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Activity className="mr-3 h-6 w-6 text-green-600" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.type === "enrollment"
                      ? "bg-blue-500"
                      : activity.type === "schedule"
                        ? "bg-green-500"
                        : activity.type === "assignment"
                          ? "bg-purple-500"
                          : "bg-orange-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">by {activity.user}</p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminOverview
 