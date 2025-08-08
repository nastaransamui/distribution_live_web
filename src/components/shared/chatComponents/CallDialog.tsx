/* eslint-disable @next/next/no-img-element */
import { useChat } from "@/hooks/useChat";
import useScssVar from "@/hooks/useScssVar";
import { doctors_profile, patient_profile } from "@/public/assets/imagepath";
import { useTheme } from '@mui/material'
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import { FC, useEffect } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { BootstrapDialog, Transition } from "../Dialog";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

export interface CallDialogPropsType {
  open: boolean;
  toggleFunction: () => void;
  callType: "Video" | "Voice"
}

export const CallDialog: FC<CallDialogPropsType> = (({ open, toggleFunction, callType }) => {
  const { muiVar } = useScssVar();
  const {
    callReceiverUserData,
    isAnswerable,
    acceptVoiceCall,
    chatInputValue,
    fakeMediaRecorder,
    audioBlob,
    recordingTime,
    startRecording,
    isRecording,
    stopRecording,
    togglePauseResume,
    isPaused,
    handleDownload,
    clearRecording,
  } = useChat();
  // const isRecive = incomingCall?.receiverId == currentUserId
  const theme = useTheme();
  const senderRole = callReceiverUserData?.roleName
  const isAnswer = chatInputValue?.calls?.[0]?.isAnswered
  useEffect(() => {
    if (open) {
      clearRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <BootstrapDialog
      TransitionComponent={Transition}
      onClose={() => {

      }}
      aria-labelledby="edit_invoice_details"
      open={open}>
      <div className="modal-body" style={{ ...muiVar, }}>
        <div className="call-box incoming-box">

          <div className="recorder-container">
            <p>Recording Time: {recordingTime}s</p>

            <div className="buttons">
              <IconButton
                disableFocusRipple
                disableRipple
                disableTouchRipple
                disabled={isRecording}
                onClick={startRecording}>
                {/* 🎙 */}
                <RadioButtonCheckedIcon sx={{ fontSize: 36, color: 'crimson' }} />
              </IconButton>
              <IconButton
                disableFocusRipple
                disableRipple
                disableTouchRipple
                disabled={!isRecording}
                onClick={stopRecording}>
                <StopCircleIcon sx={{ fontSize: 36, color: 'primary.main' }} />
              </IconButton>
              <IconButton
                disableFocusRipple
                disableRipple
                disableTouchRipple
                disabled={!isRecording}
                onClick={togglePauseResume}>
                {isPaused ?
                  <PlayCircleIcon sx={{ fontSize: 36, color: "secondary.main" }} /> :
                  <PauseCircleFilledIcon sx={{ fontSize: 36, color: "secondary.main" }} />}
              </IconButton>
            </div>

            {fakeMediaRecorder && isRecording && (
              <span style={{ textAlign: 'center', display: 'flex', padding: '10px 0px', width: '100%', justifyContent: 'center' }}>
                <LiveAudioVisualizer
                  mediaRecorder={fakeMediaRecorder}
                  width={100}
                  height={5}
                  barColor={theme.palette.secondary.main}

                />
              </span>
            )}
            {audioBlob && (
              <div className="audio-player">
                <p>Recorded Audio:</p>
                <span style={{ display: 'flex', justifyContent: "space-evenly" }}>
                  <IconButton
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    disabled={!audioBlob}
                    onClick={handleDownload}>
                    <DownloadForOfflineIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                  </IconButton>
                  <IconButton
                    disableFocusRipple
                    disableRipple
                    disableTouchRipple
                    disabled={!audioBlob}
                    onClick={clearRecording}
                    sx={{ color: "crimson", fontSize: 30 }}
                  >
                    🗑
                  </IconButton>
                </span>
              </div>
            )}
          </div>
          <div className="call-wrapper">
            <div className="call-inner">
              <div className="call-user">
                <img
                  alt="User Image"
                  src={callReceiverUserData?.profileImage}
                  className="call-avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = senderRole == "doctors" ? doctors_profile : patient_profile;
                  }}
                />
                <h4>{callReceiverUserData?.roleName == "doctors" && "Dr. "} {callReceiverUserData?.fullName}</h4>
                <span>{callType} call {isAnswer ? "Connected" : "Connecting..."}</span>
              </div>
              {fakeMediaRecorder && (
                <LiveAudioVisualizer
                  mediaRecorder={fakeMediaRecorder}
                  width={100}
                  height={35}
                  barColor={theme.palette.primary.main}

                />
              )}
              <div className="call-items">
                <Link
                  href="#"
                  className=" call-item call-end"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')
                    setTimeout(() => {
                      toggleFunction()

                    }, 500);
                  }}
                >
                  <i className="material-icons">call_end</i>
                </Link>
                <Link href="/voice-call" onClick={(e) => {
                  e.preventDefault()

                  if (isAnswerable) {
                    acceptVoiceCall();
                  }
                }} style={{ pointerEvents: isAnswerable ? 'auto' : "none" }} className=" call-item call-start">
                  <i className="material-icons">call</i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BootstrapDialog>
  )
})