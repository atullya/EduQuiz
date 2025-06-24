"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Calendar, FileText, TrendingUp, Clock, Plus, MoreHorizontal } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { TeacherSidebar } from "./TeacherSidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TeacherDashboard({ user, onLogout }) {
  const stats = [
    {
      title: "Total Students",
      value: "156",
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Active Classes",
      value: "8",
      icon: BookOpen,
      color: "bg-green-500",
      change: "+2",
      changeType: "positive",
    },
    {
      title: "Pending Assignments",
      value: "23",
      icon: FileText,
      color: "bg-orange-500",
      change: "-5",
      changeType: "negative",
    },
    {
      title: "This Week's Classes",
      value: "12",
      icon: Calendar,
      color: "bg-purple-500",
      change: "Same",
      changeType: "neutral",
    },
  ]

  const recentActivities = [
    { action: "Graded Math Quiz", time: "2 hours ago", class: "Grade 10A", type: "grade" },
    { action: "Posted new assignment", time: "4 hours ago", class: "Grade 9B", type: "assignment" },
    { action: "Updated lesson plan", time: "1 day ago", class: "Grade 10A", type: "lesson" },
    { action: "Sent parent notification", time: "2 days ago", class: "Grade 9A", type: "communication" },
  ]

  const upcomingClasses = [
    {
      subject: "Mathematics",
      time: "9:00 AM",
      class: "Grade 10A",
      room: "Room 201",
      duration: "50 min",
      status: "upcoming",
    },
    {
      subject: "Physics",
      time: "11:00 AM",
      class: "Grade 11B",
      room: "Lab 1",
      duration: "50 min",
      status: "upcoming",
    },
    {
      subject: "Chemistry",
      time: "2:00 PM",
      class: "Grade 10B",
      room: "Lab 2",
      duration: "50 min",
      status: "upcoming",
    },
  ]

  const quickActions = [
    { title: "Create Assignment", icon: FileText, description: "Create a new assignment for your classes" },
    { title: "View Students", icon: Users, description: "Manage student information and progress" },
    { title: "Lesson Plans", icon: BookOpen, description: "Create and manage lesson plans" },
    { title: "Grade Reports", icon: TrendingUp, description: "Generate and view grade reports" },
  ]

  return (
    <SidebarProvider>
      <TeacherSidebar user={user} onLogout={onLogout} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Teacher Portal</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome Section */}
          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Good morning, {user.name}! 👋</h1>
            <p className="text-blue-100">
              Here's what's happening in your classes today. You have 3 classes scheduled and 12 assignments to review.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-xs font-medium ${
                            stat.changeType === "positive"
                              ? "text-green-600"
                              : stat.changeType === "negative"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-xs text-muted-foreground">from last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Today's Schedule */}
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>Your upcoming classes for today</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Class
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingClasses.map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{classItem.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {classItem.class} • {classItem.room}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-medium text-blue-600">{classItem.time}</p>
                          <p className="text-xs text-muted-foreground">{classItem.duration}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Upcoming
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Class</DropdownMenuItem>
                            <DropdownMenuItem>Cancel Class</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="lg:col-span-3">
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
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "grade"
                            ? "bg-green-500"
                            : activity.type === "assignment"
                              ? "bg-blue-500"
                              : activity.type === "lesson"
                                ? "bg-purple-500"
                                : "bg-orange-500"
                        }`}
                      ></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {activity.class}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 text-left"
                  >
                    <action.icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
