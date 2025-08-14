import { MessageType } from "../../../@types/chatTypes";
import { toast } from "react-toastify";

type HandleChangeInputFileProps = {
  event: React.ChangeEvent<HTMLInputElement>,
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>
}
const handleChangeInputFile = (
  {
    event,
    setChatInputValue,
  }: HandleChangeInputFileProps
) => {
  if (!event.target.files) return;

  const files: File[] = Array.from(event.target.files);
  const maxFiles = 5;

  setChatInputValue((prevState) => {
    const currentAttachments = prevState.attachment || [];

    // Ensure we don't exceed maxFiles
    if (files.length + currentAttachments.length > maxFiles) {
      toast.error(`You can upload up to ${maxFiles} files`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return prevState; // Return previous state to prevent changes
    }

    // Filter out files >2MB
    const validFiles = files.filter((file) => file.size <= 2000000);

    if (validFiles.length !== files.length) {
      toast.error(`Some files exceed 2MB size limit`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    return {
      ...prevState,
      attachment: [
        ...currentAttachments, // Preserve previous attachments
        ...validFiles.map((file) => ({
          name: file.name,
          src: URL.createObjectURL(file),
          isImage: file.type.startsWith("image/"),
          type: file.type,
          id: ''
        })),
      ],
    };
  });
};

export default handleChangeInputFile;