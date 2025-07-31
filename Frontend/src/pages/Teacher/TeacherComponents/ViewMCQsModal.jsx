// "use client";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CheckCircle, X, BookOpen } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useState, useEffect } from "react";

// export default function ViewMCQsModal({
//   isOpen,
//   onClose,
//   mcqs,
//   loading,
//   error,
//   classInfo,
// }) {
//   if (!classInfo) return null;

//   // Local state to allow edits inside modal (optional, remove if not needed)
//   const [editableMCQs, setEditableMCQs] = useState(mcqs || []);

//   useEffect(() => {
//     setEditableMCQs(mcqs || []);
//   }, [mcqs]);

//   const handleQuestionChange = (index, value) => {
//     const updated = [...editableMCQs];
//     updated[index].question = value;
//     setEditableMCQs(updated);
//   };

//   const handleOptionChange = (mcqIndex, key, value) => {
//     const updated = [...editableMCQs];
//     // Assuming options is an array of objects like { key: 'A', value: 'option text', _id: '...' }
//     const optionIndex = updated[mcqIndex].options.findIndex((o) => o.key === key);
//     if (optionIndex !== -1) {
//       updated[mcqIndex].options[optionIndex].value = value;
//       setEditableMCQs(updated);
//     }
//   };

//   const handleCorrectAnswerChange = (mcqIndex, key) => {
//     const updated = [...editableMCQs];
//     updated[mcqIndex].correctAnswer = key;
//     setEditableMCQs(updated);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getOptionStyle = (optionKey, correctAnswer) => {
//     return optionKey === correctAnswer
//       ? "bg-green-100 border-green-300 text-green-800"
//       : "bg-gray-50 border-gray-200";
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="w-[900px] max-w-[900px] h-[90vh] flex flex-col p-0">
//         {/* Fixed Header */}
//         <DialogHeader className="px-8 py-4 border-b border-gray-200 flex-shrink-0">
//           <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//             <BookOpen className="h-5 w-5 text-blue-600" />
//             MCQs - {classInfo.subject}
//           </DialogTitle>
//           <div className="text-sm text-gray-600">
//             Class: {classInfo.className} | Section: {classInfo.section}
//           </div>
//         </DialogHeader>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-hidden flex flex-col">
//           {loading ? (
//             <div className="flex items-center justify-center flex-1">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                 <p className="text-gray-600">Loading MCQs...</p>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="flex items-center justify-center flex-1">
//               <div className="text-center">
//                 <p className="text-red-500 mb-4">{error}</p>
//                 <Button onClick={onClose} variant="outline">
//                   Close
//                 </Button>
//               </div>
//             </div>
//           ) : !editableMCQs || editableMCQs.length === 0 ? (
//             <div className="flex items-center justify-center flex-1">
//               <div className="text-center">
//                 <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-lg font-medium text-gray-900 mb-2">
//                   No MCQs Found
//                 </p>
//                 <p className="text-gray-500 mb-4">
//                   No MCQs have been created for this class yet.
//                 </p>
//                 <Button onClick={onClose} variant="outline">
//                   Close
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Stats Header */}
//               <div className="px-6 py-3 bg-blue-50 border-b border-gray-200 flex-shrink-0">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="font-medium text-blue-800">
//                     Total MCQs: {editableMCQs.length}
//                   </span>
//                   <span className="text-blue-600">Subject: {classInfo.subject}</span>
//                 </div>
//               </div>

//               {/* MCQs List - Scrollable */}
//               <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
//                 {editableMCQs.map((mcq, index) => (
//                   <Card key={mcq.id} className="border border-gray-200">
//                     <CardHeader className="pb-3">
//                       <div className="flex items-center gap-2">
//                         <Badge className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 flex-shrink-0">
//                           Q{index + 1}
//                         </Badge>
//                         <Input
//                           type="text"
//                           value={mcq.question}
//                           onChange={(e) => handleQuestionChange(index, e.target.value)}
//                           className="flex-1"
//                         />
//                       </div>
//                       <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 flex-wrap">
//                         <span>{mcq.duration}s</span>
//                         <span>{mcq.teacher?.username || "Unknown teacher"}</span>
//                         <span>{formatDate(mcq.createdAt)}</span>
//                       </div>
//                     </CardHeader>

//                     <CardContent className="pt-0 space-y-3">
//                       <p className="text-sm font-medium text-gray-700">Options:</p>
//                       <div className="space-y-2">
//                         {mcq.options.map((option) => (
//                           <div
//                             key={option._id}
//                             className={`p-3 rounded-lg border flex items-center gap-2 ${getOptionStyle(
//                               option.key,
//                               mcq.correctAnswer
//                             )}`}
//                           >
//                             <input
//                               type="radio"
//                               name={`correct-${index}`}
//                               checked={mcq.correctAnswer === option.key}
//                               onChange={() => handleCorrectAnswerChange(index, option.key)}
//                             />
//                             <Input
//                               type="text"
//                               value={option.value}
//                               onChange={(e) =>
//                                 handleOptionChange(index, option.key, e.target.value)
//                               }
//                               className="flex-1"
//                             />
//                             {mcq.correctAnswer === option.key && (
//                               <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
//                             )}
//                           </div>
//                         ))}
//                       </div>

//                       {mcq.explanation && (
//                         <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-xs text-green-800">
//                           <strong>Explanation:</strong> {mcq.explanation}
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Fixed Footer */}
//         <div className="px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
//           <Button onClick={onClose} variant="outline" className="flex items-center gap-2">
//             <X className="h-4 w-4" />
//             Close
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, X, BookOpen } from "lucide-react";

export default function ViewMCQsModal({
  isOpen,
  onClose,
  mcqs,
  loading,
  error,
  classInfo,
}) {
  if (!classInfo) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOptionStyle = (optionKey, correctAnswer) => {
    return optionKey === correctAnswer
      ? "bg-green-100 border-green-300 text-green-800"
      : "bg-gray-50 border-gray-200";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[900px] max-w-[900px] h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-8 py-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            MCQs - {classInfo.subject}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            Class: {classInfo.className} | Section: {classInfo.section}
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading MCQs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          ) : !mcqs || mcqs.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No MCQs Found
                </p>
                <p className="text-gray-500 mb-4">
                  No MCQs have been created for this class yet.
                </p>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Header */}
              <div className="px-6 py-3 bg-blue-50 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-800">
                    Total MCQs: {mcqs.length}
                  </span>
                  <span className="text-blue-600">
                    Subject: {classInfo.subject}
                  </span>
                </div>
              </div>

              {/* MCQs List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {mcqs.map((mcq, index) => (
                  <Card key={mcq.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 flex-shrink-0">
                          Q{index + 1}
                        </Badge>
                        <p className="flex-1 text-gray-900 font-semibold break-words">
                          {mcq.question}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 flex-wrap">
                        <span>{mcq.duration}s</span>
                        <span>
                          {mcq.teacher?.username || "Unknown teacher"}
                        </span>
                        <span>{formatDate(mcq.createdAt)}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        Options:
                      </p>
                      <div className="space-y-2">
                        {mcq.options.map((option) => (
                          <div
                            key={option._id}
                            className={`p-3 rounded-lg border flex items-center gap-2 ${getOptionStyle(
                              option.key,
                              mcq.correctAnswer
                            )}`}
                          >
                            <span className="font-medium min-w-[20px] flex-shrink-0">
                              {option.key}.
                            </span>
                            <span className="flex-1 break-words">
                              {option.value}
                            </span>
                            {option.key === mcq.correctAnswer && (
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>

                      {mcq.explanation && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-xs text-green-800">
                          <strong>Explanation:</strong> {mcq.explanation}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
