export interface IReminder {
    content: string;
    reminderDateTime: Date;
    repeat: boolean;
    reminderType?: string;
    soundName?: string;
    soundUrl?: string;
    animationName?: string;
    animationUrl?: string;
    breakTime?: number;
    breakDuration?: number;
}
