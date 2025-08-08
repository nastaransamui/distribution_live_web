import { toast } from "react-toastify";

const openMediaDevices = async (constraints: { video?: boolean, audio?: boolean }) => {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      toast.error("Microphone permission denied. Please allow access.");
    } else if (error.name === "NotFoundError") {
      toast.error("No microphone device found.");
    } else {
      toast.error("An error occurred while accessing the microphone.");
    }

  }

}

export default openMediaDevices;