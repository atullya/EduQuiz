// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { apiService } from "../../../../services/apiServices";
// import {
//   BookOpen,
//   Users,
//   MapPin,
//   Plus,
//   ChevronRight,
//   Trash2,
// } from "lucide-react";
// import AddClassModal from "./AddClassModal";
// import ManageClassModal from "./ManageClassModal";

// const ClassSegment = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [classDetails, setClassDetails] = useState([]);
//   const [manageModalOpen, setManageModalOpen] = useState(false);
//   const [selectedClassId, setSelectedClassId] = useState(null);

//   const gradientColors = [
//     "from-blue-500 to-purple-600",
//     "from-green-400 to-blue-500",
//     "from-yellow-400 to-pink-500",
//     "from-red-500 to-orange-500",
//     "from-indigo-400 to-cyan-500",
//     "from-pink-500 to-violet-500",
//   ];

//   const fetchAllClasses = async () => {
//     try {
//       const res = await apiService.getClasses();
//       setClassDetails(res.classes);
//     } catch (error) {
//       console.error("Failed to fetch classes:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllClasses();
//   }, []);

//   const handleManageModalOpen = (id) => {
//     setSelectedClassId(id);
//     setManageModalOpen(true);
//   };

//   const handleClassAdded = () => {
//     fetchAllClasses();
//   };
//   const deleteClass = async (classId) => {
//     try {
//       if (!window.confirm("Are you sure you want to delete this class?")) {
//         return;
//       }
//       const res = await apiService.deleteClass(classId);
//       if (res.success) {
//         alert("Class deleted successfully");
//         fetchAllClasses();
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-900">Class Management</h2>
//         <Button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg"
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Create Class
//         </Button>
//       </div>

//       <div className="grid gap-6">
//         {classDetails && classDetails.length > 0 ? (
//           classDetails.map((classes, index) => {
//             const gradient = gradientColors[index % gradientColors.length];
//             return (
//               <div key={classes._id}>
//                 <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <div
//                           className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
//                         >
//                           <BookOpen className="w-8 h-8 text-white" />
//                         </div>
//                         <div>
//                           <h3 className="text-xl font-bold text-gray-900">
//                             {classes.name}
//                           </h3>
//                           <div className="flex items-center space-x-2 mt-1">
//                             <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
//                               Section {classes.section}
//                             </Badge>
//                             <Badge
//                               variant="outline"
//                               className="border-purple-300 text-purple-700"
//                             >
//                               Grade {classes.grade}
//                             </Badge>
//                           </div>
//                           <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
//                             <div className="flex items-center">
//                               <Users className="w-4 h-4 mr-1" />
//                               {classes.students.length} students
//                             </div>
//                             <div className="flex items-center">
//                               <MapPin className="w-4 h-4 mr-1" />
//                               Room {classes.roomNo}
//                             </div>
//                           </div>
//                           <p className="text-sm text-gray-600 mt-1">
//                             Teacher:{" "}
//                             {classes?.teacher?.username ||
//                               "No Teacher Assigned yet!"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex space-x-2">
//                         <Button
//                           className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl"
//                           onClick={() => handleManageModalOpen(classes._id)}
//                         >
//                           Manage
//                           <ChevronRight className="ml-2 h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => deleteClass(classes._id)}
//                           className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
//                         >
//                           Delete
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             );
//           })
//         ) : (
//           <h1>No Classes Found</h1>
//         )}
//       </div>

//       <AddClassModal
//         open={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         onClassAdded={handleClassAdded}
//       />

//       <ManageClassModal
//         isOpen={manageModalOpen}
//         onClose={() => setManageModalOpen(false)}
//         classId={selectedClassId}
//         onSuccess={fetchAllClasses}
//       />
//     </div>
//   );
// };

// export default ClassSegment;
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiService } from "../../../../services/apiServices";
import { BookOpen, Plus, Trash2, Edit } from "lucide-react";
import AddClassModal from "./AddClassModal";
import ManageClassModal from "./ManageClassModal";

const ClassSegment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classDetails, setClassDetails] = useState([]);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

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

  const deleteClass = async (classId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this class?")) {
        return;
      }
      const res = await apiService.deleteClass(classId);
      if (res.success) {
        alert("Class deleted successfully");
        fetchAllClasses();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Classes</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Class
        </Button>
      </div>

      <div className="space-y-4">
        {classDetails && classDetails.length > 0 ? (
          classDetails.map((classes) => (
            <Card key={classes._id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {classes.name}
                      </h3>

                      <div className="space-y-1 text-gray-600">
                        <p>
                          <strong>Grade:</strong> {classes.grade}
                        </p>
                        <p>
                          <strong>Section:</strong> {classes.section}
                        </p>
                        <p>
                          <strong>Room:</strong> {classes.roomNo}
                        </p>
                        <p>
                          <strong>Students:</strong> {classes.students.length}
                        </p>
                        <p>
                          <strong>Teacher:</strong>{" "}
                          {classes?.teacher?.username || "No Teacher Assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleManageModalOpen(classes._id)}
                      className="border-purple-500 text-purple-500 hover:bg-purple-50"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => deleteClass(classes._id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No classes available</p>
          </div>
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
