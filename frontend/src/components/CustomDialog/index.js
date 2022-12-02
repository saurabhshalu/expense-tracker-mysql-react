import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomDialog = ({ open, handleClose, title, children }) => {
  const handleCloseDialog = (event, reason) => {
    event.preventDefault();
    if (reason && reason === "backdropClick") return;
    handleClose();
  };

  if (!open) {
    return null;
  }
  return (
    <Dialog
      keepMounted={false}
      open={open}
      disableEscapeKeyDown
      onClose={handleCloseDialog}
      maxWidth="sm"
    >
      {title && (
        <DialogTitle
          style={{
            marginBottom: 0,
            paddingBottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      {children && (
        <DialogContent style={{ padding: 0 }}>{children}</DialogContent>
      )}
    </Dialog>
  );
};

export default CustomDialog;
