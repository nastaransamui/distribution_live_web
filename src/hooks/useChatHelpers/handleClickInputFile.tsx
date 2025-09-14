import { RefObject } from "react";

type HandleClickInputFileProps = {
  inputFileRef: RefObject<HTMLInputElement | null>
}
const handleClickInputFile = (
  { inputFileRef }: HandleClickInputFileProps
) => {
  if (inputFileRef.current !== null) {
    inputFileRef.current.click()
  }
}

export default handleClickInputFile;