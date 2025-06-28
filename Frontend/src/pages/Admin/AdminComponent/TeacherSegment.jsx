"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AddStudentModal from "./AddStudentModal";
import TeacherModal from "./TeacherModal";

const TeacherSegment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      class: "10A",
      grade: "A",
      attendance: "95%",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      class: "11B",
      grade: "B+",
      attendance: "92%",
      status: "Active",
    },
    {
      id: 3,
      name: "Carol Wilson",
      class: "12A",
      grade: "A-",
      attendance: "98%",
      status: "Active",
    },
    {
      id: 4,
      name: "David Brown",
      class: "10B",
      grade: "B",
      attendance: "88%",
      status: "Warning",
    },
  ]);

  const handleStudentAdded = () => {
    // Refresh the students list or add the new student
    console.log("Student added, refreshing list...");
    // You can add logic here to refresh the students list from your API
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              className="pl-10 rounded-xl border-gray-300"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {students.map((student) => (
          <Card
            key={student.id}
            className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {student.name}
                    </h4>
                    <p className="text-gray-600">Class {student.class}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <Badge
                      className={`${
                        student.grade.includes("A")
                          ? "bg-green-100 text-green-800"
                          : student.grade.includes("B")
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.grade}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">Grade</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">
                      {student.attendance}
                    </p>
                    <p className="text-xs text-gray-500">Attendance</p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TeacherModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};

export default TeacherSegment;
