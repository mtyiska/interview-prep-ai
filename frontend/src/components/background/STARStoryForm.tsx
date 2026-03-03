"use client";

import { useState } from "react";
import { backgroundService } from "@/services/backgroundService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface STARStoryFormProps {
  backgroundId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function STARStoryForm({
  backgroundId,
  onSuccess,
  onCancel,
}: STARStoryFormProps) {
  const [title, setTitle] = useState("");
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await backgroundService.addSTARStory(backgroundId, {
        title,
        situation,
        task,
        action,
        result,
        tags,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to add STAR story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Story Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Led cross-functional project to reduce costs"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="situation">
          Situation <span className="text-gray-500">(Set the scene)</span>
        </Label>
        <Textarea
          id="situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Describe the context and background..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task">
          Task <span className="text-gray-500">(Your responsibility)</span>
        </Label>
        <Textarea
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What was your specific role or challenge?"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="action">
          Action <span className="text-gray-500">(What you did)</span>
        </Label>
        <Textarea
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Describe the specific steps you took..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="result">
          Result <span className="text-gray-500">(The outcome)</span>
        </Label>
        <Textarea
          id="result"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="What was the impact? Include metrics if possible..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="e.g., leadership, problem-solving"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTag())
            }
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : "Save Story"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
