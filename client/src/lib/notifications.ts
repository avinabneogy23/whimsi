// Notifications utility functions

/**
 * Check if browser notifications are supported
 */
export function areNotificationsSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Request permission to display notifications
 * Returns a promise that resolves to the permission state
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!areNotificationsSupported()) {
    return 'denied';
  }
  
  return await Notification.requestPermission();
}

/**
 * Check notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!areNotificationsSupported()) {
    return 'denied';
  }
  
  return Notification.permission;
}

/**
 * Display a notification with the given title and options
 */
export function showNotification(title: string, options?: NotificationOptions): Notification | null {
  if (!areNotificationsSupported() || Notification.permission !== 'granted') {
    console.warn('Notifications are not supported or permission not granted');
    return null;
  }
  
  return new Notification(title, options);
}

/**
 * Schedule a notification to be shown at the given time
 * @param time Time in 24-hour format (e.g., "08:00")
 * @param title Notification title
 * @param options Notification options
 * @returns ID for the scheduled notification
 */
export function scheduleNotification(time: string, title: string, options?: NotificationOptions): string {
  const notificationId = generateUniqueId();
  
  // Convert time string (e.g., "08:00") to milliseconds since midnight
  const [hours, minutes] = time.split(':').map(Number);
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  // If the time has already passed today, schedule for tomorrow
  const now = new Date();
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  // Calculate delay in milliseconds
  const delay = scheduledTime.getTime() - now.getTime();
  
  // Store scheduled notification details in localStorage
  const scheduledNotification = {
    id: notificationId,
    time: time,
    title: title,
    options: options || {},
    nextTrigger: scheduledTime.getTime()
  };
  
  // Save to localStorage
  saveScheduledNotification(scheduledNotification);
  
  // Set timeout for this notification to trigger
  setTimeout(() => {
    triggerNotification(notificationId);
  }, delay);
  
  return notificationId;
}

/**
 * Cancel a scheduled notification
 */
export function cancelScheduledNotification(id: string): boolean {
  const notifications = getScheduledNotifications();
  const index = notifications.findIndex(n => n.id === id);
  
  if (index === -1) {
    return false;
  }
  
  notifications.splice(index, 1);
  localStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
  return true;
}

/**
 * Get list of all scheduled notifications
 */
export function getScheduledNotifications(): any[] {
  const storedNotifications = localStorage.getItem('scheduledNotifications');
  return storedNotifications ? JSON.parse(storedNotifications) : [];
}

/**
 * Save a scheduled notification to localStorage
 */
function saveScheduledNotification(notification: any): void {
  const notifications = getScheduledNotifications();
  const existingIndex = notifications.findIndex(n => n.id === notification.id);
  
  if (existingIndex !== -1) {
    notifications[existingIndex] = notification;
  } else {
    notifications.push(notification);
  }
  
  localStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
}

/**
 * Trigger a notification by its ID
 */
function triggerNotification(id: string): void {
  const notifications = getScheduledNotifications();
  const notification = notifications.find(n => n.id === id);
  
  if (!notification) {
    return;
  }
  
  // Show the notification
  showNotification(notification.title, notification.options);
  
  // Reschedule for the next day
  const nextTrigger = new Date(notification.nextTrigger);
  nextTrigger.setDate(nextTrigger.getDate() + 1);
  notification.nextTrigger = nextTrigger.getTime();
  
  // Update in storage
  saveScheduledNotification(notification);
  
  // Set new timeout
  const now = new Date();
  const delay = nextTrigger.getTime() - now.getTime();
  setTimeout(() => {
    triggerNotification(id);
  }, delay);
}

/**
 * Initialize notifications system
 * This should be called when the app starts
 */
export function initializeNotifications(): void {
  if (!areNotificationsSupported()) {
    console.warn('Notifications are not supported in this browser');
    return;
  }
  
  const notifications = getScheduledNotifications();
  const now = new Date().getTime();
  
  // Set up timeouts for all previously scheduled notifications
  notifications.forEach(notification => {
    const nextTrigger = notification.nextTrigger;
    
    if (nextTrigger > now) {
      // Schedule the notification with the saved trigger time
      const delay = nextTrigger - now;
      setTimeout(() => {
        triggerNotification(notification.id);
      }, delay);
    } else {
      // If the trigger time has passed, reschedule for tomorrow
      const updatedTrigger = new Date(nextTrigger);
      while (updatedTrigger.getTime() <= now) {
        updatedTrigger.setDate(updatedTrigger.getDate() + 1);
      }
      
      notification.nextTrigger = updatedTrigger.getTime();
      saveScheduledNotification(notification);
      
      const delay = updatedTrigger.getTime() - now;
      setTimeout(() => {
        triggerNotification(notification.id);
      }, delay);
    }
  });
}

/**
 * Generate a unique ID for a notification
 */
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}