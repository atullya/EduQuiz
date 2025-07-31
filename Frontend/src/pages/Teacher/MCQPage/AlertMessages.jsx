import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

const AlertMessages = ({ error, success, numberOfQuestions, successMessage }) => {
  return (
    <>
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
            {successMessage
              ? successMessage
              : `🎉 Successfully generated ${numberOfQuestions} MCQ${
                  Number(numberOfQuestions) > 1 ? "s" : ""
                }!`}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;




