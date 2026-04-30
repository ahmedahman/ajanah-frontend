"use client";

import { useState } from "react";
import { Plus, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GeneralInformationPage() {
  const [communityName, setCommunityName] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [communityId, setCommunityId] = useState(
    "CMTY_" + Math.random().toString(36).substr(2, 9),
  );
  const [copiedId, setCopiedId] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);

  const handleCopyId = () => {
    navigator.clipboard.writeText(communityId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const UploadArea = ({
    label,
    file,
    onUpload,
    onClear,
  }: {
    label: string;
    file: File | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
  }) => (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 bg-secondary/30">
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={onClear}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm font-medium text-foreground">
              Upload {label}
            </span>
            <span className="text-xs text-muted-foreground">
              PNG, JPG, SVG (Max 10MB)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            General Information
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and Customize your events
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10">
          <Plus className="h-4 w-4 mr-2" />
          Add an Event
        </Button>
      </div>

      {/* Basic Information Section */}
      <div className="border border-border rounded-lg p-8 bg-white space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Basic Information
          </h2>
          <p className="text-sm text-muted-foreground">
            For the community logo, we recommend using at least a 400x200px (2:1
            ratio) image, no larger than 1MB
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Community Name */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Community Name
            </label>
            <Input
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="Enter Community Name"
              className="mt-2 h-10"
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="text-sm font-medium text-foreground">
              YouTube Streaming URL
            </label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="mt-2 h-10"
            />
          </div>

          {/* Logo Upload */}
          <div className="lg:col-span-2">
            <UploadArea
              label="Logo"
              file={logoFile}
              onUpload={(e) => handleFileUpload(e, setLogoFile)}
              onClear={() => setLogoFile(null)}
            />
          </div>
        </div>
      </div>

      {/* Community Banner Section */}
      <div className="border border-border rounded-lg p-8 bg-white space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Community Banner
          </h2>
          <p className="text-sm text-muted-foreground">
            The banner is displayed on your Community home page above your event
            list. Make sure to personalise it with your information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Banner Upload */}
          <div className="lg:col-span-1">
            <UploadArea
              label="Banner"
              file={bannerFile}
              onUpload={(e) => handleFileUpload(e, setBannerFile)}
              onClear={() => setBannerFile(null)}
            />
          </div>

          {/* Community ID */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Community ID
              </h3>
              <div className="flex gap-2">
                <Input
                  value={communityId}
                  readOnly
                  className="h-10 bg-muted text-foreground"
                />
                <Button
                  onClick={handleCopyId}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                >
                  {copiedId ? (
                    <svg
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Plan Section */}
      <div className="border border-border rounded-lg p-8 bg-white space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Floor Plan</h2>
          <p className="text-sm text-muted-foreground">
            Upload image of event location floor plan
          </p>
        </div>

        <UploadArea
          label="Floor Plan"
          file={floorPlanFile}
          onUpload={(e) => handleFileUpload(e, setFloorPlanFile)}
          onClear={() => setFloorPlanFile(null)}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
