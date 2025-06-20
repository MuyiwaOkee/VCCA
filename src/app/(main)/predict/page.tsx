import NotificationTray, { NotificationItemProps } from '@/components/NotificationTray';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Predict",
  description: "Prediction page",
};

const PreditionPage = () => {
  // Mock data
const seenNotifications: NotificationItemProps[] = [
    {
        id: 'notif-001',
        title: 'System Update Completed',
        message: 'Your system update was successfully installed.',
        timestamp: new Date('2025-06-19T10:00:00Z'),
        link: {
            href: '/updates/logs',
            text: 'View logs'
        },
        seen: true
    },
    {
        id: 'notif-002',
        title: 'Weekly Backup',
        message: 'Your weekly backup completed without errors.',
        timestamp: new Date('2025-06-18T14:30:00Z'),
        seen: true
    }
];

const unseenNotifications: NotificationItemProps[] = [
    {
        id: 'notif-003',
        title: 'Security Alert',
        message: 'Unusual login detected from a new device.',
        timestamp: new Date('2025-06-20T08:15:00Z'),
        urgency: 'Warning',
        link: {
            href: '/security/settings',
            text: 'Review activity'
        },
        seen: false,
    },
    {
        id: 'notif-004',
        title: 'Critical System Error',
        message: 'A critical error occurred in the application.',
        timestamp: new Date('2025-06-20T09:00:00Z'),
        urgency: 'Error',
        seen: false
    }
];

  return (
    <section className='w-full'>
      <NotificationTray seenNotifications={seenNotifications} unseenNotifications={unseenNotifications}/>
    </section>
  )
}






export default PreditionPage