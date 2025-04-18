
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const Timer = () => {
  const [timeInMinutes, setTimeInMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(timeInMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && !isPaused) {
      interval = window.setInterval(() => {
        setSecondsLeft((seconds) => {
          if (seconds <= 1) {
            clearInterval(interval);
            setIsActive(false);
            toast.success("Timer completed!");
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(timeInMinutes * 60);
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setSecondsLeft(timeInMinutes * 60);
  };

  const handleSliderChange = (value: number[]) => {
    const newTime = value[0];
    setTimeInMinutes(newTime);
    if (!isActive) {
      setSecondsLeft(newTime * 60);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Timer</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <span className="text-6xl font-mono">{formatTime(secondsLeft)}</span>
          </div>
          
          {!isActive && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Duration (minutes): {timeInMinutes}</span>
              </div>
              <Slider
                defaultValue={[timeInMinutes]}
                min={1}
                max={60}
                step={1}
                onValueChange={handleSliderChange}
                disabled={isActive}
              />
            </div>
          )}
          
          <div className="flex justify-center space-x-3">
            {!isActive ? (
              <Button onClick={handleStart}>Start</Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button onClick={handlePause} variant="outline">Pause</Button>
                ) : (
                  <Button onClick={handleResume} variant="outline">Resume</Button>
                )}
                <Button onClick={handleReset} variant="destructive">Reset</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Work for 25 minutes, then take a 5-minute break.</li>
            <li>After 4 work intervals, take a longer 15-30 minute break.</li>
            <li>Stay focused on one task during the work interval.</li>
            <li>Use the break to rest, stretch, or grab a drink.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timer;
