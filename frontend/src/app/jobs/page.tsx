"use client";

import { useState, useEffect } from "react";
import { jobService } from "@/services/jobService";
import { JobDescription } from "@/types/job";
import { useAppStore } from "@/store/appStore";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { Plus, Briefcase, CheckCircle, Loader2 } from "lucide-react";

export default function JobsPage() {
  const { currentJob, setCurrentJob } = useAppStore();
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobService.list();
      setJobs(data);
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsCreating(true);
    try {
      const job = await jobService.create({
        title,
        company: company || undefined,
        raw_text: rawText,
      });
      setJobs([job, ...jobs]);
      setCurrentJob(job);
      setDialogOpen(false);
      setTitle("");
      setCompany("");
      setRawText("");
      toast.success("Job description added and analyzed!");
    } catch (error) {
      toast.error("Failed to create job description");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectJob = (job: JobDescription) => {
    setCurrentJob(job);
    toast.success(`Selected: ${job.title}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Targets</h1>
          <p className="text-gray-600 mt-2">
            Add job descriptions to get role-specific interview questions
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Job Description</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rawText">Job Description *</Label>
                <Textarea
                  id="rawText"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={10}
                  required
                />
              </div>

              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Add & Analyze"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : jobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No job descriptions yet.</p>
            <p className="text-gray-400 text-sm">Add one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className={`cursor-pointer transition-all ${
                currentJob?.id === job.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "hover:border-gray-300"
              }`}
              onClick={() => handleSelectJob(job)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {job.title}
                      {currentJob?.id === job.id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </CardTitle>
                    {job.company && (
                      <CardDescription>{job.company}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Must-Have Skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {job.extracted_requirements.must_have_skills
                        .slice(0, 5)
                        .map((skill) => (
                          <Badge
                            key={skill}
                            variant="default"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      {job.extracted_requirements.must_have_skills.length >
                        5 && (
                        <Badge variant="outline" className="text-xs">
                          +
                          {job.extracted_requirements.must_have_skills.length -
                            5}{" "}
                          more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {job.extracted_requirements.suggested_question_topics.length >
                    0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Interview Topics:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {job.extracted_requirements.suggested_question_topics
                          .slice(0, 4)
                          .map((topic) => (
                            <Badge
                              key={topic}
                              variant="secondary"
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
