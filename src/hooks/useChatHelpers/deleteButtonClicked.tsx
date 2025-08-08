
import React, { MouseEvent, } from "react";

type DeleteButtonClickProps = {
  event: MouseEvent<HTMLButtonElement>,
  setDeleteConfirmationShow: React.Dispatch<React.SetStateAction<boolean>>,
}

const deleteButtonClicked = (
  {
    event,
    setDeleteConfirmationShow
  }: DeleteButtonClickProps
) => {
  event.preventDefault()
  event.stopPropagation();
  setDeleteConfirmationShow(true)
}

export default deleteButtonClicked;