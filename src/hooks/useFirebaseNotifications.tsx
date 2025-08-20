import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getMessaging, onMessage, isSupported } from 'firebase/messaging';
import _ from 'lodash'
import { useChat } from './useChat';
import { handleReciveCall } from './useChatHooks/useReceiveVoiceCall';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

const useFirebaseNotifications = () => {
  const router = useRouter();
  const {
    setIncomingCall,
    setVoiceCallActive,
    setIsAnswerable,
    setChatInputValue,
    currentUserId,
    userChatData,
    setCallReceiverUserData,
    makeCallAudioRef,
    missedCallTimeout,
    setEndCall,
    voiceCallToggleFunction,
    voiceCallActive
  } = useChat();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
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

              if (data.type == "voiceCall") {
                handleReciveCall({
                  homeSocket,
                  setIncomingCall,
                  setVoiceCallActive,
                  setIsAnswerable,
                  setChatInputValue,
                  currentUserId,
                  userChatData,
                  setCallReceiverUserData,
                  makeCallAudioRef,
                  missedCallTimeout,
                  setEndCall,
                  data: JSON.parse(data.params)
                })
              }
              if (data.type == 'endVoiceCall') {
                if (voiceCallActive)
                  voiceCallToggleFunction()
              }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, homeSocket, makeCallAudioRef, missedCallTimeout, router, setCallReceiverUserData, setChatInputValue, setEndCall, setIncomingCall, setIsAnswerable, setVoiceCallActive, userChatData, voiceCallToggleFunction]);
};

export default useFirebaseNotifications;