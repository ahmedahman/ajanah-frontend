"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ImportModal, IMPORT_MODAL_CONFIGS, UploadedFile } from "@/components/dashboard/import-modal"
import { CreateExhibitorModal } from "@/components/dashboard/create-exhibitor-modal"
import { exhibitorsAPI, DEFAULT_EVENT_ID, type Exhibitor } from "@/lib/api-client"

export default function ExhibitorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const itemsPerPage = 5

  const fetchExhibitors = useCallback(() => {
    setLoading(true)
    setError(null)
    exhibitorsAPI
      .getExhibitors(DEFAULT_EVENT_ID)
      .then((res) => {
        if (res.success && res.data) {
          setExhibitors(res.data)
        } else {
          setError(res.error?.message ?? "Failed to load exhibitors.")
        }
      })
      .catch(() => setError("Cannot connect to server. Make sure the backend is running."))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchExhibitors()
  }, [fetchExhibitors])

  const filteredData = exhibitors.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleDelete = async (exhibitorId: string) => {
    if (!window.confirm("Are you sure you want to delete this? This cannot be undone.")) return
    setDeleteError(null)
    try {
      const res = await exhibitorsAPI.deleteExhibitor(exhibitorId)
      if (res.success) {
        setExhibitors((prev) => prev.filter((e) => e.id !== exhibitorId))
        setSelectedItems((prev) => prev.filter((id) => id !== exhibitorId))
      } else {
        setDeleteError(res.error?.message ?? "Failed to delete exhibitor.")
      }
    } catch {
      setDeleteError("Cannot connect to server. Make sure the backend is running.")
    }
  }

  const handleImport = async (uploadedFile: UploadedFile): Promise<void> => {
    if (!uploadedFile.file.name.endsWith(".csv")) {
      setImportError("Only CSV files are supported for import.")
      return
    }
    try {
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsText(uploadedFile.file)
      })
      const lines = text.split("\n").filter((l) => l.trim())
      const parsedExhibitors = lines
        .slice(1)
        .map((row) => {
          const cols = row.split(",")
          return {
            name: cols[0]?.trim() ?? "",
            website: cols[1]?.trim() ?? "",
            description: cols[2]?.trim() ?? "",
          }
        })
        .filter((e) => e.name)
      const res = await exhibitorsAPI.bulkCreateExhibitors(DEFAULT_EVENT_ID, parsedExhibitors)
      if (res.success) {
        setIsImportModalOpen(false)
        setImportError(null)
        fetchExhibitors()
      } else {
        setImportError(res.error?.message ?? "Failed to import exhibitors.")
      }
    } catch {
      setImportError("Failed to read or parse the CSV file.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Exhibitors</h1>
        <p className="text-muted-foreground mt-1">
          Manage all active and pending curator profiles within the Technical Exhibition system.
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
              placeholder="Search Exhibitors"
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
              <Plus className="h-4 w-4 mr-2" />
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
              Create Exhibitors
            </Button>
          </div>
        </div>

        {/* Delete error */}
        {deleteError && <p className="text-sm text-destructive px-4 pt-3">{deleteError}</p>}

        {/* Table / states */}
        {loading ? (
          <p className="text-sm text-muted-foreground p-4">Loading…</p>
        ) : error ? (
          <p className="text-sm text-destructive p-4">{error}</p>
        ) : exhibitors.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">No exhibitors yet.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-16">LOGO</TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>GROUP</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead>DESCRIPTION</TableHead>
                  <TableHead>WEBSITE</TableHead>
                  <TableHead className="w-16">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleSelectItem(item.id)}
                        aria-label={`Select ${item.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-muted-foreground">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {item.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      {item.website ? (
                        <a
                          href={`https://${item.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {item.website}
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
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
                Showing 1 to {filteredData.length} of {exhibitors.length} exhibitors
              </p>
              <div className="flex items-center gap-1">
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
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Exhibitor Modal */}
      <CreateExhibitorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchExhibitors()}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false)
          setImportError(null)
        }}
        onImport={handleImport}
        config={IMPORT_MODAL_CONFIGS.exhibitors}
        error={importError}
      />
    </div>
  )
}
