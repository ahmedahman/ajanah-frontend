"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Exhibitor } from "@/lib/api-client";

interface ExhibitorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exhibitor: Exhibitor | null;
}

export function ExhibitorDetailsModal({
  isOpen,
  onClose,
  exhibitor,
}: ExhibitorDetailsModalProps) {
  if (!isOpen || exhibitor === null) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-foreground">Exhibitor Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">Name</p>
            <p className="text-sm text-muted-foreground mt-0.5">{exhibitor.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Website</p>
            <p className="text-sm text-muted-foreground mt-0.5">{exhibitor.website ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Description</p>
            <p className="text-sm text-muted-foreground mt-0.5">{exhibitor.description ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Logo</p>
            {exhibitor.logoUrl ? (
              <img
                src={exhibitor.logoUrl}
                alt={`${exhibitor.name} logo`}
                className="mt-0.5 h-16 w-16 object-contain rounded"
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">No logo uploaded</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex p-6 border-t border-border sticky bottom-0 bg-white">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
