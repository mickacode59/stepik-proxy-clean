import React, { useEffect, useRef } from 'react';

interface Notification {
  id: string;
  type: 'message' | 'post' | 'friend' | 'badge';
  text: string;
  icon: string;
  sound: string;
  date: Date;
}

interface Props {
  notifications: Notification[];
  soundEnabled: boolean;
}

const NotificationBar: React.FC<Props> = ({ notifications, soundEnabled }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (soundEnabled && notifications.length > 0) {
      const last = notifications[0];
      if (last.sound) {
        audioRef.current!.src = last.sound;
        audioRef.current!.play();
      }
    }
  }, [notifications, soundEnabled]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      <audio ref={audioRef} />
      {notifications.slice(0, 3).map(n => (
        <div key={n.id} className="flex items-center gap-2 bg-white dark:bg-gray-900 shadow-lg rounded px-4 py-2 border border-gray-200 dark:border-gray-700 animate-fade-in">
          <span className="text-2xl">{n.icon}</span>
          <span className="font-medium">{n.text}</span>
          <span className="text-xs text-gray-400 ml-2">{n.date.toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationBar;
