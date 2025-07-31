"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

const MCQDisplay = ({ mcqs, onExport, isExporting }) => {
  const [editableMCQs, setEditableMCQs] = useState(mcqs)

  // Sync editableMCQs state when mcqs prop changes
  useEffect(() => {
    setEditableMCQs(mcqs)
  }, [mcqs])

  const handleQuestionChange = (index, value) => {
    const updated = [...editableMCQs]
    updated[index].question = value
    setEditableMCQs(updated)
  }

  const handleOptionChange = (mcqIndex, key, value) => {
    const updated = [...editableMCQs]
    updated[mcqIndex].options[key] = value
    setEditableMCQs(updated)
  }

  const handleCorrectAnswerChange = (mcqIndex, key) => {
    const updated = [...editableMCQs]
    updated[mcqIndex].correct_answer = key
    setEditableMCQs(updated)
  }

  const handleAddMCQ = () => {
    const newMCQ = {
      id: editableMCQs.length + 1,
      question: "",
      options: {
        A: "",
        B: "",
        C: "",
        D: "",
      },
      correct_answer: "A",
      explanation: "",
    }
    setEditableMCQs([...editableMCQs, newMCQ])
  }

  const handleDeleteMCQ = (indexToDelete) => {
    const updated = editableMCQs.filter((_, index) => index !== indexToDelete)
    // Re-number the MCQs after deletion
    const renumbered = updated.map((mcq, index) => ({
      ...mcq,
      id: index + 1,
    }))
    setEditableMCQs(renumbered)
  }

  const handleExportClick = () => {
    onExport(editableMCQs)
  }

  if (!editableMCQs || editableMCQs.length === 0) return null

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
          <CheckCircle className="mr-3 h-6 w-6 text-green-600" />
          Generated MCQs
        </CardTitle>
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">{editableMCQs.length} Questions Generated</Badge>
          <Button
            variant="outline"
            size="sm"
            className="border-green-300 text-green-600 bg-transparent hover:bg-green-50"
            onClick={handleAddMCQ}
            disabled={isExporting}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add MCQ
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 bg-transparent hover:bg-blue-50"
            onClick={handleExportClick}
            disabled={isExporting || editableMCQs.length === 0}
          >
            {isExporting ? (
              "Exporting..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export MCQs
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {editableMCQs.map((mcq, index) => (
          <div key={`mcq-${index}`} className="border p-4 rounded-md shadow-sm space-y-3 relative">
            {/* Delete button for each MCQ */}
            <div className="flex justify-between items-start">
              <label className="font-medium text-sm">Question {index + 1}</label>
              {editableMCQs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                  onClick={() => handleDeleteMCQ(index)}
                  disabled={isExporting}
                  title="Delete this MCQ"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div>
              <Input
                type="text"
                value={mcq.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="mt-1"
                placeholder="Enter your question here..."
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm">Options:</label>
              {Object.entries(mcq.options).map(([key, option]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={mcq.correct_answer === key}
                    onChange={() => handleCorrectAnswerChange(index, key)}
                    className="text-green-600"
                  />
                  <span className="font-medium text-sm w-6">{key}.</span>
                  <Input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, key, e.target.value)}
                    className="flex-1"
                    placeholder={`Option ${key}`}
                  />
                  {mcq.correct_answer === key && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      Correct
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {mcq.explanation && (
              <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Explanation:</strong> {mcq.explanation}
              </div>
            )}
          </div>
        ))}

        {/* Add MCQ button at the bottom */}
        <div className="text-center pt-4">
          <Button
            variant="dashed"
            className="border-2 border-dashed border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
            onClick={handleAddMCQ}
            disabled={isExporting}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another MCQ
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default MCQDisplay
