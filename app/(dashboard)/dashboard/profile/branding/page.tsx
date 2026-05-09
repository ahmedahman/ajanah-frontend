"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Crop, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { brandingAPI, DEFAULT_EVENT_ID } from "@/lib/api-client"

interface ColorSetting {
  label: string
  value: string
  description: string
  enabled: boolean
}

export default function BrandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [colors, setColors] = useState<Record<string, ColorSetting>>({
    navigation: {
      label: "Navigation",
      value: "#000000",
      description: "Colour of the menu (navigation bar)",
      enabled: false,
    },
    mainActions: {
      label: "Main actions",
      value: "#01A138",
      description: 'Colour of the major buttons. Tip: set the same colour as "My event" button.',
      enabled: true,
    },
    text: {
      label: "Text",
      value: "#000000",
      description: "Colour of all written content.",
      enabled: false,
    },
  })

  const [backgroundColors, setBackgroundColors] = useState({
    contentBlocks: {
      label: "Content blocks background (desktop only)",
      value: "#FFFFFF",
      enabled: false,
    },
    background: {
      label: "Background",
      value: "#000000",
      enabled: false,
    },
  })

  const [pageLoading, setPageLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    brandingAPI
      .getBranding(DEFAULT_EVENT_ID)
      .then((res) => {
        if (res.success && res.data) {
          const data = res.data
          if (data.appearanceMode === "LIGHT" || data.appearanceMode === "DARK") {
            setTheme(data.appearanceMode.toLowerCase() as "light" | "dark")
          }
          if ((data as any).mainActionsColor) {
            setColors((prev) => ({
              ...prev,
              mainActions: { ...prev.mainActions, value: (data as any).mainActionsColor },
            }))
          }
          if ((data as any).textColor) {
            setColors((prev) => ({
              ...prev,
              text: { ...prev.text, value: (data as any).textColor },
            }))
          }
        } else {
          setFetchError(res.error?.message ?? "Failed to load branding.")
        }
      })
      .catch(() =>
        setFetchError("Cannot connect to server. Make sure the backend is running."),
      )
      .finally(() => setPageLoading(false))
  }, [])

  const handleColorChange = (key: string, value: string) => {
    const sanitised = value === "" || value.startsWith("#") ? value : `#${value}`
    setColors(prev => ({
      ...prev,
      [key]: { ...prev[key], value: sanitised }
    }))
  }

  const handleColorToggle = (key: string, enabled: boolean) => {
    setColors(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled }
    }))
  }

  const handleBackgroundColorChange = (key: string, value: string) => {
    setBackgroundColors(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }))
  }

  const handleBackgroundColorToggle = (key: string, enabled: boolean) => {
    setBackgroundColors(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled }
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append("file", file)
      brandingAPI.uploadBackground(DEFAULT_EVENT_ID, formData).then((res) => {
        if (!res.success) {
          setSaveError(res.error?.message ?? "Failed to upload background image.")
        }
      }).catch(() => {
        setSaveError("Cannot connect to server. Make sure the backend is running.")
      })
    }
  }

  const handleDeleteImage = () => {
    setBackgroundImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const HEX_RE = /^#[A-Fa-f0-9]{6}$/

  const handleSave = async () => {
    if (!HEX_RE.test(colors.mainActions.value) || !HEX_RE.test(colors.text.value)) {
      setSaveError("One or more colour values are invalid. Use the format #RRGGBB (e.g. #01A138).")
      return
    }
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      const payload = {
        appearanceMode: theme.toUpperCase(),
        mainActionsColor: colors.mainActions.value,
        textColor: colors.text.value,
      }
      console.log("[branding] PATCH payload:", payload)
      const res = await brandingAPI.updateBranding(DEFAULT_EVENT_ID, payload as any)
      if (res.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setSaveError(res.error?.message ?? "Failed to save branding.")
      }
    } catch {
      setSaveError("Cannot connect to server. Make sure the backend is running.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Branding</h1>
        <p className="text-primary mt-1">Customise your event</p>
      </div>

      {/* Load states */}
      {pageLoading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}
      {fetchError && (
        <p className="text-sm text-destructive">{fetchError}</p>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-border shadow-sm">
        {/* Appearance Section */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Description */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
              <p className="text-sm text-primary mt-1">
                Customise the look and feel of your event on mobile and web apps
              </p>
            </div>

            {/* Right Column - Theme Cards */}
            <div className="lg:col-span-8">
              <div className="flex gap-4">
                {/* Light Theme Card */}
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex-1 rounded-xl border-2 overflow-hidden transition-all",
                    theme === "light"
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="bg-gray-100 px-4 py-3 text-left">
                    <span className="text-sm font-medium text-foreground">Light</span>
                  </div>
                  <div className="bg-white p-6 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-muted">
                      <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                    </div>
                    <p className="font-semibold text-foreground text-sm">Nazih Ibrahim</p>
                    <p className="text-xs text-primary">CTO, Salesforce</p>
                    <p className="text-xs text-primary">TechAfrica Solutions</p>
                  </div>
                </button>

                {/* Dark Theme Card */}
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex-1 rounded-xl border-2 overflow-hidden transition-all",
                    theme === "dark"
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="bg-[#1B4332] px-4 py-3 text-left">
                    <span className="text-sm font-medium text-white">Dark</span>
                  </div>
                  <div className="bg-[#1B4332] p-6 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-white/20">
                      <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                    </div>
                    <p className="font-semibold text-white text-sm">Nazih Ibrahim</p>
                    <p className="text-xs text-primary-light">CTO, Salesforce</p>
                    <p className="text-xs text-primary-light">TechAfrica Solutions</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Description */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-semibold text-foreground">Colours</h2>
              <p className="text-sm text-primary mt-1">
                Choose your navigation, actions and text colors
              </p>
            </div>

            {/* Right Column - Color Inputs */}
            <div className="lg:col-span-8 space-y-6">
              {Object.entries(colors).map(([key, color]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    {color.label}
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={color.value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="pr-12 font-mono text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Switch
                        checked={color.enabled}
                        onCheckedChange={(checked) => handleColorToggle(key, checked)}
                        className={cn(
                          color.enabled && "data-[state=checked]:bg-primary"
                        )}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-primary">{color.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Description */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-semibold text-foreground">Background</h2>
              <p className="text-sm text-primary mt-1">
                Set your background colour or upload a background image. This would appear on all pages, including the In-App registration form.
              </p>
            </div>

            {/* Right Column - Background Settings */}
            <div className="lg:col-span-8 space-y-6">
              {/* Background Color Inputs */}
              {Object.entries(backgroundColors).map(([key, color]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    {color.label}
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={color.value}
                      onChange={(e) => handleBackgroundColorChange(key, e.target.value)}
                      className="pr-12 font-mono text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Switch
                        checked={color.enabled}
                        onCheckedChange={(checked) => handleBackgroundColorToggle(key, checked)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Background Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Background image
                </Label>
                <div
                  className={cn(
                    "border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors",
                    "hover:border-primary/50 hover:bg-muted/30 cursor-pointer",
                    backgroundImage && "border-solid border-primary/30 bg-primary/5"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {backgroundImage ? (
                    <div className="space-y-4">
                      <img
                        src={backgroundImage}
                        alt="Background preview"
                        className="max-h-40 mx-auto rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Upload event&apos;s background image here
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Actions */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    disabled={!backgroundImage}
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    Crop
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDeleteImage}
                    disabled={!backgroundImage}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col items-end gap-2">
        {saveSuccess && (
          <p className="text-sm text-primary">Saved successfully.</p>
        )}
        {saveError && (
          <p className="text-sm text-destructive">{saveError}</p>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
        >
          {isSaving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
