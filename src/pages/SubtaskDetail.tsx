
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TimerButton } from "@/components/TimerButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const SubtaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [estimate, setEstimate] = useState<number>(0);

  useEffect(() => {
    const fetchSubtask = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('subtasks')
          .select('name, estimate_seconds')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setName(data.name);
          setEstimate(data.estimate_seconds || 0);
        }
      } catch (error) {
        console.error('Error fetching subtask:', error);
        toast({
          title: "Error",
          description: "Failed to load subtask details",
          variant: "destructive",
        });
      }
    };

    fetchSubtask();
  }, [id]);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Subtask Detail</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimate">
              Estimate ⚡ (minutes)
            </Label>
            <Input
              id="estimate"
              type="number"
              value={estimate}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="pt-4">
            <TimerButton subtaskId={id || ""} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubtaskDetail;
