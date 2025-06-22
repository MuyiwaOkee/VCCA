"use client"
import { NotificationItemProps } from '@/components/NotificationTray'
import TextModal, { TextModalRef } from '@/components/TextModal'
import React, { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { VisaFileDownloadLow } from '@visa/nova-icons-react'

type RouteParams = {
  params: {
    notificationid: string
  }
}

const NotificationModal = ({ params }: RouteParams) => {
  const router = useRouter();

  const modalRef = useRef<TextModalRef>(null);

  const { notificationid } = params; // will use this to fetch notfication content in future

  const Notifications: NotificationItemProps[] = [
      {
          id: 'notif001',
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
          id: 'notif002',
          title: 'Weekly Backup',
          message: 'Your weekly backup completed without errors.',
          timestamp: new Date('2025-06-18T14:30:00Z'),
          seen: true
      }
  ];

  const HandleClose = () => {
    router.push('/notifications');
    modalRef.current?.toggleModal(false)
  }

  const notfication = Notifications.find(({ id }) => id === notificationid);

  if (notfication) {
    return (
    <TextModal ref={modalRef} stateClass={{
        state: 'viewing',
        message:  notfication.message,
      }} 
      primaryButton={{
        text: 'Download',
        icon: <VisaFileDownloadLow />,
        onClickFunc: HandleClose
      }} 
      secondaryButton={{
        text: 'Mark as read',
        onClickFunc: HandleClose
      }}
      notificationTitle={notfication.title} isOpen onCloseFunc={HandleClose}/>
  )
  } else {
    // Show error Modal
    return (
      <TextModal ref={modalRef} stateClass={{
        state: 'error',
        message: 'notfication not found',
      }} 
      primaryButton={{
        text: 'Close',
        onClickFunc: HandleClose
      }}  notificationTitle='Error' isOpen onCloseFunc={HandleClose}/>
    )
  }
}

export default NotificationModal