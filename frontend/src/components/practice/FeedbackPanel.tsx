import { Feedback } from "@/types/interview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

interface FeedbackPanelProps {
  feedback: Feedback;
  answer: string;
}

export function FeedbackPanel({ feedback, answer }: FeedbackPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Feedback</CardTitle>
          <div
            className={`px-4 py-2 rounded-full ${getScoreBg(feedback.overall_score)}`}
          >
            <span
              className={`text-2xl font-bold ${getScoreColor(feedback.overall_score)}`}
            >
              {feedback.overall_score}
            </span>
            <span className="text-gray-500">/10</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            STAR Breakdown
          </p>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(feedback.star_breakdown).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key}</span>
                  <span className={getScoreColor(value)}>{value}/10</span>
                </div>
                <Progress value={value * 10} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {feedback.strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="font-medium text-green-700">Strengths</p>
            </div>
            <ul className="space-y-1">
              {feedback.strengths.map((strength, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 flex items-start gap-2"
                >
                  <span className="text-green-500">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.improvements.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <p className="font-medium text-orange-700">
                Areas for Improvement
              </p>
            </div>
            <ul className="space-y-1">
              {feedback.improvements.map((improvement, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 flex items-start gap-2"
                >
                  <span className="text-orange-500">•</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.suggested_revision && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <p className="font-medium text-blue-700">Suggested Revision</p>
            </div>
            <p className="text-sm text-gray-700">
              {feedback.suggested_revision}
            </p>
          </div>
        )}

        {feedback.follow_up_question && (
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <p className="font-medium text-purple-700">Possible Follow-up</p>
            </div>
            <p className="text-sm text-gray-700 italic">
              "{feedback.follow_up_question}"
            </p>
          </div>
        )}

        <Separator />

        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Your Answer:</p>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {answer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
