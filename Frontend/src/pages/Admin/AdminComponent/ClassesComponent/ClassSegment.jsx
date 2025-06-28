"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiService } from "../../../../services/apiServices";
import { BookOpen, Users, MapPin, Plus, ChevronRight } from "lucide-react";
import AddClassModal from "./AddClassModal";
import ManageClassModal from "./ManageClassModal";

const ClassSegment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classDetails, setClassDetails] = useState([]);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const gradientColors = [
    "from-blue-500 to-purple-600",
    "from-green-400 to-blue-500",
    "from-yellow-400 to-pink-500",
    "from-red-500 to-orange-500",
    "from-indigo-400 to-cyan-500",
    "from-pink-500 to-violet-500",
  ];

  const fetchAllClasses = async () => {
    try {
      const res = await apiService.getClasses();
      setClassDetails(res.classes);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);

  const handleManageModalOpen = (id) => {
    setSelectedClassId(id);
    setManageModalOpen(true);
  };

  const handleClassAdded = () => {
    fetchAllClasses();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Class Management</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Class
        </Button>
      </div>

      <div className="grid gap-6">
        {classDetails && classDetails.length > 0 ? (
          classDetails.map((classes, index) => {
            const gradient = gradientColors[index % gradientColors.length];
            return (
              <div key={classes._id}>
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {classes.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              Section {classes.section}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-purple-300 text-purple-700"
                            >
                              Grade {classes.grade}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {classes.students.length} students
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              Room {classes.roomNo}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Teacher: {classes?.teacher?.username || "No Teacher Assigned yet!"}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="rounded-xl border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Students
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl"
                          onClick={() => handleManageModalOpen(classes._id)}
                        >
                          Manage
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        ) : (
          <h1>No Classes Found</h1>
        )}
      </div>

      <AddClassModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClassAdded={handleClassAdded}
      />

      <ManageClassModal
        isOpen={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        classId={selectedClassId}
        onSuccess={fetchAllClasses}
      />
    </div>
  );
};

export default ClassSegment;
