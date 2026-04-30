"use client";

import { useState } from "react";
import { Search, Plus, Download, Filter } from "lucide-react";
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

interface Speaker {
  id: string;
  fullname: string;
  title: string;
  organization: string;
}

const MOCK_SPEAKERS: Speaker[] = [
  {
    id: "1",
    fullname: "ALICE JOHNSON",
    title: "General Pass",
    organization: "NITDA",
  },
  {
    id: "2",
    fullname: "Bob Smith",
    title: "General Pass",
    organization: "GOOGLE",
  },
  {
    id: "3",
    fullname: "Carol Williams",
    title: "General Pass",
    organization: "CBN",
  },
  {
    id: "4",
    fullname: "David Brown",
    title: "Student Pass",
    organization: "FUTURE MAP",
  },
  {
    id: "5",
    fullname: "Emma Davis",
    title: "VIP Pass",
    organization: "QOREBOX",
  },
];

export default function SpeakersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [speakers] = useState<Speaker[]>(MOCK_SPEAKERS);

  const filteredSpeakers = speakers.filter(
    (speaker) =>
      speaker.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.organization.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTitleBadgeColor = (title: string) => {
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
          onClick={() => setIsImportModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Speakers
        </Button>
      </div>

      {/* Table */}
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
            </tr>
          </thead>
          <tbody>
            {filteredSpeakers.map((speaker) => (
              <tr
                key={speaker.id}
                className="border-b border-border hover:bg-secondary/20 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {speaker.fullname}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTitleBadgeColor(speaker.title)}`}
                  >
                    {speaker.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {speaker.organization}
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

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(file: UploadedFile) => {
          console.log("Importing speakers file:", file);
        }}
        config={IMPORT_MODAL_CONFIGS.speakers}
      />
    </div>
  );
}
