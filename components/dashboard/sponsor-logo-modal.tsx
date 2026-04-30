"use client";

import { useState } from "react";
import { X, Edit2, Trash2, Upload, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SponsorLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorType: "gold" | "partner";
  initialData?: {
    title: string;
    logoUrl?: string;
    redirectLink?: string;
  };
  onSave?: (data: {
    title: string;
    logoUrl?: string;
    redirectLink?: string;
  }) => void;
}

export function SponsorLogoModal({
  isOpen,
  onClose,
  sponsorType,
  initialData,
  onSave,
}: SponsorLogoModalProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [redirect, setRedirect] = useState(
    initialData?.redirectLink || "no-links",
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setLogoUrl("");
    setUploadedFile(null);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        title,
        logoUrl,
        redirectLink: redirect,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  const sponsorTitle =
    sponsorType === "gold" ? "Gold Sponsor" : "Partners/Sponsors";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">{sponsorTitle}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Section Title */}
          <div>
            <label className="text-sm font-medium text-foreground">
              *Section Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter section title"
              className="mt-2 h-10"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-foreground">
              *Image
            </label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 bg-secondary/30">
              {logoUrl ? (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <img
                      src={logoUrl}
                      alt="Sponsor logo"
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary rounded transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                  <Upload className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Click to upload logo
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG, SVG (Max 10MB)
                  </span>
                </label>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Redirection */}
          <div>
            <label className="text-sm font-medium text-foreground">
              *Redirection
            </label>
            <Select value={redirect} onValueChange={setRedirect}>
              <SelectTrigger className="mt-2 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-links">No Links</SelectItem>
                <SelectItem value="external-url">External URL</SelectItem>
                <SelectItem value="internal-link">Internal Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {redirect === "external-url" && (
            <div>
              <label className="text-sm font-medium text-foreground">
                External URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com"
                className="mt-2 h-10"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-white">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
