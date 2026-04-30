"use client"

import { useState } from "react"
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

interface Exhibitor {
  id: string
  logo: string
  name: string
  group: string
  groupColor: string
  type: string
  description: string
  website: string
}

const mockExhibitors: Exhibitor[] = [
  {
    id: "1",
    logo: "/api/placeholder/40/40",
    name: "Atlas Exhibits",
    group: "Core Tech",
    groupColor: "bg-teal-500",
    type: "Digital Art",
    description: "Pioneering interactive display modules...",
    website: "atlas.tech",
  },
  {
    id: "2",
    logo: "/api/placeholder/40/40",
    name: "Quantum Bio",
    group: "Biology",
    groupColor: "bg-green-500",
    type: "Laboratory",
    description: "Visualizing microscopic structures...",
    website: "qbio.labs",
  },
  {
    id: "3",
    logo: "/api/placeholder/40/40",
    name: "Nexus Media",
    group: "Core Tech",
    groupColor: "bg-teal-500",
    type: "Audio Visual",
    description: "High-fidelity spatial sound installations...",
    website: "nexus.media",
  },
  {
    id: "4",
    logo: "/api/placeholder/40/40",
    name: "Solar Systems",
    group: "Energy",
    groupColor: "bg-gray-500",
    type: "Hardware",
    description: "Sustainable energy solutions integrated",
    website: "solarsys.co",
  },
  {
    id: "5",
    logo: "/api/placeholder/40/40",
    name: "Heritage Ltd.",
    group: "History",
    groupColor: "bg-amber-500",
    type: "Consultancy",
    description: "Preserving physical artifacts with non-...",
    website: "heritage.museum",
  },
]

export default function ExhibitorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const totalItems = 24
  const itemsPerPage = 5
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const filteredData = mockExhibitors.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <Button className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create Exhibitors
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === filteredData.length}
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
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${item.groupColor} text-white border-0`}
                  >
                    {item.group}
                  </Badge>
                </TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {item.description}
                </TableCell>
                <TableCell>
                  <a
                    href={`https://${item.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {item.website}
                  </a>
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
            Showing 1 to {filteredData.length} of {totalItems} exhibitors
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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(file: UploadedFile) => {
          // API integration point for importing exhibitors
          console.log("Importing exhibitors file:", file)
        }}
        config={IMPORT_MODAL_CONFIGS.exhibitors}
      />
    </div>
  )
}
