import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

const LeaveGroupDialogue = ({open,handleClose,deleteHandler}) => {
  return (
    <Dialog open={open} onClose={handleClose} >
        <DialogTitle>
            Confirm Leave
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to leave the group?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button color='error' onClick={deleteHandler}>Yes</Button>
        </DialogActions>

    </Dialog>
  )
}

export default LeaveGroupDialogue