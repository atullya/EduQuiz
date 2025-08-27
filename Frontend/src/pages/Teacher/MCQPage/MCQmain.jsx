"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { mcqService } from "../../../services/mcqServices"
import GenerationSettings from "./GenerationSettings"
import ContentInput from "./ContentInput"
import ActionButtons from "./ActionButtons"
import MCQDisplay from "./MCQDisplay"
import AlertMessages from "./AlertMessages"
import ClassSectionSelector from "./ClassSectionSelector"

const MCQmain = ({ user }) => {
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    subject: "",
    numberOfQuestions: "",
    platform: "",
    textContent: "",
    pdfFile: null,
    mcqDuration: "30",
    classId: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [generatedMCQs, setGeneratedMCQs] = useState([])
  const [hasExported, setHasExported] = useState(false) // NEW: Track export status

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccess(false)
    setSuccessMessage("")
    setHasExported(false)
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccess(false)
    setSuccessMessage("")
    setHasExported(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, pdfFile: file }))
      setError("")
    } else {
      setFormData((prev) => ({ ...prev, pdfFile: null }))
      setError("Please select a valid PDF file")
    }
  }

  const validateForm = () => {
    if (!formData.class) return setError("Please select a class"), false
    if (!formData.section) return setError("Please select a section"), false
    if (!formData.subject) return setError("Please select a subject"), false
    if (!formData.numberOfQuestions) return setError("Please select number of questions"), false
    if (!formData.platform) return setError("Please select a platform"), false
    if (formData.platform === "text" && !formData.textContent.trim()) return setError("Please provide text content"), false
    if (formData.platform === "pdf" && !formData.pdfFile) return setError("Please upload a PDF file"), false
    if (!formData.mcqDuration || isNaN(Number(formData.mcqDuration)) || Number(formData.mcqDuration) <= 0)
      return setError("Please enter a valid MCQ duration (in minutes)."), false
    return true
  }

  const handleGenerateMCQ = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsGenerating(true)
    setError("")
    setSuccess(false)
    setSuccessMessage("")
    setGeneratedMCQs([])
    setHasExported(false)

    try {
      let apiResponse
      if (formData.platform === "text") {
        apiResponse = await mcqService.generateFromText(Number(formData.numberOfQuestions), formData.textContent)
      } else {
        apiResponse = await mcqService.generateFromPDF(Number(formData.numberOfQuestions), formData.pdfFile)
      }

      let mcqsData = []
      if (Array.isArray(apiResponse)) {
        mcqsData = apiResponse
      } else if (apiResponse?.success && Array.isArray(apiResponse.mcqs)) {
        mcqsData = apiResponse.mcqs
      } else {
        setError(apiResponse?.message || "API returned invalid data.")
        return
      }

      const transformed = mcqsData.map((mcq, index) => {
        const options = {}
        ;["A", "B", "C", "D"].forEach((label, i) => {
          options[label] = mcq.options[i] || ""
        })
        const correctKey = Object.entries(options).find(([, val]) => val === mcq.answer)?.[0]
        return {
          id: index + 1,
          question: mcq.question,
          options,
          correct_answer: correctKey || "",
          explanation: mcq.explanation || "",
        }
      })

      setGeneratedMCQs(transformed)
      setSuccess(true)
      setSuccessMessage(
        `🎉 Successfully generated ${formData.numberOfQuestions} MCQ${Number(formData.numberOfQuestions) > 1 ? "s" : ""}!`,
      )
    } catch (err) {
      setError(err.message || "Failed to generate MCQs.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportMCQs = async (updatedMCQs = generatedMCQs) => {
    if (hasExported) return setError("You have already exported these MCQs.")
    if (updatedMCQs.length === 0) return setError("No MCQs to export.")

    const invalidMCQs = updatedMCQs.filter(
      (mcq) =>
        !mcq.question.trim() ||
        !mcq.options.A.trim() ||
        !mcq.options.B.trim() ||
        !mcq.options.C.trim() ||
        !mcq.options.D.trim() ||
        !mcq.correct_answer,
    )
    if (invalidMCQs.length > 0) return setError("Please fill all questions, options, and correct answers before exporting.")
    if (!formData.classId || !formData.section || !user?._id) return setError("Select class/section and make sure you're logged in.")
    if (!formData.mcqDuration || isNaN(Number(formData.mcqDuration)) || Number(formData.mcqDuration) <= 0)
      return setError("Enter valid MCQ duration before exporting.")

    setIsExporting(true)
    setError("")
    setSuccess(false)
    setSuccessMessage("")

    try {
      const response = await mcqService.saveMCQs(
        updatedMCQs,
        formData.classId,
        formData.section,
        user._id,
        Number(formData.mcqDuration),
        formData.subject,
      )

      if (response.success) {
        setSuccess(true)
        setSuccessMessage(`✅ Successfully exported ${response.savedCount} MCQs!`)
        setHasExported(true) // Mark as exported
      } else {
        setError(response.message || "Export failed.")
      }
    } catch (err) {
      setError(err.message || "Export error occurred.")
    } finally {
      setIsExporting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      class: "",
      section: "",
      subject: "",
      numberOfQuestions: "",
      platform: "",
      textContent: "",
      pdfFile: null,
      mcqDuration: "30",
      classId: "",
    })
    setError("")
    setSuccess(false)
    setSuccessMessage("")
    setGeneratedMCQs([])
    setHasExported(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">MCQ Generator</h1>
          </div>
          <p className="text-gray-600">Generate multiple choice questions from text or PDF files</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Generation Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <ClassSectionSelector
              user={user}
              formData={formData}
              onSelectChange={handleSelectChange}
              isGenerating={isGenerating}
            />
            <GenerationSettings
              formData={formData}
              onSelectChange={handleSelectChange}
              onInputChange={handleInputChange}
              isGenerating={isGenerating}
            />
            <ContentInput
              formData={formData}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              isGenerating={isGenerating}
            />
            <AlertMessages
              error={error}
              success={success}
              numberOfQuestions={formData.numberOfQuestions}
              successMessage={successMessage}
            />
            <ActionButtons
              onReset={resetForm}
              onGenerate={handleGenerateMCQ}
              isGenerating={isGenerating}
              isSetupNeeded={false}
            />
          </CardContent>
        </Card>

        {/* MCQ Display */}
        <MCQDisplay
          mcqs={generatedMCQs}
          onExport={handleExportMCQs}
          isExporting={isExporting}
          hasExported={hasExported} // Pass export status
        />
      </div>
    </div>
  )
}

export default MCQmain
