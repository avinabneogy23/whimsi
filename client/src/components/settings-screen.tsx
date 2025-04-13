import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type SettingsScreenProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SettingsScreen({ isOpen, onClose }: SettingsScreenProps) {
  const { user, logout, isLoggedIn } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode || false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.preferences?.notificationsEnabled || true);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(user?.preferences?.backgroundMusicEnabled || false);
  const [notificationTime, setNotificationTime] = useState(user?.preferences?.notificationTime || "8");

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: any) => {
      const res = await apiRequest("PATCH", "/api/user/preferences", preferences);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    if (isLoggedIn) {
      updatePreferencesMutation.mutate({ darkMode: newValue });
    }
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    if (isLoggedIn) {
      updatePreferencesMutation.mutate({ notificationsEnabled: newValue });
    }
  };

  const handleToggleBackgroundMusic = () => {
    const newValue = !backgroundMusicEnabled;
    setBackgroundMusicEnabled(newValue);
    if (isLoggedIn) {
      updatePreferencesMutation.mutate({ backgroundMusicEnabled: newValue });
    }
  };

  const handleNotificationTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNotificationTime(newValue);
    if (isLoggedIn) {
      updatePreferencesMutation.mutate({ notificationTime: newValue });
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleContactSupport = () => {
    window.open("mailto:support@whimsi.app", "_blank");
  };

  const handlePrivacyPolicy = () => {
    window.open("/privacy", "_blank");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 max-w-md mx-auto bg-white z-40 animate-fade-in">
      <div className="h-full overflow-y-auto">
        <header className="pt-10 px-6 pb-4 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Settings</h1>
          <button 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition" 
            onClick={onClose}
          >
            <i className="ri-close-line"></i>
          </button>
        </header>
        
        <div className="px-6 py-4">
          <div className="mb-8">
            <h2 className="font-heading font-bold text-lg mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Switch to dark theme</p>
                </div>
                <div className="relative inline-block w-12 align-middle">
                  <input 
                    type="checkbox" 
                    id="darkModeToggle" 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer transition-all duration-300 ease-in-out" 
                    checked={darkMode}
                    onChange={handleToggleDarkMode}
                  />
                  <label htmlFor="darkModeToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer"></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Daily Notifications</h3>
                  <p className="text-sm text-gray-500">Reminders for your affirmations</p>
                </div>
                <div className="relative inline-block w-12 align-middle">
                  <input 
                    type="checkbox" 
                    id="notificationsToggle" 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer transition-all duration-300 ease-in-out checked:right-0 checked:border-primary" 
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                  />
                  <label htmlFor="notificationsToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer"></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Background Music</h3>
                  <p className="text-sm text-gray-500">Play calm music while browsing</p>
                </div>
                <div className="relative inline-block w-12 align-middle">
                  <input 
                    type="checkbox" 
                    id="musicToggle" 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-200 appearance-none cursor-pointer transition-all duration-300 ease-in-out"
                    checked={backgroundMusicEnabled}
                    onChange={handleToggleBackgroundMusic}
                  />
                  <label htmlFor="musicToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="font-heading font-bold text-lg mb-4">Notification Time</h2>
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Daily affirmation reminder</span>
                <span className="text-primary">{notificationTime}:00 {parseInt(notificationTime) >= 12 ? 'PM' : 'AM'}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="23" 
                value={notificationTime} 
                onChange={handleNotificationTimeChange}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>12 AM</span>
                <span>12 PM</span>
                <span>11 PM</span>
              </div>
            </div>
          </div>
          
          {isLoggedIn && (
            <div className="mb-8">
              <h2 className="font-heading font-bold text-lg mb-4">Your Categories</h2>
              <div className="space-y-3">
                {user?.preferences?.categories?.map((category: string, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 rounded-xl p-3">
                    <span className="font-medium">{category}</span>
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <i className="ri-check-line text-primary"></i>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="bg-gray-100 rounded-xl p-4">
                    <p className="text-sm text-gray-500 text-center">No categories selected</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-3 mb-12">
            <button 
              className="w-full py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition"
              onClick={handleContactSupport}
            >
              Contact Support
            </button>
            <button 
              className="w-full py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition"
              onClick={handlePrivacyPolicy}
            >
              Privacy Policy
            </button>
            {isLoggedIn && (
              <button 
                className="w-full py-3 bg-red-50 rounded-xl font-medium text-error hover:bg-red-100 transition"
                onClick={handleLogout}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
