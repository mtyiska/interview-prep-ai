"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";
import { ArrowRight, Brain, FileText, Briefcase, Mic } from "lucide-react";

export default function HomePage() {
  const { currentBackground } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Ace Your Next Interview
        </h1>
        <p className="text-xl text-muted-foreground">
          Practice with AI-powered coaching using the STAR method
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Set Up Your Profile
            </CardTitle>
            <CardDescription>
              Add your background, experiences, and STAR stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/setup">
              <Button className="w-full">
                {currentBackground ? "Edit Profile" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-green-500" />
              Add Job Targets
            </CardTitle>
            <CardDescription>
              Paste job descriptions to get tailored questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/jobs">
              <Button variant="outline" className="w-full">
                Add Job Description
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Flashcard Practice
            </CardTitle>
            <CardDescription>
              Quick STAR response practice with instant feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/practice/flashcard">
              <Button variant="outline" className="w-full">
                Start Flashcards
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-orange-500" />
              Mock Interview
            </CardTitle>
            <CardDescription>
              Full interview simulation with voice support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/practice/interview">
              <Button variant="outline" className="w-full">
                Start Mock Interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {currentBackground && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-foreground">
              Welcome back, <strong>{currentBackground.name}</strong>! You have{" "}
              {currentBackground.star_stories?.length || 0} STAR stories ready.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
