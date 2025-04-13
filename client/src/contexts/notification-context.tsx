import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import {
  areNotificationsSupported,
  getNotificationPermission,
  requestNotificationPermission,
  scheduleNotification,
  cancelScheduledNotification,
  getScheduledNotifications,
  initializeNotifications,
  showNotification
} from '@/lib/notifications';
import { useUser } from './user-context';

type NotificationContextType = {
  isSupported: boolean;
  permissionStatus: NotificationPermission;
  scheduledNotifications: any[];
  isEnabled: boolean;
  notificationTime: string;
  requestPermission: () => Promise<NotificationPermission>;
  scheduleAffirmationReminder: (time: string) => Promise<string | null>;
  cancelAffirmationReminder: (id: string) => boolean;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  updateNotificationTime: (time: string) => Promise<void>;
  sendTestNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user, isLoggedIn, updateUserPreferences } = useUser();
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>([]);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [notificationTime, setNotificationTime] = useState<string>("08:00");
  const [notificationId, setNotificationId] = useState<string | null>(null);

  // Initialize state on component mount
  useEffect(() => {
    const supported = areNotificationsSupported();
    setIsSupported(supported);
    
    if (supported) {
      setPermissionStatus(getNotificationPermission());
      initializeNotifications();
      setScheduledNotifications(getScheduledNotifications());
    }
  }, []);

  // Update notification settings when user preferences change
  useEffect(() => {
    if (isLoggedIn && user) {
      setIsEnabled(user.preferences.notificationsEnabled || false);
      setNotificationTime(user.preferences.notificationTime || "08:00");
      
      // Set up notification if enabled and permission granted
      if (user.preferences.notificationsEnabled && permissionStatus === 'granted') {
        scheduleAffirmationReminder(user.preferences.notificationTime || "08:00");
      }
    }
  }, [isLoggedIn, user, permissionStatus]);

  // Request notification permission
  const requestPermission = async () => {
    const permission = await requestNotificationPermission();
    setPermissionStatus(permission);
    return permission;
  };

  // Schedule daily affirmation reminder
  const scheduleAffirmationReminder = async (time: string): Promise<string | null> => {
    if (!isSupported || permissionStatus !== 'granted') {
      console.warn('Cannot schedule notification: not supported or permission denied');
      return null;
    }

    // Cancel previous notification if exists
    if (notificationId) {
      cancelScheduledNotification(notificationId);
    }

    // Schedule new notification
    const newId = scheduleNotification(
      time,
      'Daily Affirmation Reminder',
      {
        body: 'Time for your daily affirmation! Tap to view today\'s positivity boost.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'daily-affirmation',
        requireInteraction: true,
        data: {
          url: '/'
        }
      }
    );

    setNotificationId(newId);
    return newId;
  };

  // Cancel a scheduled notification
  const cancelAffirmationReminder = (id: string): boolean => {
    const success = cancelScheduledNotification(id);
    if (success && id === notificationId) {
      setNotificationId(null);
    }
    return success;
  };

  // Toggle notifications on/off
  const toggleNotifications = async (enabled: boolean): Promise<void> => {
    if (!isLoggedIn || !user) return;

    // If enabling notifications, request permission if not already granted
    if (enabled && permissionStatus !== 'granted') {
      const permission = await requestPermission();
      if (permission !== 'granted') {
        return; // Cannot enable notifications without permission
      }
    }

    // Update local state
    setIsEnabled(enabled);

    // Update user preferences in database
    if (updateUserPreferences) {
      await updateUserPreferences({
        ...user.preferences,
        notificationsEnabled: enabled
      });
    }

    // Schedule or cancel notification based on new state
    if (enabled) {
      await scheduleAffirmationReminder(notificationTime);
    } else if (notificationId) {
      cancelAffirmationReminder(notificationId);
    }
  };

  // Update notification time
  const updateNotificationTime = async (time: string): Promise<void> => {
    if (!isLoggedIn || !user) return;

    // Update local state
    setNotificationTime(time);

    // Update user preferences in database
    if (updateUserPreferences) {
      await updateUserPreferences({
        ...user.preferences,
        notificationTime: time
      });
    }

    // Reschedule notification with new time if enabled
    if (isEnabled && permissionStatus === 'granted') {
      await scheduleAffirmationReminder(time);
    }
  };

  // Send a test notification
  const sendTestNotification = () => {
    if (isSupported && permissionStatus === 'granted') {
      showNotification('Whimsi Test Notification', {
        body: 'This is how your daily affirmation notification will look!',
        icon: '/favicon.ico'
      });
    }
  };

  // Create context value
  const contextValue: NotificationContextType = {
    isSupported,
    permissionStatus,
    scheduledNotifications,
    isEnabled,
    notificationTime,
    requestPermission,
    scheduleAffirmationReminder,
    cancelAffirmationReminder,
    toggleNotifications,
    updateNotificationTime,
    sendTestNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};