"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Download, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ImportModal,
  IMPORT_MODAL_CONFIGS,
  UploadedFile,
} from "@/components/dashboard/import-modal";
import { CreateSpeakerModal } from "@/components/dashboard/create-speaker-modal";
import { EditSpeakerModal } from "@/components/dashboard/edit-speaker-modal";
import { speakersAPI, DEFAULT_EVENT_ID } from "@/lib/api-client";

interface Speaker {
  id: string;
  name: string;
  company?: string;
  bio?: string;
  photo?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  displayOrder?: number;
  isVisible?: boolean;
  sessions?: unknown[];
}

export default function SpeakersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fetchSpeakers = useCallback(() => {
    setLoading(true);
    setError(null);
    speakersAPI
      .getSpeakersByEvent(DEFAULT_EVENT_ID)
      .then((res) => {
        if (res.success && res.data) {
          setSpeakers(res.data);
        } else {
          setError(res.error?.message ?? "Failed to load speakers.");
        }
      })
      .catch(() =>
        setError("Cannot connect to server. Make sure the backend is running."),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  const handleImport = async (uploadedFile: UploadedFile): Promise<void> => {
    if (!uploadedFile.file.name.endsWith(".csv")) {
      setImportError("Only CSV files are supported for import.");
      return;
    }

    try {
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(uploadedFile.file);
      });

      const lines = text.split("\n").filter((l) => l.trim());
      const parsedSpeakers = lines
        .slice(1)
        .map((row) => {
          const cols = row.split(",");
          return {
            name: cols[0]?.trim() ?? "",
            title: cols[1]?.trim() ?? "",
            bio: cols[2]?.trim() ?? "",
          };
        })
        .filter((s) => s.name);

      const res = await speakersAPI.bulkCreateSpeakers(
        DEFAULT_EVENT_ID,
        parsedSpeakers,
      );
      if (res.success) {
        setIsImportModalOpen(false);
        setImportError(null);
        fetchSpeakers();
      } else {
        setImportError(res.error?.message ?? "Failed to import speakers.");
      }
    } catch {
      setImportError("Failed to read or parse the CSV file.");
    }
  };

  const handleDeleteSpeaker = async (speakerId: string) => {
    if (!window.confirm("Are you sure you want to delete this speaker?")) return;
    setDeleteError(null);
    try {
      const res = await speakersAPI.deleteSpeaker(DEFAULT_EVENT_ID, speakerId);
      if (res.success) {
        setSpeakers((prev) => prev.filter((s) => s.id !== speakerId));
      } else {
        setDeleteError(res.error?.message ?? "Failed to delete speaker.");
      }
    } catch {
      setDeleteError("Cannot connect to server. Make sure the backend is running.");
    }
  };

  const filteredSpeakers = speakers.filter(
    (speaker) =>
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (speaker.company ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTitleBadgeColor = (title: string | undefined) => {
    switch (title) {
      case "VIP Pass":
        return "bg-blue-100 text-blue-700";
      case "Student Pass":
        return "bg-blue-100 text-blue-700";
      case "General Pass":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-secondary text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Speakers</h1>
          <p className="text-muted-foreground mt-1">
            Allow people to plan their schedule, save time and keep them
            informed on the latest updates.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Speakers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <Button variant="outline" className="h-10">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>

        <Button variant="outline" className="h-10">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        <Button
          className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Speakers
        </Button>
      </div>

      {/* Page-level errors */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}

      {/* Content */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !error && speakers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No speakers yet.</p>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Fullname
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSpeakers.map((speaker) => (
                <tr
                  key={speaker.id}
                  className="border-b border-border hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {speaker.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTitleBadgeColor(undefined)}`}
                    >
                      —
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {speaker.company ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingSpeaker(speaker)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteSpeaker(speaker.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSpeakers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-muted-foreground">
                No speakers found matching your search
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit Speaker Modal */}
      <EditSpeakerModal
        isOpen={editingSpeaker !== null}
        onClose={() => setEditingSpeaker(null)}
        onSuccess={() => fetchSpeakers()}
        speaker={editingSpeaker}
      />

      {/* Create Speaker Modal */}
      <CreateSpeakerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchSpeakers()}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportError(null);
        }}
        onImport={handleImport}
        config={IMPORT_MODAL_CONFIGS.speakers}
        error={importError}
      />
    </div>
  );
}
