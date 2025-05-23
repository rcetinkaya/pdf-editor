"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (base64Image: string) => void;
}

export default function SignatureUploadDialog({ open, onClose, onConfirm }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = () => {
    if (preview) {
      onConfirm(preview);
      setPreview(null);
    }
  };

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>İmza Görseli Yükle</DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="mb-4">
          Lütfen PDF üzerine yerleştirilecek imzanızı yükleyin. PNG veya JPG formatında olmalıdır.
        </Typography>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
          onClick={triggerFileSelect}
        >
          <UploadIcon fontSize="large" className="text-blue-500 mx-auto mb-2" />
          <Typography variant="body2" className="text-gray-600">
            Tıklayarak dosya seçin veya sürükleyip bırakın
          </Typography>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview && (
          <div className="mt-4 text-center">
            <Typography variant="caption" className="text-gray-500 mb-2 block">
              Yüklenen İmza Önizlemesi:
            </Typography>
            <img
              src={preview}
              alt="İmza önizleme"
              className="max-h-32 mx-auto rounded shadow border"
            />
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Vazgeç
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!preview}
        >
          İmza Alanı Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
