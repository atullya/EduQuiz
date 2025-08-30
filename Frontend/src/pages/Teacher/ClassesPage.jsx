import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, MapPin, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiService } from "../../services/apiServices";

const ClassesPage = ({ user }) => {
  const [classStatus, setClassStatus] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchTeacherStats = async () => {
    try {
      const data = await apiService.getAssignedClasses(user?._id);
      setClassStatus(data.classStudentCounts);
    } catch (err) {
      console.error("Failed to fetch teacher stats", err.message);
    }
  };

  const handleViewStudents = async (classId) => {
    try {
      const res = await apiService.getStudentsByClass(classId);
      setStudents(res.studentNames || []);
      setSelectedClass(res.className);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch students", error.message);
    }
  };

  useEffect(() => {
    if (user && user.role === "teacher") {
      fetchTeacherStats();
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Classes</h2>
        <p className="text-gray-600">Manage all your classes in one place</p>
      </div>

      <div className="space-y-4">
        {classStatus?.map((classItem) => (
          <Card key={classItem.classId} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {classItem.className}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        Section {classItem.section}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800">
                        Grade {classItem.grade}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {classItem.studentCount} students
                      </div>
                      {/* <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {classItem.time}
                      </div> */}
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Room {classItem.roomNo}
                      </div>
                      <div>📅 {classItem.schedule?.join(", ")}</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="h-10"
                    onClick={() => handleViewStudents(classItem.classId)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View Students
                  </Button>
                  {/* <Button className="h-10">Manage Class</Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {classStatus?.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Classes Yet
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't been assigned any classes yet.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Request Class Assignment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Student Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Students in {selectedClass}</DialogTitle>
          </DialogHeader>
          <ul className="mt-4 space-y-2">
            {students.length > 0 ? (
              students.map((student, index) => (
                <li key={index} className="text-gray-800 border-b py-1">
                  {student}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No students found.</p>
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassesPage;
