const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf")) return "/assets/images/icons/pdf-icon.png";
  if (fileType.includes("word")) return "/assets/images/icons/word-icon.png";
  if (fileType.includes("excel")) return "/assets/images/icons/excel-icon.png";
  if (fileType.includes("powerpoint"))
    return "/assets/images/icons/ppt-icon.png";
  if (fileType.includes("text")) return "/assets/images/icons/txt-icon.png";
  if (fileType.includes("zip")) return "/assets/images/icons/zip-icon.png";
  return "/assets/images/icons/image-icon.png"; // Default icon
};

export default getFileIcon;
