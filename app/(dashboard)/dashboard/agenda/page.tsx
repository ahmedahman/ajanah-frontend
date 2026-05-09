"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { agendaAPI, DEFAULT_EVENT_ID } from "@/lib/api-client";
import { CreateSessionModal } from "@/components/dashboard/create-session-modal";
import { EditSessionModal } from "@/components/dashboard/edit-session-modal";

interface AgendaSession {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  session_date?: string;
  room?: string;
  location_label?: string;
  session_type?: string;
  capacity?: number;
  speakers?: unknown[];
  is_bookmarked?: boolean;
  day?: string;
}

interface AgendaGroup {
  day: string;
  sessions: AgendaSession[];
}

export default function AgendaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<AgendaSession | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessions, setSessions] = useState<AgendaSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const itemsPerPage = 5;

  const fetchSessions = useCallback(() => {
    setLoading(true);
    setError(null);
    agendaAPI
      .getAgenda(DEFAULT_EVENT_ID)
      .then((res) => {
        if (res.success && res.data) {
          const groups = res.data as unknown as AgendaGroup[];
          const flat = groups.flatMap((group) =>
            group.sessions.map((s) => ({ ...s, day: group.day })),
          );
          setSessions(flat);
        } else {
          setError(res.error?.message ?? "Failed to load sessions.");
        }
      })
      .catch(() =>
        setError("Cannot connect to server. Make sure the backend is running."),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filteredData = sessions.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
      const parsedSessions = lines
        .slice(1)
        .map((row) => {
          const cols = row.split(",");
          return {
            title: cols[0]?.trim() ?? "",
            day: cols[1]?.trim() ? Number(cols[1].trim()) : undefined,
            startTime: cols[2]?.trim() ?? "",
            endTime: cols[3]?.trim() ?? "",
            location: cols[4]?.trim() ?? "",
            eventId: DEFAULT_EVENT_ID,
          };
        })
        .filter((s) => s.title);
      const res = await agendaAPI.bulkCreateSessions(parsedSessions);
      if (res.success) {
        setIsImportModalOpen(false);
        setImportError(null);
        fetchSessions();
      } else {
        setImportError(res.error?.message ?? "Failed to import sessions.");
      }
    } catch {
      setImportError("Failed to read or parse the CSV file.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Agenda Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Allow people to plan their schedule, save time and keep them informed
          on the latest updates.
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-lg border border-border">
        {/* Toolbar */}
        <div className="p-4 flex items-center justify-between gap-4 border-b border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Agenda"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-white border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10">
              <Plus className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="h-10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              className="h-10"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Agenda
            </Button>
          </div>
        </div>

        {/* Table / states */}
        {loading ? (
          <p className="text-sm text-muted-foreground p-4">Loading…</p>
        ) : error ? (
          <p className="text-sm text-destructive p-4">{error}</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">No sessions yet.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="min-w-48">Title</TableHead>
                  <TableHead className="min-w-16">Day</TableHead>
                  <TableHead className="min-w-32">Start Time</TableHead>
                  <TableHead className="min-w-32">End Time</TableHead>
                  <TableHead className="min-w-40">Location</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="font-medium">{item.title}</span>
                    </TableCell>
                    <TableCell>{item.day ?? "—"}</TableCell>
                    <TableCell>
                      {item.start_time
                        ? new Date(item.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {item.end_time
                        ? new Date(item.end_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell>{item.location_label ?? "—"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingSession(item)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 flex items-center justify-between border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {sessions.length} items
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <span className="text-sm font-medium px-2">{currentPage}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage >= totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Session Modal */}
      <EditSessionModal
        isOpen={editingSession !== null}
        onClose={() => setEditingSession(null)}
        onSuccess={() => fetchSessions()}
        session={editingSession}
      />

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchSessions()}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportError(null);
        }}
        onImport={handleImport}
        config={IMPORT_MODAL_CONFIGS.agenda}
        error={importError}
      />
    </div>
  );
}
