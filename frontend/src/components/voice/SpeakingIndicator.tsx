import { Volume2 } from "lucide-react";

export function SpeakingIndicator() {
  return (
    <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
      <Volume2 className="h-4 w-4 animate-pulse" />
      <span className="text-sm font-medium">AI is speaking...</span>
      <div className="flex gap-1">
        <span
          className="w-1 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1 h-3 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
