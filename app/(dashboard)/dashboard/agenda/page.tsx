"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

interface AgendaItem {
  id: string;
  title: string;
  ticketType?: string;
  description: "Checked In" | "Not Checked In";
  date: string;
  type: string;
  venue: string;
}

const mockAgendaData: AgendaItem[] = [
  {
    id: "1",
    title: "ALICE JOHNSON",
    description: "Checked In",
    date: "10/31/25",
    type: "FREE",
    venue: "...",
  },
  {
    id: "2",
    title: "Bob Smith",
    ticketType: "General Pass",
    description: "Checked In",
    date: "10/31/25",
    type: "$20",
    venue: "...",
  },
  {
    id: "3",
    title: "Carol Williams",
    ticketType: "General Pass",
    description: "Not Checked In",
    date: "10/31/25",
    type: "$20",
    venue: "...",
  },
  {
    id: "4",
    title: "David Brown",
    ticketType: "Student Pass",
    description: "Checked In",
    date: "10/31/25",
    type: "FREE",
    venue: "...",
  },
  {
    id: "5",
    title: "Emma Davis",
    ticketType: "VIP Pass",
    description: "Not Checked In",
    date: "10/31/25",
    type: "$50",
    venue: "...",
  },
];

export default function AgendaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = 24;
  const itemsPerPage = 5;

  const filteredData = mockAgendaData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTicketBadgeStyle = (ticketType: string) => {
    switch (ticketType) {
      case "General Pass":
        return "bg-primary/10 text-primary border-primary/20";
      case "Student Pass":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "VIP Pass":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-secondary text-secondary-foreground";
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
            <Button className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Create Agenda
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="min-w-48">
                <button className="flex items-center gap-1 hover:text-foreground">
                  Full Name
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="min-w-40">
                <button className="flex items-center gap-1 hover:text-foreground">
                  Ticket Type
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="min-w-40">
                <button className="flex items-center gap-1 hover:text-foreground">
                  Check-In Status
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="min-w-32">
                <button className="flex items-center gap-1 hover:text-foreground">
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="min-w-24">
                <button className="flex items-center gap-1 hover:text-foreground">
                  Amount
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="font-medium">{item.title}</span>
                </TableCell>
                <TableCell>
                  {item.ticketType && (
                    <Badge
                      variant="outline"
                      className={getTicketBadgeStyle(item.ticketType)}
                    >
                      {item.ticketType}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.description === "Checked In"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={
                        item.description === "Checked In"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {item.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
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
            Showing {filteredData.length} of {totalItems} items
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
              disabled={currentPage * itemsPerPage >= totalItems}
              onClick={() => setCurrentPage((p) => p + 1)}
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
          // API integration point for importing agenda
          console.log("Importing agenda file:", file);
        }}
        config={IMPORT_MODAL_CONFIGS.agenda}
      />
    </div>
  );
}
