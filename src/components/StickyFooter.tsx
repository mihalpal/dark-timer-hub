
import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const StickyFooter = () => {
  const { toast } = useToast();
  const [activeTimer, setActiveTimer] = useState<{
    id: string;
    elapsed_seconds: number;
    estimate_seconds: number;
    status: 'running' | 'paused';
  } | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchActiveTimer = async () => {
      const { data, error } = await supabase
        .from('active_timelog')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching active timer:', error);
        return;
      }

      setActiveTimer(data);
    };

    fetchActiveTimer();

    // Set up real-time updates
    const channel = supabase
      .channel('active_timer')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'time_entries'
        },
        () => {
          fetchActiveTimer();
        }
      )
      .subscribe();

    // Set up timer update interval
    const interval = setInterval(() => {
      setActiveTimer(prev => {
        if (prev && prev.status === 'running') {
          return {
            ...prev,
            elapsed_seconds: prev.elapsed_seconds + 1
          };
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const handleToggleTimer = async () => {
    if (!activeTimer) return;

    try {
      if (activeTimer.status === 'running') {
        const { error } = await supabase.rpc('stop_timer', { timer_id: activeTimer.id });
        if (error) throw error;
        toast({
          title: "Timer paused",
          description: "Your timer has been paused"
        });
      } else {
        const { data, error } = await supabase.rpc('start_timer', { subtask_id: activeTimer.id });
        if (error) throw error;
        toast({
          title: "Timer started",
          description: "Your timer is now running"
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

  if (!activeTimer) return null;

  const progress = Math.min(
    (activeTimer.elapsed_seconds / activeTimer.estimate_seconds) * 100,
    100
  );

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex items-center justify-between gap-4"
      style={{ 
        height: '48px',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleTimer}
          aria-label={activeTimer.status === 'running' ? 'Pause timer' : 'Start timer'}
          className="h-11 w-11" // 44px tap target
        >
          {activeTimer.status === 'running' ? (
            <Pause className="h-6 w-6 text-primary" />
          ) : (
            <Play className="h-6 w-6 text-primary" />
          )}
        </Button>
      </div>
      
      <div className="text-xl font-mono">
        {formatTime(activeTimer.elapsed_seconds)}
      </div>
      
      <div className="flex-1 max-w-48">
        <Progress value={progress} className="h-2" />
      </div>
    </footer>
  );
};
