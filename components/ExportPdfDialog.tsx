"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ExportConfigData {
  nama: string;
  nim: string;
  instansi: string;
}

interface ExportPdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (data: ExportConfigData) => void;
}

export function ExportPdfDialog({ open, onOpenChange, onExport }: ExportPdfDialogProps) {
  const [formData, setFormData] = useState<ExportConfigData>({
    nama: "",
    nim: "",
    instansi: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfigurasi Ekspor Laporan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">NIM / NIP / ID</label>
            <input
              required
              className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.nim}
              onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
              placeholder="Masukkan nomor identitas"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Instansi / Universitas</label>
            <input
              required
              className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.instansi}
              onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
              placeholder="Masukkan asal instansi"
            />
          </div>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Unduh PDF
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
