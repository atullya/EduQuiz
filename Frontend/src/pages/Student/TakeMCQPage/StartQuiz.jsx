"use client";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";

const StartQuiz = () => {
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);

  const navigate = useNavigate();

  const classId = searchParams.get("classId");
  const section = searchParams.get("section");
  const subject = searchParams.get("subject");

  // Fetch quiz MCQs
  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:3000/api/smcq/student/quizzes",
          {
            params: {
              classId,
              section,
              subject,
              studentId: state?.userId,
            },
          }
        );

        if (res.data.success) {
          setMcqs(res.data.mcqs);
          setAlreadyAttempted(res.data.alreadyAttempted || false);

          if (res.data.mcqs.length > 0) {
            const d = res.data.duration;
            setDuration(d);
            setTimeLeft(d * 60);
          }
        } else {
          setError("Failed to load MCQs.");
        }
      } catch (err) {
        setError("Failed to load quiz.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMCQs();
  }, [classId, section, subject, state?.userId]);

  // Timer
  useEffect(() => {
    if (showQuiz && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && showQuiz) {
      alert("⏰ Time's up! Your quiz will be submitted automatically.");
      handleSubmit(true);
    }
  }, [timeLeft, showQuiz]);

  // Warn on refresh or tab close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (showQuiz) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [showQuiz]);

  // Warn on internal navigation
  const handleGoBack = () => {
    if (showQuiz) {
      const confirmLeave = window.confirm(
        "⚠️ Your quiz is in progress. Leaving this page will lose your answers. Are you sure?"
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleOptionChange = (questionId, selectedOptionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOptionId }));
  };

  const handleStart = () => setShowQuiz(true);

  const handleSubmit = async (auto = false) => {
    if (!auto) {
      const confirmed = window.confirm(
        "Are you sure you want to submit the quiz?"
      );
      if (!confirmed) return;
    }

    // 🔹 Always include all questions (even unanswered with null)
    const payload = {
      studentId: state?.userId,
      classId,
      section,
      subject,
      answers: mcqs.map((q) => ({
        mcqId: q._id,
        selectedOption: answers[q._id] || null,
      })),
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/smcq/student/submit",
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        alert(`✅ Quiz submitted!`);
        navigate("/studentDashboard");
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("🚫 Error submitting quiz.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading quiz...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  if (alreadyAttempted) {
    return (
      <div className="p-6 text-center bg-white rounded shadow max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Already Completed</h2>
        <p className="text-gray-700 mb-6">
          You have already submitted this quiz. You cannot attempt it again.
        </p>
        <Button onClick={handleGoBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {!showQuiz ? (
        <div className="bg-white p-6 rounded shadow text-center space-y-6">
          <h2 className="text-2xl font-bold">📋 Quiz Instructions</h2>
          <ul className="list-disc list-inside text-left text-gray-700 space-y-1">
            <li>
              You have <strong>{duration} minutes</strong> to complete this
              quiz.
            </li>
            <li>Each question has one correct answer.</li>
            <li>Do not refresh or close the tab during the quiz.</li>
            <li>Your quiz will auto-submit when time runs out.</li>
          </ul>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleStart}
          >
            Start Quiz
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">
              Quiz: {subject} (Section {section})
            </h1>
            <div className="text-lg font-mono text-red-600">
              ⏳ {formatTime(timeLeft)}
            </div>
          </div>

          {mcqs.map((q, idx) => (
            <Card key={q._id} className="bg-white shadow">
              <CardContent className="p-4 space-y-4">
                <div className="font-semibold">
                  {idx + 1}. {q.question}
                </div>
                <RadioGroup
                  value={answers[q._id] || ""}
                  onValueChange={(val) => handleOptionChange(q._id, val)}
                >
                  {q.options.map((opt) => (
                    <div key={opt._id} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={opt._id}
                        id={`${q._id}-${opt.key}`}
                      />
                      <Label htmlFor={`${q._id}-${opt.key}`}>
                        <span className="font-medium">{opt.key}.</span>{" "}
                        {opt.value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <Button
              onClick={() => handleSubmit(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white mt-6"
            >
              Submit Quiz
            </Button>
            <Button
              onClick={handleGoBack}
              className="bg-gray-400 hover:bg-gray-500 text-white mt-3"
            >
              Go Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartQuiz;
