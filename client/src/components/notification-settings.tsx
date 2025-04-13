import React, { useState } from 'react';
import { useNotification } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideInfo, Bell, Clock, BellOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function NotificationSettings() {
  const { 
    isSupported, 
    permissionStatus, 
    isEnabled, 
    notificationTime,
    requestPermission,
    toggleNotifications,
    updateNotificationTime,
    sendTestNotification
  } = useNotification();
  
  const [timeInput, setTimeInput] = useState(notificationTime);
  
  // Check if browser supports notifications
  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Your browser doesn't support notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To receive daily affirmation reminders, please use a modern browser that supports web notifications.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Handle permission request
  const handleRequestPermission = async () => {
    const permission = await requestPermission();
    if (permission === 'granted') {
      toast({
        title: 'Notifications enabled',
        description: 'You will now receive daily affirmation reminders',
      });
    } else {
      toast({
        title: 'Permission denied',
        description: 'Please enable notifications in your browser settings',
        variant: 'destructive',
      });
    }
  };

  // Handle toggle notifications
  const handleToggleNotifications = async (checked: boolean) => {
    if (checked && permissionStatus !== 'granted') {
      await handleRequestPermission();
    }
    
    await toggleNotifications(checked);
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  // Save notification time
  const handleSaveTime = async () => {
    await updateNotificationTime(timeInput);
    toast({
      title: 'Reminder time updated',
      description: `Your daily affirmation will be sent at ${timeInput}`,
    });
  };

  // Test notification
  const handleTestNotification = () => {
    sendTestNotification();
    toast({
      title: 'Test notification sent',
      description: 'Check your notification area',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Get daily reminders for your affirmations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {permissionStatus !== 'granted' && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-4">
            <div className="flex items-start gap-2">
              <LucideInfo className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Permission Required</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Browser permissions are needed to send you notification reminders.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
                  onClick={handleRequestPermission}
                >
                  Allow Notifications
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-toggle" className="text-base">Enable Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Receive daily affirmation reminders
            </p>
          </div>
          <Switch
            id="notifications-toggle"
            checked={isEnabled}
            disabled={permissionStatus !== 'granted'}
            onCheckedChange={handleToggleNotifications}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reminder-time" className="text-base">Reminder Time</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="reminder-time"
                type="time"
                value={timeInput}
                onChange={handleTimeChange}
                className="pl-8"
                disabled={!isEnabled || permissionStatus !== 'granted'}
              />
            </div>
            <Button 
              onClick={handleSaveTime} 
              disabled={!isEnabled || permissionStatus !== 'granted' || timeInput === notificationTime}
            >
              Save
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Set the time for your daily affirmation reminder
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={handleTestNotification}
          disabled={permissionStatus !== 'granted'}
        >
          Test Notification
        </Button>
      </CardFooter>
    </Card>
  );
}