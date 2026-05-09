"use client";

import { useState, useEffect } from "react";
import { Plus, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eventAPI, brandingAPI, DEFAULT_EVENT_ID, type Event } from "@/lib/api-client";

type EventDetail = Event & { youtubeStreamingUrl?: string };

export default function GeneralInformationPage() {
  const [communityName, setCommunityName] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [copiedId, setCopiedId] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingFloorPlan, setIsUploadingFloorPlan] = useState(false);

  useEffect(() => {
    eventAPI.getDetail(DEFAULT_EVENT_ID)
      .then((res) => {
        if (res.success && res.data) {
          const event = res.data as EventDetail;
          setCommunityName(event.title ?? "");
          setYoutubeUrl(event.youtubeStreamingUrl ?? "");
          setCommunityId(event.id);
        } else {
          setError(res.error?.message ?? "Failed to load event data.");
        }
      })
      .catch(() => setError("Cannot connect to server. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(communityId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await eventAPI.update(DEFAULT_EVENT_ID, {
        title: communityName,
        ...(youtubeUrl !== undefined && { youtubeStreamingUrl: youtubeUrl } as Partial<EventDetail>),
      } as Partial<Event>);
      if (res.success) {
        setSuccessMsg("Changes saved successfully.");
      } else {
        setError(res.error?.message ?? "Failed to save changes.");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    uploadFn: (fd: FormData) => Promise<any>,
    setUploading: (v: boolean) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const fd = new FormData();
      fd.append("file", file);
      setUploadError(null);
      setUploading(true);
      try {
        const res = await uploadFn(fd);
        if (!res.success) {
          setUploadError(res.error?.message ?? "Failed to upload file.");
        }
      } catch {
        setUploadError("Cannot connect to server. Make sure the backend is running.");
      } finally {
        setUploading(false);
      }
    }
  };

  const UploadArea = ({
    label,
    file,
    onUpload,
    onClear,
    uploading,
  }: {
    label: string;
    file: File | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    uploading?: boolean;
  }) => (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 bg-secondary/30">
        {uploading ? (
          <p className="text-sm text-muted-foreground text-center">Uploading…</p>
        ) : file ? (
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
              value={loading ? "" : communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder={loading ? "…" : "Enter Community Name"}
              disabled={loading}
              className="mt-2 h-10"
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="text-sm font-medium text-foreground">
              YouTube Streaming URL
            </label>
            <Input
              value={loading ? "" : youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder={loading ? "…" : "Enter YouTube URL"}
              disabled={loading}
              className="mt-2 h-10"
            />
          </div>

          {/* Logo Upload */}
          <div className="lg:col-span-2">
            <UploadArea
              label="Logo"
              file={logoFile}
              uploading={isUploadingLogo}
              onUpload={(e) =>
                handleFileUpload(
                  e,
                  setLogoFile,
                  (fd) => brandingAPI.uploadLogo(DEFAULT_EVENT_ID, fd),
                  setIsUploadingLogo,
                )
              }
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
              uploading={isUploadingBanner}
              onUpload={(e) =>
                handleFileUpload(
                  e,
                  setBannerFile,
                  (fd) => brandingAPI.uploadBanner(DEFAULT_EVENT_ID, fd),
                  setIsUploadingBanner,
                )
              }
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
                  value={loading ? "…" : communityId}
                  readOnly
                  className="h-10 bg-muted text-foreground"
                />
                <Button
                  onClick={handleCopyId}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  disabled={loading}
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
          uploading={isUploadingFloorPlan}
          onUpload={(e) =>
            handleFileUpload(
              e,
              setFloorPlanFile,
              (fd) => brandingAPI.uploadFloorPlan(DEFAULT_EVENT_ID, fd),
              setIsUploadingFloorPlan,
            )
          }
          onClear={() => setFloorPlanFile(null)}
        />
      </div>

      {/* Save Button */}
      <div className="flex flex-col items-end gap-2">
        {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {successMsg && <p className="text-sm text-primary">{successMsg}</p>}
        <Button
          onClick={handleSave}
          disabled={loading || saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-8"
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
