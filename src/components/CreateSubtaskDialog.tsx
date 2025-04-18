
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function CreateSubtaskDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [estimateMinutes, setEstimateMinutes] = useState(25);
  const queryClient = useQueryClient();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('subtasks')
        .insert({
          name,
          estimate_seconds: estimateMinutes * 60
        });
        
      if (error) throw error;
      
      toast.success("Subtask created successfully!");
      await queryClient.invalidateQueries({ queryKey: ['subtasks'] });
      setOpen(false);
      setName("");
      setEstimateMinutes(25);
    } catch (error) {
      toast.error("Failed to create subtask");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Subtask</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Subtask</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subtask name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Estimated Duration (minutes): {estimateMinutes}</Label>
            <Slider
              value={[estimateMinutes]}
              onValueChange={(value) => setEstimateMinutes(value[0])}
              min={1}
              max={120}
              step={1}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Subtask
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
