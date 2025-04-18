
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Timer, ListTodo } from "lucide-react";

const navItems = [
  { icon: Timer, label: "Timer", path: "/" },
  { icon: ListTodo, label: "Categories", path: "/categories" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-border flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">TimerFocus</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon size={18} className={isActive ? "text-primary" : ""} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          <span>Signed in as</span>
          <p className="font-medium text-foreground">user@example.com</p>
        </div>
      </div>
    </div>
  );
};
