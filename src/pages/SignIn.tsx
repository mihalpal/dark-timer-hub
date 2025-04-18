
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const navigate = useNavigate();

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[360px] border-border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome to Effective Executive
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            onClick={() => handleOAuthSignIn("google")}
            className="w-full flex gap-2 items-center justify-center"
            aria-label="Sign in with Google"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => handleOAuthSignIn("apple")}
            className="w-full flex gap-2 items-center justify-center"
            aria-label="Sign in with Apple"
          >
            <AppleIcon />
            Continue with Apple
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Icons for the buttons
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2.5a4.38 4.38 0 0 0-2.91 1.5 4.08 4.08 0 0 0-1.03 2.96 3.61 3.61 0 0 0 2.88-1.77M16 8.58c1.64 0 2.38.89 3.61.89 1.25 0 1.73-.89 3.25-.89a4.31 4.31 0 0 1 3.75 1.89 4.18 4.18 0 0 0-2.08 3.66c0 1.87 1.14 3.56 2.47 4.23-.2.62-.48 1.22-.83 1.79-.56.89-1.17 1.79-2.11 1.79-.93 0-1.23-.57-2.3-.57-1.06 0-1.4.57-2.28.57s-1.51-.87-2.11-1.79c-.8-1.15-1.41-2.91-1.41-4.59 0-2.7 1.67-4.13 3.14-4.13 1.04 0 1.85.57 2.28.57.42 0 1.27-.57 2.28-.57z" />
  </svg>
);

export default SignIn;
