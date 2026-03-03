import { Question } from "@/types/question";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 rounded-full p-2">
            <HelpCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {question.category}
              </Badge>
            </div>
            <p className="text-lg font-medium text-gray-900">{question.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
