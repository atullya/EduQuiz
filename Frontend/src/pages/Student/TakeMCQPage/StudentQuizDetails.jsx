import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

const StudentQuizDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const studentId = searchParams.get("studentId");
  const classId = searchParams.get("classId");
  const section = searchParams.get("section");
  const subject = searchParams.get("subject");

  const [quizDetails, setQuizDetails] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!studentId || !classId || !section || !subject) {
        setError("Missing required parameters. Please access via class list page.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:3000/api/mcq/student/view-details",
          {
            params: { studentId, classId, section, subject },
          }
        );

        if (res.data.success) {
          setQuizDetails(res.data.quizDetails);
          setScore(res.data.score);
          setTotalQuestions(res.data.totalQuestions);
          setCorrectAnswers(res.data.correctAnswers);
        } else {
          setError(res.data.message || "Failed to fetch quiz details.");
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 404) {
          setError("You haven't attempted this quiz yet. Please attempt it first.");
        } else {
          setError("Failed to fetch quiz details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [studentId, classId, section, subject]);

  if (loading)
    return <div className="p-6 text-center">Loading quiz details...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {error ? (
        <div className="mb-6">
          <Alert variant="destructive" className="flex flex-col items-center text-center">
            <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
            <AlertDescription className="mb-4">{error}</AlertDescription>
            <Button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go Back
            </Button>
          </Alert>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Quiz Details: {subject}</h2>
          <p className="mb-4">
            Score: {score.toFixed(2)}% | Correct Answers: {correctAnswers} / {totalQuestions}
          </p>

          {quizDetails.map((q, idx) => (
            <Card key={q.questionId} className="mb-4 bg-white shadow">
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">
                  {idx + 1}. {q.question}
                </div>
                <RadioGroup value={q.selectedOption} disabled>
                  {q.options.map((opt) => (
                    <div key={opt._id} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={opt._id}
                        id={`${q.questionId}-${opt.key}`}
                      />
                      <Label
                        htmlFor={`${q.questionId}-${opt.key}`}
                        className={`${
                          q.selectedOption === opt._id
                            ? q.isCorrect
                              ? "text-green-600 font-bold"
                              : "text-red-600 font-bold"
                            : ""
                        }`}
                      >
                        <span className="font-medium">{opt.key}.</span> {opt.value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="text-sm text-gray-600 mt-1">
                  Correct Answer: {q.correctAnswer}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center mt-6">
            <Button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go Back
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentQuizDetails;
