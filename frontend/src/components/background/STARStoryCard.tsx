import { STARStory } from "@/types/background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface STARStoryCardProps {
  story: STARStory;
}

export function STARStoryCard({ story }: STARStoryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{story.title}</CardTitle>
          <div className="flex gap-1">
            {story.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <span className="font-semibold text-blue-500">Situation:</span>
          <p className="text-muted-foreground mt-1">{story.situation}</p>
        </div>
        <div>
          <span className="font-semibold text-green-500">Task:</span>
          <p className="text-muted-foreground mt-1">{story.task}</p>
        </div>
        <div>
          <span className="font-semibold text-orange-500">Action:</span>
          <p className="text-muted-foreground mt-1">{story.action}</p>
        </div>
        <div>
          <span className="font-semibold text-purple-500">Result:</span>
          <p className="text-muted-foreground mt-1">{story.result}</p>
        </div>
      </CardContent>
    </Card>
  );
}
