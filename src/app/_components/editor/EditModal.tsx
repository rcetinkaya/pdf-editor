'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState } from "react";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  initialText: string;
  onSave: (updatedText: string) => void;
}

export default function EditModal({ open, onClose, initialText, onSave }: EditModalProps) {
  const [editedText, setEditedText] = useState(initialText);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Metni Düzenle</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={4}
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button
          onClick={() => {
            onSave(editedText);
            onClose();
          }}
          variant="contained"
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
