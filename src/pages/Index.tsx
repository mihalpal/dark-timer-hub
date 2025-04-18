
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, PauseCircle, RotateCcw } from "lucide-react";

const TIMER_PRESETS = [
  { label: "Pomodoro", value: 25 * 60 },
  { label: "Short Break", value: 5 * 60 },
  { label: "Long Break", value: 15 * 60 },
  { label: "Custom", value: 45 * 60 },
];

const Index = () => {
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS[0].value);
  const [isActive, setIsActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("Pomodoro");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    const preset = TIMER_PRESETS.find(p => p.label === value);
    if (preset) {
      setTimeLeft(preset.value);
      setIsActive(false);
    }
  };

  const handleReset = () => {
    const preset = TIMER_PRESETS.find(p => p.label === selectedPreset);
    if (preset) {
      setTimeLeft(preset.value);
    }
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Calculate progress percentage
  const currentPreset = TIMER_PRESETS.find(p => p.label === selectedPreset);
  const totalTime = currentPreset ? currentPreset.value : 0;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-border shadow-lg overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold text-center">Productivity Timer</CardTitle>
          <CardDescription className="text-center pt-2">
            Stay focused and track your work sessions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center pt-8">
          {/* Timer display with progress */}
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="text-secondary stroke-current"
                strokeWidth="4"
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                className="text-primary stroke-current transition-all duration-500 ease-in-out"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.89}, 289`}
                strokeDashoffset="0"
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Timer controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-12 h-12"
              onClick={handleReset}
            >
              <RotateCcw size={20} />
              <span className="sr-only">Reset</span>
            </Button>
            
            <Button 
              className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90"
              size="icon"
              onClick={toggleTimer}
            >
              {isActive ? (
                <PauseCircle size={32} />
              ) : (
                <PlayCircle size={32} />
              )}
              <span className="sr-only">{isActive ? "Pause" : "Start"}</span>
            </Button>
          </div>

          {/* Timer presets */}
          <div className="w-full">
            <Select
              value={selectedPreset}
              onValueChange={handlePresetChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a timer preset" />
              </SelectTrigger>
              <SelectContent>
                {TIMER_PRESETS.map((preset) => (
                  <SelectItem key={preset.label} value={preset.label}>
                    {preset.label} ({Math.floor(preset.value / 60)} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm text-muted-foreground text-center">
            Select a category in the Categories section to track your time more effectively.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
