"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { interviewService } from "@/services/interviewService";
import { Question } from "@/types/question";
import { Feedback } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { FeedbackPanel } from "@/components/practice/FeedbackPanel";
import { VoiceButton } from "@/components/voice/VoiceButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useVoiceOutput } from "@/hooks/useVoiceOutput";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Send,
  ArrowRight,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

export default function FlashcardPage() {
  const router = useRouter();
  const { currentBackground, currentJob, currentSession, setCurrentSession } =
    useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: voiceInputSupported,
  } = useVoiceInput();
  const {
    speak,
    isSpeaking,
    isSupported: voiceOutputSupported,
  } = useVoiceOutput();

  useEffect(() => {
    if (!currentBackground) {
      router.push("/setup");
      return;
    }
    startSession();
  }, []);

  useEffect(() => {
    if (transcript) {
      setAnswer((prev) => prev + " " + transcript);
      resetTranscript();
    }
  }, [transcript]);

  const startSession = async () => {
    setIsLoading(true);
    try {
      const session = await interviewService.start({
        mode: "flashcard",
        background_id: currentBackground!.id,
        job_description_id: currentJob?.id,
        question_count: 5,
      });
      setCurrentSession(session);

      if (voiceOutputSupported && session.questions.length > 0) {
        speak(session.questions[0].text);
      }
    } catch (error) {
      toast.error("Failed to start session");
      router.push("/practice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !currentSession) return;

    setIsSubmitting(true);
    try {
      const fb = await interviewService.submitAnswer(
        currentSession.id,
        answer.trim(),
      );
      setFeedback(fb);

      if (voiceOutputSupported) {
        const feedbackText = `Your score is ${fb.overall_score} out of 10. ${fb.strengths[0] || ""} ${fb.improvements[0] || ""}`;
        speak(feedbackText);
      }
    } catch (error) {
      toast.error("Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!currentSession) return;

    try {
      const result = await interviewService.nextQuestion(currentSession.id);

      if (result.completed) {
        setIsComplete(true);
      } else {
        const updatedSession = await interviewService.getSession(
          currentSession.id,
        );
        setCurrentSession(updatedSession);
        setAnswer("");
        setFeedback(null);

        if (voiceOutputSupported && result.question) {
          speak(result.question.text);
        }
      }
    } catch (error) {
      toast.error("Failed to get next question");
    }
  };

  const handleRestart = () => {
    setIsComplete(false);
    setFeedback(null);
    setAnswer("");
    startSession();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Practice Complete!</h2>
            <p className="text-gray-600 mb-6">
              Great job completing this practice session.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleRestart}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Practice Again
              </Button>
              <Button variant="outline" onClick={() => router.push("/history")}>
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentSession) return null;

  const currentQuestion =
    currentSession.questions[currentSession.current_question_index];
  const progress =
    ((currentSession.current_question_index + 1) /
      currentSession.questions.length) *
    100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flashcard Practice</h1>
          <p className="text-gray-600">
            Question {currentSession.current_question_index + 1} of{" "}
            {currentSession.questions.length}
          </p>
        </div>
        <Badge variant="outline">{currentQuestion?.type || "behavioral"}</Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <QuestionCard question={currentQuestion} />

      {!feedback ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your STAR response here... or use voice input"
              rows={6}
              className="resize-none"
            />

            <div className="flex items-center justify-between">
              {voiceInputSupported && (
                <VoiceButton
                  isListening={isListening}
                  onStart={startListening}
                  onStop={stopListening}
                />
              )}

              <Button
                onClick={handleSubmit}
                disabled={!answer.trim() || isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Answer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <FeedbackPanel feedback={feedback} answer={answer} />

          <div className="flex justify-end">
            <Button onClick={handleNext}>
              Next Question
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
