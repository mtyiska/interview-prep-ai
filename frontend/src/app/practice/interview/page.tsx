"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { interviewService } from "@/services/interviewService";
import { Feedback, SessionSummary } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { FeedbackPanel } from "@/components/practice/FeedbackPanel";
import { VoiceButton } from "@/components/voice/VoiceButton";
import { SpeakingIndicator } from "@/components/voice/SpeakingIndicator";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useVoiceOutput } from "@/hooks/useVoiceOutput";
import { toast } from "react-hot-toast";
import { Loader2, Send, Mic, MicOff, StopCircle, Trophy } from "lucide-react";

type InterviewState =
  | "intro"
  | "question"
  | "listening"
  | "evaluating"
  | "feedback"
  | "summary";

export default function MockInterviewPage() {
  const router = useRouter();
  const { currentBackground, currentJob, currentSession, setCurrentSession } =
    useAppStore();

  const [state, setState] = useState<InterviewState>("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

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
    stop: stopSpeaking,
    isSupported: voiceOutputSupported,
  } = useVoiceOutput();

  useEffect(() => {
    if (!currentBackground) {
      router.push("/setup");
    }
  }, []);

  useEffect(() => {
    if (transcript) {
      setAnswer((prev) => prev + " " + transcript);
    }
  }, [transcript]);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const session = await interviewService.start({
        mode: "mock",
        background_id: currentBackground!.id,
        job_description_id: currentJob?.id,
        question_count: 5,
      });
      setCurrentSession(session);
      setState("question");

      if (voiceOutputSupported && session.questions.length > 0) {
        speak("Let's begin the interview. " + session.questions[0].text);
      }
    } catch (error) {
      toast.error("Failed to start interview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartListening = () => {
    resetTranscript();
    setAnswer("");
    startListening();
    setState("listening");
  };

  const handleStopListening = async () => {
    stopListening();
    setState("evaluating");

    if (!currentSession || !answer.trim()) {
      setState("question");
      return;
    }

    try {
      const fb = await interviewService.submitAnswer(
        currentSession.id,
        answer.trim(),
      );
      setFeedback(fb);
      setState("feedback");

      if (voiceOutputSupported) {
        speak(
          `You scored ${fb.overall_score} out of 10. ${fb.improvements[0] || "Good job!"}`,
        );
      }
    } catch (error) {
      toast.error("Failed to evaluate answer");
      setState("question");
    }
  };

  const handleNext = async () => {
    if (!currentSession) return;

    try {
      const result = await interviewService.nextQuestion(currentSession.id);

      if (result.completed) {
        const sum = await interviewService.endSession(currentSession.id);
        setSummary(sum);
        setState("summary");
      } else {
        const updatedSession = await interviewService.getSession(
          currentSession.id,
        );
        setCurrentSession(updatedSession);
        setAnswer("");
        setFeedback(null);
        setState("question");

        if (voiceOutputSupported && result.question) {
          speak(result.question.text);
        }
      }
    } catch (error) {
      toast.error("Failed to continue");
    }
  };

  if (state === "intro") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-orange-600" />
              Mock Interview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              This will simulate a real interview experience with voice
              interaction. The AI will ask you questions and evaluate your
              responses using the STAR method.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="font-medium">Interview Settings:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Profile: {currentBackground?.name}</li>
                <li>• Target Role: {currentJob?.title || "General"}</li>
                <li>• Questions: 5</li>
                <li>
                  • Voice: {voiceInputSupported ? "Enabled" : "Not supported"}
                </li>
              </ul>
            </div>

            <Button
              onClick={startInterview}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Preparing...
                </>
              ) : (
                "Start Interview"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "summary" && summary) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Interview Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-blue-600">
                  {summary.questions_answered}
                </p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-green-600">
                  {summary.average_score?.toFixed(1) || "N/A"}
                </p>
                <p className="text-sm text-gray-600">Avg Score</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-purple-600">/10</p>
                <p className="text-sm text-gray-600">Max Score</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="font-medium">Question Summary:</p>
              {summary.answers.map((ans, idx) => (
                <div key={ans.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm">
                      Q{idx + 1}: {ans.question_text}
                    </p>
                    <Badge
                      variant={
                        ans.overall_score && ans.overall_score >= 7
                          ? "default"
                          : "secondary"
                      }
                    >
                      {ans.overall_score}/10
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => router.push("/practice")}
                variant="outline"
                className="flex-1"
              >
                Back to Practice
              </Button>
              <Button
                onClick={() => {
                  setState("intro");
                  setSummary(null);
                  setCurrentSession(null);
                }}
                className="flex-1"
              >
                Try Again
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
        <h1 className="text-2xl font-bold">Mock Interview</h1>
        <Badge>
          {currentSession.current_question_index + 1} /{" "}
          {currentSession.questions.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      {isSpeaking && <SpeakingIndicator />}

      <QuestionCard question={currentQuestion} />

      {state === "question" && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600 mb-6">
              Click the microphone to start your answer
            </p>
            <Button
              size="lg"
              onClick={handleStartListening}
              className="rounded-full h-16 w-16"
            >
              <Mic className="h-6 w-6" />
            </Button>
            <div className="mt-4">
              <Button variant="ghost" size="sm" onClick={handleNext}>
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state === "listening" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-25" />
                <div className="relative bg-red-500 rounded-full p-4">
                  <Mic className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <p className="text-red-700 font-medium">Recording your answer...</p>
            <p className="text-gray-600 text-sm min-h-[60px]">
              {answer || "Start speaking..."}
            </p>
            <Button variant="destructive" onClick={handleStopListening}>
              <StopCircle className="h-4 w-4 mr-2" />
              Stop & Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {state === "evaluating" && (
        <Card>
          <CardContent className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Evaluating your response...</p>
          </CardContent>
        </Card>
      )}

      {state === "feedback" && feedback && (
        <>
          <FeedbackPanel feedback={feedback} answer={answer} />
          <div className="flex justify-end">
            <Button onClick={handleNext}>
              {currentSession.current_question_index <
              currentSession.questions.length - 1
                ? "Next Question"
                : "Finish Interview"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
