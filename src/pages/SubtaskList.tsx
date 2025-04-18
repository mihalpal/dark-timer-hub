
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";

const SubtaskList: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-6 w-6" />
            Subtasks
          </CardTitle>
          <Button>Add Subtask</Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No subtasks yet. Create your first subtask!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubtaskList;
