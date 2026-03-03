"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { historyService, SessionHistoryItem } from "@/services/historyService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SessionSummary } from "@/types/interview";
import { toast } from "react-hot-toast";
import {
  History,
  Loader2,
  Calendar,
  Brain,
  Mic,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { format } from "date-fns";

export default function HistoryPage() {
  const { currentBackground } = useAppStore();
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [currentBackground]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await historyService.list(currentBackground?.id);
      setSessions(data);
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (sessionId: string) => {
    setDetailLoading(true);
    try {
      const detail = await historyService.getDetail(sessionId);
      setSelectedSession(detail);
    } catch (error) {
      toast.error("Failed to load session details");
    } finally {
      setDetailLoading(false);
    }
  };

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return "text-gray-400";
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number | null | undefined) => {
    if (!score) return "secondary";
    if (score >= 8) return "default";
    if (score >= 6) return "secondary";
    return "destructive";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Practice History</h1>
          <p className="text-gray-600 mt-2">
            Review your past interview practice sessions
          </p>
        </div>
        {sessions.length > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {sessions.length}
            </p>
            <p className="text-sm text-gray-500">Total Sessions</p>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {sessions.reduce((acc, s) => acc + s.answers_count, 0)}
              </p>
              <p className="text-sm text-gray-500">Questions Answered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">
                {(
                  sessions
                    .filter((s) => s.average_score)
                    .reduce((acc, s) => acc + (s.average_score || 0), 0) /
                    sessions.filter((s) => s.average_score).length || 0
                ).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">Average Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {sessions.filter((s) => s.status === "completed").length}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session List */}
      {sessions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No practice sessions yet.</p>
            <p className="text-gray-400 text-sm mt-2">
              Complete a practice session to see your history here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetail(session.id)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${session.mode === "mock" ? "bg-orange-100" : "bg-purple-100"}`}
                    >
                      {session.mode === "mock" ? (
                        <Mic className="h-5 w-5 text-orange-600" />
                      ) : (
                        <Brain className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {session.mode === "mock"
                          ? "Mock Interview"
                          : "Flashcard Practice"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {format(
                          new Date(session.created_at),
                          "MMM d, yyyy h:mm a",
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {session.answers_count} / {session.questions_count}{" "}
                        answered
                      </p>
                      {session.average_score && (
                        <p
                          className={`font-bold ${getScoreColor(session.average_score)}`}
                        >
                          {session.average_score.toFixed(1)} / 10
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        session.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {session.status}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog
        open={!!selectedSession}
        onOpenChange={() => setSelectedSession(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Session Details
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            selectedSession && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-2xl font-bold">
                      {selectedSession.questions_answered}
                    </p>
                    <p className="text-sm text-gray-500">Answered</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedSession.average_score?.toFixed(1) || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Avg Score</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-2xl font-bold">
                      {selectedSession.total_questions}
                    </p>
                    <p className="text-sm text-gray-500">Total Qs</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedSession.answers.map((answer, idx) => (
                    <Card key={answer.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm font-medium">
                            Q{idx + 1}: {answer.question_text}
                          </CardTitle>
                          <Badge variant={getScoreBadge(answer.overall_score)}>
                            {answer.overall_score}/10
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="text-gray-600 bg-gray-50 p-3 rounded">
                          {answer.answer_text}
                        </p>
                        {answer.feedback && (
                          <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-4 gap-2">
                              {Object.entries(
                                answer.feedback.star_breakdown,
                              ).map(([key, val]) => (
                                <div key={key} className="text-center">
                                  <p className="text-xs text-gray-500 capitalize">
                                    {key}
                                  </p>
                                  <Progress
                                    value={val * 10}
                                    className="h-1 mt-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
