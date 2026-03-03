"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { backgroundService } from "@/services/backgroundService";
import { ResumeParseResponse } from "@/types/background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { STARStoryForm } from "@/components/background/STARStoryForm";
import { STARStoryCard } from "@/components/background/STARStoryCard";
import { toast } from "react-hot-toast";
import {
  Plus,
  Save,
  User,
  BookOpen,
  Sparkles,
  Loader2,
  CheckCircle,
  Info,
} from "lucide-react";

export default function SetupPage() {
  const { currentBackground, setCurrentBackground } = useAppStore();

  const [name, setName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [showSTARForm, setShowSTARForm] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Parsed but not yet saved STAR stories
  const [pendingStarStories, setPendingStarStories] = useState<
    ResumeParseResponse["star_stories"]
  >([]);
  const [hasParsed, setHasParsed] = useState(false);

  useEffect(() => {
    if (currentBackground) {
      setName(currentBackground.name);
      setResumeText(currentBackground.resume_text || "");
      setSkills(currentBackground.skills || []);
    }
  }, [currentBackground]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleParseResume = async () => {
    if (!resumeText.trim()) {
      toast.error("Please paste your resume first");
      return;
    }

    setIsParsing(true);
    try {
      const parsed = await backgroundService.parseResume(resumeText);

      // Auto-fill name if empty
      if (parsed.name && !name) {
        setName(parsed.name);
      }

      // Merge skills (avoid duplicates)
      const newSkills = [...new Set([...skills, ...parsed.skills])];
      setSkills(newSkills);

      // Store parsed STAR stories as pending
      setPendingStarStories(parsed.star_stories);
      setHasParsed(true);

      // Switch to STAR stories tab to show results
      setActiveTab("star");

      toast.success(
        `Extracted ${parsed.skills.length} skills and ${parsed.star_stories.length} STAR stories!`,
        { duration: 5000 },
      );
    } catch (error) {
      toast.error("Failed to parse resume. Please try again.");
      console.error("Resume parsing error:", error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      let background;
      if (currentBackground) {
        background = await backgroundService.update(currentBackground.id, {
          name,
          resume_text: resumeText,
          skills,
        });
      } else {
        background = await backgroundService.create({
          name,
          resume_text: resumeText,
          skills,
        });
      }

      // Save any pending STAR stories
      if (pendingStarStories.length > 0) {
        for (const story of pendingStarStories) {
          await backgroundService.addSTARStory(background.id, {
            title: story.title,
            situation: story.situation,
            task: story.task,
            action: story.action,
            result: story.result,
            tags: story.tags,
          });
        }
        setPendingStarStories([]);
      }

      // Refresh background to get all STAR stories
      const updated = await backgroundService.get(background.id);
      setCurrentBackground(updated);

      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSTARStoryAdded = async () => {
    if (currentBackground) {
      const updated = await backgroundService.get(currentBackground.id);
      setCurrentBackground(updated);
    }
    setShowSTARForm(false);
    toast.success("STAR story added!");
  };

  const handleRemovePendingStory = (index: number) => {
    setPendingStarStories(pendingStarStories.filter((_, i) => i !== index));
  };

  const totalStarStories =
    (currentBackground?.star_stories?.length || 0) + pendingStarStories.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Set up your background to get personalized interview questions
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="star" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            STAR Stories
            {totalStarStories > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalStarStories}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Paste your resume and let AI extract your profile, or fill in
                manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume / Background Summary</Label>
                <Textarea
                  id="resume"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume or write a summary of your professional background..."
                  rows={8}
                />
                <Button
                  onClick={handleParseResume}
                  disabled={isParsing || !resumeText.trim()}
                  variant="secondary"
                  className="w-full"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />✨ Auto-fill from
                      Resume
                    </>
                  )}
                </Button>
                {hasParsed && (
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500">
                      Resume analyzed! Check the STAR Stories tab to review
                      generated stories.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddSkill())
                    }
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/20"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No skills added yet. Use auto-fill or add manually.
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Profile"}
                {pendingStarStories.length > 0 &&
                  ` (+ ${pendingStarStories.length} STAR stories)`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="star">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>STAR Stories</CardTitle>
                  <CardDescription>
                    Your Situation-Task-Action-Result stories for behavioral
                    interviews
                  </CardDescription>
                </div>
                <Button onClick={() => setShowSTARForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Story
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pending stories from resume parsing */}
              {pendingStarStories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <h3 className="font-medium text-foreground">
                      AI-Generated Stories (Unsaved)
                    </h3>
                  </div>
                  <Alert className="bg-yellow-500/10 border-yellow-500/20">
                    <Info className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                      Review these stories and click "Save Profile" to save
                      them. Click × to remove any you don't want.
                    </AlertDescription>
                  </Alert>
                  {pendingStarStories.map((story, index) => (
                    <Card
                      key={index}
                      className="border-yellow-500/30 bg-yellow-500/5"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            {story.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {story.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePendingStory(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <span className="font-semibold text-blue-500">
                            Situation:
                          </span>
                          <p className="text-muted-foreground mt-1">
                            {story.situation}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-500">
                            Task:
                          </span>
                          <p className="text-muted-foreground mt-1">
                            {story.task}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-orange-500">
                            Action:
                          </span>
                          <p className="text-muted-foreground mt-1">
                            {story.action}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-500">
                            Result:
                          </span>
                          <p className="text-muted-foreground mt-1">
                            {story.result}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Separator />
                </div>
              )}

              {/* Manual add form */}
              {showSTARForm && currentBackground && (
                <div className="mb-6">
                  <STARStoryForm
                    backgroundId={currentBackground.id}
                    onSuccess={handleSTARStoryAdded}
                    onCancel={() => setShowSTARForm(false)}
                  />
                  <Separator className="mt-6" />
                </div>
              )}

              {/* Saved stories */}
              {currentBackground?.star_stories &&
                currentBackground.star_stories.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">
                      Saved Stories
                    </h3>
                    {currentBackground.star_stories.map((story) => (
                      <STARStoryCard key={story.id} story={story} />
                    ))}
                  </div>
                )}

              {/* Empty state */}
              {!currentBackground && pendingStarStories.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  Paste your resume on the Profile tab and click "Auto-fill from
                  Resume" to generate STAR stories automatically.
                </p>
              )}

              {currentBackground &&
                currentBackground.star_stories?.length === 0 &&
                pendingStarStories.length === 0 &&
                !showSTARForm && (
                  <p className="text-muted-foreground text-center py-8">
                    No STAR stories yet. Use auto-fill from your resume or add
                    one manually!
                  </p>
                )}

              {/* Save button if there are pending stories */}
              {pendingStarStories.length > 0 && (
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? "Saving..."
                    : `Save Profile with ${pendingStarStories.length} STAR Stories`}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
