import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

export function VoiceButton({
  isListening,
  onStart,
  onStop,
  className,
}: VoiceButtonProps) {
  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      onClick={isListening ? onStop : onStart}
      className={cn("gap-2", className)}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Voice Input
        </>
      )}
    </Button>
  );
}
