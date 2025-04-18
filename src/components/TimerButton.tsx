
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface TimerButtonProps {
  subtaskId: string;
}

export const TimerButton = ({ subtaskId }: TimerButtonProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTimerId, setCurrentTimerId] = useState<string | null>(null);

  const handleTimer = async () => {
    try {
      if (!isRunning) {
        const { data, error } = await supabase.rpc('start_timer', { subtask_id: subtaskId });
        if (error) throw error;
        
        // Access timer_id from the JSON object
        if (data && typeof data === 'object' && 'timer_id' in data) {
          setCurrentTimerId(data.timer_id as string);
          setIsRunning(true);
          toast({
            title: "Timer started",
            description: "Your timer is now running",
          });
        }
      } else if (currentTimerId) {
        const { error } = await supabase.rpc('stop_timer', { timer_id: currentTimerId });
        if (error) throw error;
        setIsRunning(false);
        toast({
          title: "Timer paused",
          description: "Your timer has been paused",
        });
      }
    } catch (error) {
      console.error('Timer operation failed:', error);
      toast({
        title: "Error",
        description: "Failed to update timer",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleTimer}
      className="gap-2"
      size="lg"
    >
      {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      {isRunning ? 'Pause' : 'Start'}
    </Button>
  );
};
