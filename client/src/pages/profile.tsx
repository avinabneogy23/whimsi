import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";
import { BottomNavigation } from "@/components/bottom-navigation";
import { NotificationSettings } from "@/components/notification-settings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
});

export default function Profile() {
  const { user, isLoggedIn, login, register } = useUser();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values.username, values.password);
    } catch (error) {
      // Error is already handled in the context
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const userData = {
        ...values,
        preferences: {
          categories: ["Self Love", "Gratitude", "Mindfulness"],
          darkMode: false,
          notificationsEnabled: true,
          notificationTime: "8",
          backgroundMusicEnabled: false,
        },
      };
      
      await register(userData);
    } catch (error) {
      // Error is already handled in the context
    }
  };

  return (
    <div className="app-container max-w-md mx-auto min-h-screen flex flex-col bg-white bg-opacity-85 backdrop-blur-md">
      <header className="pt-10 px-6">
        <h1 className="font-heading text-2xl font-bold mb-2">Profile</h1>
        {isLoggedIn ? (
          <p className="text-gray-500">Manage your Whimsi account</p>
        ) : (
          <p className="text-gray-500">Sign in to track your affirmations journey</p>
        )}
      </header>

      <main className="flex-1 overflow-y-auto pt-6 pb-20 px-6">
        {isLoggedIn ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-medium">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl mr-4">
                  {user?.firstName?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold">{user?.firstName}</h2>
                  <p className="text-gray-500">@{user?.username}</p>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-4">
                <div className="bg-gray-100 rounded-xl p-3 flex-1 text-center">
                  <p className="text-sm text-gray-500">Streak</p>
                  <p className="font-bold text-lg">{user?.currentStreak || 0} days</p>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 flex-1 text-center">
                  <p className="text-sm text-gray-500">Favorites</p>
                  <p className="font-bold text-lg">0</p>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 flex-1 text-center">
                  <p className="text-sm text-gray-500">Days</p>
                  <p className="font-bold text-lg">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-medium">
              <h2 className="font-heading text-lg font-bold mb-4">Your Affirmation Stats</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Daily streak</span>
                    <span className="text-sm text-primary">{user?.currentStreak || 0}/30 days</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full" 
                      style={{ width: `${Math.min(((user?.currentStreak || 0) / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Favorites added</span>
                    <span className="text-sm text-secondary">0/10</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Categories explored</span>
                    <span className="text-sm text-accent">{user?.preferences?.categories?.length || 0}/5</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-accent h-full rounded-full" 
                      style={{ width: `${Math.min(((user?.preferences?.categories?.length || 0) / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notification Settings */}
            <NotificationSettings />
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-medium">
            <div className="flex mb-4">
              <button 
                className={`flex-1 py-2 ${isRegistering ? 'text-gray-500' : 'font-bold border-b-2 border-primary'}`}
                onClick={() => setIsRegistering(false)}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 py-2 ${isRegistering ? 'font-bold border-b-2 border-primary' : 'text-gray-500'}`}
                onClick={() => setIsRegistering(true)}
              >
                Register
              </button>
            </div>
            
            {isRegistering ? (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                    Create Account
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <button 
                      type="button"
                      className="text-primary hover:underline" 
                      onClick={() => setIsRegistering(false)}
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              </Form>
            ) : (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                    Sign In
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      className="text-primary hover:underline" 
                      onClick={() => setIsRegistering(true)}
                    >
                      Register
                    </button>
                  </p>
                </form>
              </Form>
            )}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
