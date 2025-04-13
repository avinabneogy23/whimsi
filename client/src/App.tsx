import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home.tsx";
import Explore from "@/pages/explore";
import Mood from "@/pages/mood";
import Profile from "@/pages/profile";
import { UserProvider } from "@/contexts/user-context";
import { AudioProvider } from "@/contexts/audio-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { useEffect } from "react";
import { initializeGhibliEffects } from "@/lib/backgroundEffects";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/mood" component={Mood} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Ghibli visual effects when app loads
  useEffect(() => {
    // Initialize the Ghibli-inspired background and animations
    initializeGhibliEffects();
    
    // Rotate backgrounds periodically (every 3 minutes)
    const backgroundRotationInterval = setInterval(() => {
      initializeGhibliEffects();
    }, 3 * 60 * 1000);
    
    return () => {
      clearInterval(backgroundRotationInterval);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AudioProvider>
          <NotificationProvider>
            <Router />
            <Toaster />
          </NotificationProvider>
        </AudioProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
