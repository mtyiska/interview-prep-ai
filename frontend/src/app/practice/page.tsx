"use client";

import Link from "next/link";
import { useAppStore } from "@/store/appStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Mic, AlertCircle, ArrowRight } from "lucide-react";

export default function PracticePage() {
  const { currentBackground, currentJob } = useAppStore();

  const hasProfile = !!currentBackground;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Practice Mode</h1>
        <p className="text-gray-600 mt-2">Choose your practice style</p>
      </div>

      {!hasProfile && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please set up your profile first before practicing.{" "}
            <Link href="/setup" className="underline font-medium">
              Go to Profile Setup
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          className={`${!hasProfile ? "opacity-50" : "hover:shadow-lg"} transition-all`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Flashcard Mode
            </CardTitle>
            <CardDescription>
              Quick practice with one question at a time. Great for rehearsing
              specific STAR stories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Answer at your own pace</li>
              <li>• Instant AI feedback</li>
              <li>• Focus on individual questions</li>
            </ul>
            <Link href={hasProfile ? "/practice/flashcard" : "#"}>
              <Button className="w-full" disabled={!hasProfile}>
                Start Flashcards
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card
          className={`${!hasProfile ? "opacity-50" : "hover:shadow-lg"} transition-all`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-6 w-6 text-orange-600" />
              Mock Interview
            </CardTitle>
            <CardDescription>
              Full interview simulation with voice support. Practice like it's
              the real thing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Voice input & output</li>
              <li>• Continuous flow</li>
              <li>• Session summary at the end</li>
            </ul>
            <Link href={hasProfile ? "/practice/interview" : "#"}>
              <Button
                className="w-full"
                variant="outline"
                disabled={!hasProfile}
              >
                Start Mock Interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {hasProfile && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Current Profile: {currentBackground.name}
                </p>
                {currentJob && (
                  <p className="text-sm text-gray-600">
                    Target: {currentJob.title}{" "}
                    {currentJob.company && `at ${currentJob.company}`}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link href="/setup">
                  <Button variant="ghost" size="sm">
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm">
                    Change Target
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
