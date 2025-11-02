export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  streakReminders: boolean;
  planCompletionAlerts: boolean;
}

export class NotificationManager {
  private settings: NotificationSettings = {
    enabled: false,
    dailyReminder: true,
    reminderTime: '08:00',
    streakReminders: true,
    planCompletionAlerts: true
  };

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      this.settings = { ...this.settings, ...JSON.parse(stored) };
    }
  }

  private saveSettings(): void {
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.settings.enabled = true;
      this.saveSettings();
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.settings.enabled = true;
        this.saveSettings();
        this.scheduleDailyReminder();
        return true;
      }
    }

    return false;
  }

  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    
    if (this.settings.enabled && this.settings.dailyReminder) {
      this.scheduleDailyReminder();
    }
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  private scheduleDailyReminder(): void {
    if (!this.settings.enabled || !this.settings.dailyReminder) return;

    const [hours, minutes] = this.settings.reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      this.showDailyReminder();
      this.scheduleDailyReminder();
    }, timeUntilReminder);
  }

  private showDailyReminder(): void {
    if (!this.settings.enabled) return;

    new Notification('Daily Bible Reading', {
      body: "Don't forget your daily Bible reading! Keep your streak going.",
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'daily-reminder',
      requireInteraction: false
    });
  }

  showStreakReminder(streak: number): void {
    if (!this.settings.enabled || !this.settings.streakReminders) return;

    const messages = [
      `Amazing! You're on a ${streak}-day reading streak! 🔥`,
      `Keep it up! ${streak} days of consistent reading! 📖`,
      `Incredible dedication! ${streak} days strong! ⭐`
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    new Notification('Reading Streak!', {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'streak-reminder'
    });
  }

  showPlanCompletionAlert(planName: string, progress: number): void {
    if (!this.settings.enabled || !this.settings.planCompletionAlerts) return;

    let message = '';
    if (progress === 100) {
      message = `Congratulations! You've completed the ${planName} reading plan! 🎉`;
    } else if (progress >= 75) {
      message = `You're ${progress}% through ${planName}! Almost there! 💪`;
    } else if (progress >= 50) {
      message = `Halfway there! ${progress}% of ${planName} completed! 🎯`;
    } else if (progress >= 25) {
      message = `Great progress! ${progress}% of ${planName} done! 📈`;
    }

    if (message) {
      new Notification('Reading Plan Progress', {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'plan-progress'
      });
    }
  }

  showCustomNotification(title: string, body: string, tag?: string): void {
    if (!this.settings.enabled) return;

    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: tag || 'custom'
    });
  }
}