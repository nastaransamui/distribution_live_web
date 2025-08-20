
import { FC, Fragment } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'
import DialogContent from '@mui/material/DialogContent'
import Stack from '@mui/material/Stack'

import { useChat } from '@/hooks/useChat';
import { BootstrapDialog, BootstrapDialogTitle, Transition } from './Dialog';
import Snackbar from '@mui/material/Snackbar'
import useScssVar from '@/hooks/useScssVar';
import _ from 'lodash';
import ChatLeftHeader from './chatComponents/ChatLeftHeader';
import ChatLeftSearch from './chatComponents/ChatLeftSearch';
import ChatRightBody from './chatComponents/ChatRightBody';
import ChatRightFooter from './chatComponents/ChatRightFooter';
import ChatRightHeader from './chatComponents/ChatRightHeader';
import MobileShowSearchButton from './chatComponents/MobileShowSearchButton';
import ChatLeftUsers from './chatComponents/ChatLeftUsers';

export function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export interface ChatComponentType {
  userType: 'doctors' | 'patient';
}

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(weekday)
dayjs.extend(updateLocale)
const ChatComponent: FC<ChatComponentType> = (({ userType }) => {
  const { muiVar } = useScssVar()

  const {
    footerHeight,
    currentRoom,
    deleteConfirmationShow,
    setDeleteConfirmationShow,
    deleteSubmited,
    setDeleteType,
    showSnackBar,
    setShowSnakBar,
    minWidth768
  } = useChat()

  return (
    <Fragment>

      <audio id="remoteAudio" autoPlay playsInline />
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="new-chat-window row g-0">
          <div style={{ minHeight: minWidth768 ? `calc(100vh + ${footerHeight}px)` : '131px' }}
            className="new-chat-cont-left col-xl-4 col-md-4">
            {!minWidth768 &&
              <MobileShowSearchButton />
            }
            <ChatLeftHeader />

            <ChatLeftSearch userType={userType} />

            <ChatLeftUsers />
          </div>

          <div
            style={{ minHeight: `calc(100vh + ${footerHeight}px)` }}
            className={`new-chat-cont-right ${currentRoom == null ? 'new-chat-cont-right-empty' : ''} col-xl-8 col-md-8`}>
            <ChatRightHeader />

            <ChatRightBody />

            <ChatRightFooter />
          </div>
        </div>
      </div>


      {deleteConfirmationShow && <BootstrapDialog
        TransitionComponent={Transition}
        onClose={(_, reason) => {
          if (reason == 'backdropClick') return false;
          document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

          setTimeout(() => {
            setDeleteConfirmationShow(false)
          }, 500);
        }}
        aria-labelledby="edit_invoice_details"
        open={deleteConfirmationShow}
      >
        <BootstrapDialogTitle
          id="edit_invoice_details" onClose={() => {
            document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

            setTimeout(() => {
              setDeleteConfirmationShow(false)
              setDeleteType(null)
            }, 500);
          }}>
          <Stack>
            <span>Delete</span>

          </Stack>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <h4 className="modal-title" style={{ display: 'flex', justifyContent: 'center' }}>Delete</h4>
          <p className="mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Are you sure to delete  this record?</p>
          <span style={{ ...muiVar, display: 'flex', justifyContent: 'center' }}><button type="button" className="btnLogin mx-1"
            onClick={() => {
              deleteSubmited()
            }}>Delete </button>
            <button type="button" className="btnLogout" style={muiVar}
              onClick={() => {
                document.getElementById('edit_invoice_details')?.classList.replace('animate__backInDown', 'animate__backOutDown')

                setTimeout(() => {
                  setDeleteConfirmationShow(false)
                  setDeleteType(null)
                }, 500);

              }}>Cancell</button>
          </span>
        </DialogContent>
      </BootstrapDialog>}
      {showSnackBar.show && <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={showSnackBar.show}
        onClose={() => setShowSnakBar({ show: false, text: "" })}
        autoHideDuration={1000}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: 'primary.main',
            color: "background.paper"
          }
        }}
        message={showSnackBar.text}
      />}
    </Fragment>
  )
})

export default ChatComponent;