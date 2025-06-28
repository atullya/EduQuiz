"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileText,
  Upload,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Target,
  Sparkles,
  Download,
  Wrench,
} from "lucide-react";
import { mcqService } from "../../../services/mcqServices";

const MCQmain = () => {
  const [formData, setFormData] = useState({
    numberOfQuestions: "",
    platform: "",
    textContent: "",
    pdfFile: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedMCQs, setGeneratedMCQs] = useState([]);
  const [isSetupNeeded, setIsSetupNeeded] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Check if Python script is working on component mount
  useEffect(() => {
    checkPythonScript();
  }, []);

  const checkPythonScript = async () => {
    try {
      const result = await mcqService.testPythonScript();
      if (!result.success) {
        setIsSetupNeeded(true);
        setError(
          "Python dependencies need to be installed. Click 'Setup Dependencies' button."
        );
      }
    } catch (error) {
      setIsSetupNeeded(true);
      setError("Python script not available. Setup required.");
    }
  };

  const handleSetup = async () => {
    setIsSettingUp(true);
    setError("");

    try {
      const result = await mcqService.setupPythonDependencies();
      if (result.success) {
        setIsSetupNeeded(false);
        setError("");
        alert("Setup completed successfully! You can now generate MCQs.");
      } else {
        setError(`Setup failed: ${result.message}`);
      }
    } catch (error) {
      setError(`Setup error: ${error.message}`);
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({
        ...prev,
        pdfFile: file,
      }));
      setError("");
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const validateForm = () => {
    if (!formData.numberOfQuestions) {
      setError("Please select the number of questions");
      return false;
    }
    if (!formData.platform) {
      setError("Please select a platform (PDF or Text)");
      return false;
    }
    if (formData.platform === "text" && !formData.textContent.trim()) {
      setError("Please provide text content for MCQ generation");
      return false;
    }
    if (formData.platform === "pdf" && !formData.pdfFile) {
      setError("Please upload a PDF file");
      return false;
    }
    return true;
  };

  const handleGenerateMCQ = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsGenerating(true);
    setError("");

    try {
      let response;

      if (formData.platform === "text") {
        response = await mcqService.generateFromText(
          Number.parseInt(formData.numberOfQuestions),
          formData.textContent
        );
        console.log("API response:", response);
      } else {
        response = await mcqService.generateFromPDF(
          Number.parseInt(formData.numberOfQuestions),
          formData.pdfFile
        );
      }
      setGeneratedMCQs(response || []);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to generate MCQs. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      numberOfQuestions: "",
      platform: "",
      textContent: "",
      pdfFile: null,
    });
    setError("");
    setSuccess(false);
    setGeneratedMCQs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                MCQ Generator
              </h1>
           
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <p className="text-gray-600">
              Transform your content into engaging multiple-choice questions
            </p>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        {/* Setup Alert */}
        {isSetupNeeded && (
          <Alert className="border-orange-200 bg-orange-50">
            <Wrench className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <span>
                  Python dependencies need to be installed before generating
                  MCQs.
                </span>
                <Button
                  onClick={handleSetup}
                  disabled={isSettingUp}
                  className="ml-4 bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  {isSettingUp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Wrench className="mr-2 h-4 w-4" />
                      Setup Dependencies
                    </>
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Form Card */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <Settings className="mr-3 h-6 w-6 text-blue-600" />
              Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Number of Questions */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <Target className="mr-2 h-5 w-5 text-green-600" />
                Number of Questions
              </Label>
              <Select
                value={formData.numberOfQuestions}
                onValueChange={(value) =>
                  handleSelectChange("numberOfQuestions", value)
                }
                disabled={isGenerating || isSetupNeeded}
              >
                <SelectTrigger className="h-14 text-base border-2 border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Select number of questions (1-10)" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {num}
                        </Badge>
                        {num === 1 ? "1 Question" : `${num} Questions`}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
                Content Source
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.platform === "text"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  } ${isSetupNeeded ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    !isSetupNeeded && handleSelectChange("platform", "text")
                  }
                >
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Text Input
                    </h3>
                    <p className="text-sm text-gray-600">
                      Paste or type your content directly
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    formData.platform === "pdf"
                      ? "ring-2 ring-purple-500 bg-purple-50"
                      : "hover:bg-gray-50"
                  } ${isSetupNeeded ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    !isSetupNeeded && handleSelectChange("platform", "pdf")
                  }
                >
                  <CardContent className="p-6 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      PDF Upload
                    </h3>
                    <p className="text-sm text-gray-600">
                      Upload a PDF document
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Conditional Content Input */}
            {formData.platform === "text" && (
              <div className="space-y-3 animate-in slide-in-from-top-5 duration-500">
                <Label
                  htmlFor="textContent"
                  className="text-lg font-semibold text-gray-700"
                >
                  Text Content
                </Label>
                <Textarea
                  id="textContent"
                  name="textContent"
                  placeholder="Paste your text content here... The AI will analyze this content and generate relevant multiple-choice questions."
                  value={formData.textContent}
                  onChange={handleInputChange}
                  className="min-h-[200px] text-base border-2 border-gray-200 focus:border-blue-500 resize-none"
                  disabled={isGenerating || isSetupNeeded}
                />
                <p className="text-sm text-gray-500">
                  💡 Tip: Provide detailed content for better question
                  generation
                </p>
              </div>
            )}

            {formData.platform === "pdf" && (
              <div className="space-y-3 animate-in slide-in-from-top-5 duration-500">
                <Label className="text-lg font-semibold text-gray-700">
                  Upload PDF File
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF files only (Max 10MB)
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="mt-4"
                    disabled={isGenerating || isSetupNeeded}
                  />
                  {formData.pdfFile && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium">
                        ✓ {formData.pdfFile.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  🎉 Successfully generated {formData.numberOfQuestions} MCQ
                  {formData.numberOfQuestions > 1 ? "s" : ""}!
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="flex-1 h-14 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isGenerating || isSetupNeeded}
              >
                Reset Form
              </Button>
              <Button
                onClick={handleGenerateMCQ}
                className="flex-1 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
                disabled={isGenerating || isSetupNeeded}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating MCQs...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Generate MCQs
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated MCQs Display */}
        {generatedMCQs.length > 0 && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <CheckCircle className="mr-3 h-6 w-6 text-green-600" />
                Generated MCQs
              </CardTitle>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Badge className="bg-green-100 text-green-800 px-3 py-1">
                  {generatedMCQs.length} Questions Generated
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-600"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export MCQs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {generatedMCQs.map((mcq, index) => (
                <Card
                  key={mcq.id}
                  className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Badge className="bg-blue-100 text-blue-800 mt-1">
                          Q{mcq.id}
                        </Badge>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {mcq.question}
                          </h3>
                          {mcq.question_type && (
                            <Badge variant="outline" className="mb-3">
                              {mcq.question_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
                        {Object.entries(mcq.options).map(([key, value]) => (
                          <div
                            key={key}
                            className={`p-3 rounded-lg border-2 ${
                              key === mcq.correct_answer
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <p className="text-gray-800">
                              <strong>{key}.</strong> {value}
                            </p>
                            {key === mcq.correct_answer && (
                              <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                                Correct Answer
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      {mcq.explanation && (
                        <div className="ml-12 mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {mcq.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MCQmain;
