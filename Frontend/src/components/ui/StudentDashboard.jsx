"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  Trophy,
  Target,
} from "lucide-react";

export default function StudentDashboard({ user, onLogout }) {
  const stats = [
    {
      title: "Enrolled Courses",
      value: "6",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Pending Assignments",
      value: "4",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      title: "Completed Tasks",
      value: "28",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Average Grade",
      value: "85%",
      icon: Trophy,
      color: "bg-purple-500",
    },
  ];

  const assignments = [
    {
      title: "Math Homework Chapter 5",
      subject: "Mathematics",
      dueDate: "Tomorrow",
      status: "pending",
      priority: "high",
    },
    {
      title: "Science Lab Report",
      subject: "Physics",
      dueDate: "In 3 days",
      status: "in-progress",
      priority: "medium",
    },
    {
      title: "History Essay",
      subject: "History",
      dueDate: "Next week",
      status: "not-started",
      priority: "low",
    },
    {
      title: "English Literature Review",
      subject: "English",
      dueDate: "In 5 days",
      status: "pending",
      priority: "medium",
    },
  ];

  const todaySchedule = [
    {
      subject: "Mathematics",
      time: "9:00 AM",
      teacher: "Ms. Johnson",
      room: "Room 201",
    },
    {
      subject: "Physics",
      time: "11:00 AM",
      teacher: "Mr. Smith",
      room: "Lab 1",
    },
    {
      subject: "English",
      time: "1:00 PM",
      teacher: "Mrs. Davis",
      room: "Room 105",
    },
    {
      subject: "History",
      time: "3:00 PM",
      teacher: "Mr. Wilson",
      room: "Room 302",
    },
  ];

  const courseProgress = [
    { subject: "Mathematics", progress: 78, grade: "B+" },
    { subject: "Physics", progress: 85, grade: "A-" },
    { subject: "English", progress: 92, grade: "A" },
    { subject: "History", progress: 73, grade: "B" },
    { subject: "Chemistry", progress: 88, grade: "A-" },
    { subject: "Biology", progress: 81, grade: "B+" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <Target className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Student Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Welcome, {user.name}
              </Badge>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 📚
          </h2>
          <p className="text-gray-600">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Classes
              </CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((classItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {classItem.subject}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {classItem.teacher} • {classItem.room}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {classItem.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Assignments
              </CardTitle>
              <CardDescription>Upcoming and pending tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {assignment.title}
                      </h4>
                      {getPriorityIcon(assignment.priority)}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {assignment.subject}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getStatusColor(
                          assignment.status
                        )}`}
                      >
                        {assignment.status.replace("-", " ")}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Course Progress
              </CardTitle>
              <CardDescription>Your academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseProgress.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {course.subject}
                      </span>
                      <Badge variant="outline">{course.grade}</Badge>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-gray-500">
                      {course.progress}% complete
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access your most used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                Submit Assignment
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                Course Materials
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                View Schedule
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Trophy className="w-6 h-6" />
                View Grades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
