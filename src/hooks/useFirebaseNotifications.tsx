import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getMessaging, onMessage, isSupported } from 'firebase/messaging';
import _ from 'lodash'

const useFirebaseNotifications = () => {
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupMessaging = async () => {
      // Check if FCM is supported in this browser/context
      const supported = await isSupported();

      // Only proceed if we're on https or localhost AND supported
      const isSecureContext =
        typeof window !== 'undefined' &&
        (window.location.protocol === 'https:' || window.location.hostname === 'localhost');

      if (supported && isSecureContext) {
        try {
          const messaging = getMessaging();

          unsubscribe = onMessage(messaging, (payload) => {
            const { title, body } = payload.notification || {};
            const data = payload.data ?? {};

            if (_.isEmpty(router.query) || router.query?.roomId !== data['roomId']) {
              new Notification(title || 'Notification', {
                body: body || 'You have a new message.',
                icon: payload.notification?.icon || '/health_logo_clear_70.webp',
              });
            }
          });
        } catch (err) {
          console.error('Failed to initialize Firebase Messaging:', err);
        }
      } else {
        console.warn('Firebase messaging not supported or not in a secure context');
      }
    };

    setupMessaging();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);
};

export default useFirebaseNotifications;