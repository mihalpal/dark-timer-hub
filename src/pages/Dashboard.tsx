
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface TimeData {
  day: string;
  total_seconds: number;
}

const formatHours = (seconds: number) => {
  return (seconds / 3600).toFixed(1);
};

const Dashboard = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { data: timeData } = useQuery({
    queryKey: ["daily-time-summary"],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      
      const { data, error } = await supabase
        .from('daily_time_summary')
        .select('*')
        .gte('day', sevenDaysAgo.toISOString())
        .order('day');
      
      if (error) throw error;
      return data as TimeData[];
    }
  });

  const chartData = timeData?.map(entry => ({
    day: new Date(entry.day).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: Number((entry.total_seconds / 3600).toFixed(1))
  })) || [];

  const todayTotal = timeData?.find(
    entry => new Date(entry.day).toDateString() === new Date().toDateString()
  )?.total_seconds || 0;

  const weekTotal = timeData?.reduce(
    (sum, entry) => sum + entry.total_seconds, 
    0
  ) || 0;

  if (!timeData?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <img 
          src="/placeholder.svg" 
          alt="No data illustration" 
          className="max-w-md w-full opacity-60"
        />
        <Button asChild>
          <Link to="/subtasks">Start your first timer</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <ChartContainer 
          className="h-64" 
          config={{
            hours: { theme: { light: "#4CAF50", dark: "#4CAF50" } }
          }}
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            style={{ userSelect: 'none' }}
          >
            <XAxis 
              dataKey="day" 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <Bar
              dataKey="hours"
              fill="var(--color-hours)"
              radius={[4, 4, 0, 0]}
              animationDuration={prefersReducedMotion ? 0 : 300}
            />
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
          </BarChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Today</div>
            <h2 className="text-3xl font-bold">{formatHours(todayTotal)} h</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">This Week</div>
            <h2 className="text-3xl font-bold">{formatHours(weekTotal)} h</h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
