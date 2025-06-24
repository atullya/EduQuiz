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
import {
  Users,
  BookOpen,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function TeacherDashboard({ user, onLogout }) {
  const stats = [
    {
      title: "Total Students",
      value: "156",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Classes",
      value: "8",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Pending Assignments",
      value: "23",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      title: "This Week's Classes",
      value: "12",
      icon: Calendar,
      color: "bg-purple-500",
    },
  ];

  const recentActivities = [
    { action: "Graded Math Quiz", time: "2 hours ago", class: "Grade 10A" },
    { action: "Posted new assignment", time: "4 hours ago", class: "Grade 9B" },
    { action: "Updated lesson plan", time: "1 day ago", class: "Grade 10A" },
    {
      action: "Sent parent notification",
      time: "2 days ago",
      class: "Grade 9A",
    },
  ];

  const upcomingClasses = [
    {
      subject: "Mathematics",
      time: "9:00 AM",
      class: "Grade 10A",
      room: "Room 201",
    },
    { subject: "Physics", time: "11:00 AM", class: "Grade 11B", room: "Lab 1" },
    {
      subject: "Chemistry",
      time: "2:00 PM",
      class: "Grade 10B",
      room: "Lab 2",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Teacher Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
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
            Good morning, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening in your classes today.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your upcoming classes for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((classItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {classItem.subject}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {classItem.class} • {classItem.room}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {classItem.time}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Upcoming
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.class} • {activity.time}
                      </p>
                    </div>
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
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                Create Assignment
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="w-6 h-6" />
                View Students
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                Lesson Plans
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                Grade Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
