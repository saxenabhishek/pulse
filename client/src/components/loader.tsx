import * as React from "react";
import { Progress } from "@/components/ui/progress";

export function ProgressBar() {
  const [progress, setProgress] = React.useState(13);
  React.useEffect(() => {
    const timer66 = setTimeout(() => setProgress(66), 500);
    const timer100 = setTimeout(() => setProgress(100), 1000);
    return () => {
      clearTimeout(timer66);
      clearTimeout(timer100);
    };
  }, []);
  return <Progress value={progress} className="w-[60%]" />;
}
