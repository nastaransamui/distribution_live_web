import { AttachmentType } from "../../../@types/cattypes";

const downloadClick = ({ attach }: { attach: AttachmentType }) => {
  const link = document.createElement("a");
  link.href = attach.src;
  link.download = attach.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default downloadClick;