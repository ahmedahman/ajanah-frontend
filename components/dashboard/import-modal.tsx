"use client"

import { useState, useCallback } from "react"
import { X, FileSpreadsheet, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ImportModalConfig {
  title: string
  description: string
  importButtonText: string
  fileNamePrefix: string
  templateType: string
}

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: UploadedFile) => Promise<void>
  config: ImportModalConfig
  error?: string | null
}

export interface UploadedFile {
  name: string
  size: string
  progress: number
  file: File
}

// Cloud upload icon matching the design
function CloudUploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 32V20M24 20L19 25M24 20L29 25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 32H14C10.6863 32 8 29.3137 8 26C8 22.6863 10.6863 20 14 20C14.1216 20 14.2426 20.0028 14.3629 20.0083C15.2748 16.0734 18.7781 13 23 13C28.0393 13 32.1265 17.0294 32.2452 22.0439C35.4695 22.4488 38 25.2174 38 28.5714C38 32.1693 35.0899 35.0714 31.5 35.0714"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ImportModal({ isOpen, onClose, onImport, config, error }: ImportModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    const validExtensions = [".csv", ".xls", ".xlsx"]
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    )
    
    if (!validTypes.includes(file.type) && !hasValidExtension) {
      alert("Please upload a CSV or Excel file")
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setIsUploading(true)
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        setUploadedFile({
          name: file.name,
          size: formatFileSize(file.size),
          progress: 100,
          file: file,
        })
      }
    }, 100)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleImport = async () => {
    if (uploadedFile) {
      await onImport(uploadedFile)
    }
  }

  const handleClose = () => {
    onClose()
    setUploadedFile(null)
    setIsUploading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-2">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {config.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {config.description}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300 bg-white"
            )}
          >
            <input
              type="file"
              id="file-upload-modal"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="file-upload-modal" className="cursor-pointer block">
              <div className="flex flex-col items-center gap-3">
                <CloudUploadIcon className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    Drop your CSV or Excel file here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum file size: 10MB. Format must be .csv, .xls, or .xlsx
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Template download */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                const url = `${process.env.NEXT_PUBLIC_API_URL}/import/template/${config.templateType}`
                window.open(url, '_blank')
              }}
              className="text-sm text-primary hover:underline"
            >
              Download template
            </button>
          </div>

          {/* Uploaded file */}
          {uploadedFile && (
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="p-2 bg-white rounded-lg border border-gray-100">
                <FileSpreadsheet className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {uploadedFile.size} • {uploadedFile.progress}% Ready
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          )}

          {/* Upload progress indicator */}
          {isUploading && !uploadedFile && (
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <div className="p-2 bg-white rounded-lg border border-border">
                <FileSpreadsheet className="h-5 w-5 text-muted-foreground animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">
                  Uploading...
                </p>
                <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                  <div className="bg-primary h-1.5 rounded-full animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={handleClose}
              className="h-11 px-6 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!uploadedFile || isUploading}
              className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {config.importButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Pre-configured modal variants
export const IMPORT_MODAL_CONFIGS = {
  agenda: {
    title: "Import Agenda",
    description: "Upload your schedule file to populate your event calendar instantly.",
    importButtonText: "Import Agenda",
    fileNamePrefix: "agenda_template",
    templateType: "sessions",
  },
  exhibitors: {
    title: "Import Exhibitors",
    description: "Upload your existing CSV or Excel files to populate your exhibitors",
    importButtonText: "Import Exhibitors",
    fileNamePrefix: "exhibitors_template",
    templateType: "exhibitors",
  },
  speakers: {
    title: "Import Speakers",
    description: "Upload your speaker list to add them to your event.",
    importButtonText: "Import Speakers",
    fileNamePrefix: "speakers_template",
    templateType: "speakers",
  },
  attendees: {
    title: "Import Attendees",
    description: "Upload your attendee list to register them for the event.",
    importButtonText: "Import Attendees",
    fileNamePrefix: "attendees_template",
    templateType: "attendees",
  },
} as const

export type ImportModalType = keyof typeof IMPORT_MODAL_CONFIGS
