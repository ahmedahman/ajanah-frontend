"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SponsorLogoModal } from "@/components/dashboard/sponsor-logo-modal";

interface Sponsor {
  id: string;
  type: "gold" | "partner";
  title: string;
  logoUrl?: string;
  redirectLink?: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([
    {
      id: "1",
      type: "gold",
      title: "Gold Sponsor",
      logoUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NITDA_logo-example.png",
    },
    {
      id: "2",
      type: "partner",
      title: "Partners/Sponsor",
      logoUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NITDA_logo-example.png",
    },
  ]);
  const [editingSponsors, setEditingSponsors] = useState<{
    [key: string]: boolean;
  }>({});
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newRedirection, setNewRedirection] = useState("no-links");
  const [selectedLogoModal, setSelectedLogoModal] = useState<string | null>(
    null,
  );

  const handleEditLogo = (sponsorId: string) => {
    setSelectedLogoModal(sponsorId);
  };

  const handleSaveLogoModal = (
    sponsorId: string,
    data: { title: string; logoUrl?: string; redirectLink?: string },
  ) => {
    setSponsors((prev) =>
      prev.map((sponsor) =>
        sponsor.id === sponsorId
          ? {
              ...sponsor,
              title: data.title,
              logoUrl: data.logoUrl,
              redirectLink: data.redirectLink,
            }
          : sponsor,
      ),
    );
  };

  const handleDeleteSponsor = (sponsorId: string) => {
    setSponsors((prev) => prev.filter((s) => s.id !== sponsorId));
  };

  const handleAddSponsor = () => {
    if (newSectionTitle.trim()) {
      const newSponsor: Sponsor = {
        id: Date.now().toString(),
        type: "partner",
        title: newSectionTitle,
        redirectLink: newRedirection,
      };
      setSponsors((prev) => [...prev, newSponsor]);
      setNewSectionTitle("");
      setNewRedirection("no-links");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sponsors</h1>
        <p className="text-muted-foreground mt-1">
          Improve sponsor visibility within the platform. Sponsors and ads are
          great ways to monetize.
        </p>
      </div>

      {/* Existing Sponsors */}
      <div className="space-y-4">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="border border-border rounded-lg p-6 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {sponsor.title}
              </h3>
              <button
                onClick={() => handleDeleteSponsor(sponsor.id)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-6">
              {/* Logo Display Area */}
              <div className="flex-1">
                <div className="border-2 border-dashed border-border rounded-lg p-6 bg-secondary/30 flex items-center justify-center min-h-48">
                  {sponsor.logoUrl ? (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.title}
                        className="max-h-40 max-w-full object-contain"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditLogo(sponsor.id)}
                          variant="outline"
                          size="sm"
                          className="h-9"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Logo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 text-destructive border-destructive/20 hover:bg-destructive/10"
                          onClick={() => {
                            setSponsors((prev) =>
                              prev.map((s) =>
                                s.id === sponsor.id
                                  ? { ...s, logoUrl: undefined }
                                  : s,
                              ),
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditLogo(sponsor.id)}
                      className="text-center cursor-pointer hover:opacity-75 transition-opacity w-full"
                    >
                      <svg
                        className="h-12 w-12 text-primary mx-auto mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Upload Logo
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        PNG, JPG, SVG (Max 10MB)
                      </p>
                      <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-9"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLogo(sponsor.id);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Add Sponsor Section */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">
          Add a Sponsor section
        </h2>

        <div className="space-y-4 border border-border rounded-lg p-6 bg-white">
          {/* Section Title */}
          <div>
            <label className="text-sm font-medium text-foreground">
              *Section Title
            </label>
            <Input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="e.g. Platinum Sponsor, Silver Partner"
              className="mt-2 h-10"
            />
          </div>

          {/* Image Upload Placeholder */}
          <div>
            <label className="text-sm font-medium text-foreground">
              *Image
            </label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 bg-secondary/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors">
              <svg
                className="h-12 w-12 text-primary mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium text-foreground">
                Upload sponsor logo
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, SVG (Max 10MB)
              </p>
            </div>
          </div>

          {/* Redirection */}
          <div>
            <label className="text-sm font-medium text-foreground">
              *Redirections
            </label>
            <Select value={newRedirection} onValueChange={setNewRedirection}>
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

          {/* Add Button */}
          <div className="pt-4">
            <Button
              onClick={handleAddSponsor}
              disabled={!newSectionTitle.trim()}
              className="w-full bg-muted hover:bg-muted text-foreground font-medium h-10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add +
            </Button>
          </div>
        </div>
      </div>

      {/* Sponsor Logo Modal */}
      {selectedLogoModal && (
        <SponsorLogoModal
          isOpen={!!selectedLogoModal}
          onClose={() => setSelectedLogoModal(null)}
          sponsorType={
            sponsors.find((s) => s.id === selectedLogoModal)?.type || "partner"
          }
          initialData={sponsors.find((s) => s.id === selectedLogoModal)}
          onSave={(data) => {
            handleSaveLogoModal(selectedLogoModal, data);
            setSelectedLogoModal(null);
          }}
        />
      )}
    </div>
  );
}
