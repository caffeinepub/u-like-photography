import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  Camera,
  CheckCircle,
  Copy,
  CreditCard,
  Eye,
  Image as ImageIcon,
  Loader2,
  MoreHorizontal,
  Plus,
  Settings,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Photo,
  type PhotoEvent,
  useGetEvents,
  useGetPhotos,
} from "../hooks/useQueries";
import { ExternalBlob } from "../utils/ExternalBlob";

type Tab = "events" | "photos" | "clients" | "settings" | "subscription";

function usePhotographerProfile() {
  const stored = localStorage.getItem("ulike_user_profile");
  if (stored) {
    const profile = JSON.parse(stored) as { name: string; role: string };
    return profile;
  }
  return { name: "Photographer", role: "photographer" };
}

const EVENT_TYPES = [
  "wedding",
  "birthday",
  "graduation",
  "corporate",
  "special",
] as const;
const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Wedding",
  birthday: "Birthday",
  graduation: "Graduation",
  corporate: "Corporate",
  special: "Special Event",
};

export default function PhotographerDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const profile = usePhotographerProfile();
  const photographerId =
    identity?.getPrincipal().toString() || "demo-photographer";

  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { data: events = [], refetch: refetchEvents } =
    useGetEvents(photographerId);

  if (!identity && !localStorage.getItem("ulike_user_profile")) {
    navigate({ to: "/auth", search: { role: "" } });
    return null;
  }

  const navItems: { id: Tab; icon: typeof Camera; label: string }[] = [
    { id: "events", icon: Calendar, label: "Events" },
    { id: "photos", icon: ImageIcon, label: "Photos" },
    { id: "clients", icon: Users, label: "Clients" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "subscription", icon: CreditCard, label: "Subscription" },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 sm:w-60 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border hidden sm:block">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Camera className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-sidebar-foreground truncate">
                {profile.name}
              </div>
              <div className="text-xs text-primary capitalize">
                {profile.role}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                activeTab === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-6">
          {activeTab === "events" && (
            <EventsTab
              photographerId={photographerId}
              events={events}
              onRefetch={refetchEvents}
              onSelectEvent={(id) => {
                setSelectedEventId(id);
                setActiveTab("photos");
              }}
            />
          )}
          {activeTab === "photos" && (
            <PhotosTab
              photographerId={photographerId}
              events={events}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
            />
          )}
          {activeTab === "clients" && <ClientsTab events={events} />}
          {activeTab === "settings" && <SettingsTab profile={profile} />}
          {activeTab === "subscription" && <SubscriptionTab />}
        </div>
      </main>
    </div>
  );
}

// ===== EVENTS TAB =====
function EventsTab({
  photographerId,
  events,
  onRefetch,
  onSelectEvent,
}: {
  photographerId: string;
  events: PhotoEvent[];
  onRefetch: () => void;
  onSelectEvent: (id: string) => void;
}) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    type: "wedding" as PhotoEvent["type"],
  });

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.date) {
      toast.error("Please fill in all fields");
      return;
    }
    setCreating(true);
    try {
      const existing = localStorage.getItem(`ulike_events_${photographerId}`);
      const allEvents: PhotoEvent[] = existing ? JSON.parse(existing) : [];

      const newEvent: PhotoEvent = {
        id: `event-${Date.now()}`,
        name: formData.name.trim(),
        date: formData.date,
        type: formData.type,
        photoCount: 0,
        clientCount: 0,
        accessCode: formData.name
          .split(" ")
          .map((w) => w.toUpperCase().slice(0, 3))
          .join("")
          .slice(0, 10),
        photographerId,
      };

      allEvents.push(newEvent);
      localStorage.setItem(
        `ulike_events_${photographerId}`,
        JSON.stringify(allEvents),
      );
      toast.success("Event created successfully!");
      onRefetch();
      setShowCreateDialog(false);
      setFormData({ name: "", date: "", type: "wedding" });
    } catch {
      toast.error("Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Access code copied!");
  };

  const handleDelete = (eventId: string) => {
    const existing = localStorage.getItem(`ulike_events_${photographerId}`);
    if (existing) {
      const allEvents = (JSON.parse(existing) as PhotoEvent[]).filter(
        (e) => e.id !== eventId,
      );
      localStorage.setItem(
        `ulike_events_${photographerId}`,
        JSON.stringify(allEvents),
      );
      onRefetch();
      toast.success("Event deleted");
    }
  };

  const typeColors: Record<string, string> = {
    wedding: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    birthday: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    graduation: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    corporate: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    special: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Events
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-foreground">
                Create New Event
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-foreground mb-2 block">Event Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Sarah & James Wedding"
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Event Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, date: e.target.value }))
                  }
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-foreground mb-2 block">Event Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData((p) => ({
                      ...p,
                      type: v as PhotoEvent["type"],
                    }))
                  }
                >
                  <SelectTrigger className="bg-secondary/50 border-border focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-foreground">
                        {EVENT_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="w-full bg-primary text-primary-foreground"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="luxury-card overflow-hidden group"
          >
            {/* Cover Photo */}
            <div className="relative h-40 bg-secondary overflow-hidden">
              {event.coverPhoto ? (
                <img
                  src={event.coverPhoto}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute top-3 left-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded border font-medium ${typeColors[event.type]}`}
                >
                  {EVENT_TYPE_LABELS[event.type]}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 bg-background/60 hover:bg-background/80"
                    >
                      <MoreHorizontal className="w-4 h-4 text-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border">
                    <DropdownMenuItem
                      onClick={() => onSelectEvent(event.id)}
                      className="text-foreground hover:bg-secondary cursor-pointer gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Photos
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyCode(event.accessCode)}
                      className="text-foreground hover:bg-secondary cursor-pointer gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Access Code
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(event.id)}
                      className="text-destructive hover:bg-destructive/10 cursor-pointer gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-display font-semibold text-foreground text-sm mb-1 truncate">
                {event.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-4 text-xs">
                  <span className="text-primary">
                    <span className="font-bold">{event.photoCount}</span> photos
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-bold text-foreground">
                      {event.clientCount}
                    </span>{" "}
                    clients
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 px-2 py-1 rounded cursor-pointer hover:bg-secondary"
                  onClick={() => handleCopyCode(event.accessCode)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCopyCode(event.accessCode);
                  }}
                >
                  <span className="font-mono">{event.accessCode}</span>
                  <Copy className="w-3 h-3" />
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelectEvent(event.id)}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10 text-xs h-7 px-3"
                >
                  View Photos
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {events.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No events yet
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first event to start uploading photos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== PHOTOS TAB =====
function PhotosTab({
  photographerId,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  photographerId: string;
  events: PhotoEvent[];
  selectedEventId: string | null;
  onSelectEvent: (id: string | null) => void;
}) {
  const currentEventId = selectedEventId || events[0]?.id || "";
  const { data: photos = [], refetch: refetchPhotos } =
    useGetPhotos(currentEventId);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tagDialogPhoto, setTagDialogPhoto] = useState<Photo | null>(null);
  const [tagName, setTagName] = useState("");
  const [tagEmail, setTagEmail] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || !currentEventId) return;

      setUploading(true);
      setUploadProgress(0);

      try {
        const uploadedPhotos: Photo[] = [];
        const total = files.length;

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const bytes = new Uint8Array(await file.arrayBuffer());
          const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
            (pct) => {
              setUploadProgress(Math.round((i / total) * 100 + pct / total));
            },
          );

          try {
            const url = blob.getDirectURL();
            uploadedPhotos.push({
              id: `photo-${Date.now()}-${i}`,
              eventId: currentEventId,
              url,
              thumbnailUrl: url,
              taggedClients: [],
              uploadedAt: new Date().toISOString(),
            });
          } catch {
            // If upload fails (e.g., no backend), create object URL for demo
            const objectUrl = URL.createObjectURL(file);
            uploadedPhotos.push({
              id: `photo-${Date.now()}-${i}`,
              eventId: currentEventId,
              url: objectUrl,
              thumbnailUrl: objectUrl,
              taggedClients: [],
              uploadedAt: new Date().toISOString(),
            });
          }

          setUploadProgress(Math.round(((i + 1) / total) * 100));
        }

        // Save to localStorage
        const existing = localStorage.getItem(`ulike_photos_${currentEventId}`);
        const allPhotos: Photo[] = existing ? JSON.parse(existing) : [];
        const updated = [...allPhotos, ...uploadedPhotos];
        localStorage.setItem(
          `ulike_photos_${currentEventId}`,
          JSON.stringify(updated),
        );

        // Update event photo count
        const eventsData = localStorage.getItem(
          `ulike_events_${photographerId}`,
        );
        if (eventsData) {
          const allEvents: PhotoEvent[] = JSON.parse(eventsData);
          const idx = allEvents.findIndex((e) => e.id === currentEventId);
          if (idx >= 0) {
            allEvents[idx].photoCount = updated.length;
            localStorage.setItem(
              `ulike_events_${photographerId}`,
              JSON.stringify(allEvents),
            );
          }
        }

        await refetchPhotos();
        toast.success(
          `${files.length} photo${files.length > 1 ? "s" : ""} uploaded!`,
        );
      } catch {
        toast.error("Upload failed. Please try again.");
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [currentEventId, photographerId, refetchPhotos],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleTagSave = () => {
    if (!tagDialogPhoto || !tagName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const existing = localStorage.getItem(`ulike_photos_${currentEventId}`);
    const allPhotos: Photo[] = existing ? JSON.parse(existing) : [];
    const idx = allPhotos.findIndex((p) => p.id === tagDialogPhoto.id);
    if (idx >= 0) {
      allPhotos[idx].taggedClients.push({
        name: tagName.trim(),
        email: tagEmail.trim(),
      });
      localStorage.setItem(
        `ulike_photos_${currentEventId}`,
        JSON.stringify(allPhotos),
      );
    }

    setTagDialogPhoto(null);
    setTagName("");
    setTagEmail("");
    refetchPhotos();
    toast.success("Client tagged successfully!");
  };

  const currentEvent = events.find((e) => e.id === currentEventId);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Photos
          </h1>
          {currentEvent && (
            <p className="text-muted-foreground text-sm mt-1">
              {currentEvent.name} · {photos.length} photos
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {events.length > 0 && (
            <Select value={currentEventId} onValueChange={onSelectEvent}>
              <SelectTrigger className="bg-secondary/50 border-border w-48 focus:border-primary">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {events.map((e) => (
                  <SelectItem
                    key={e.id}
                    value={e.id}
                    className="text-foreground"
                  >
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !currentEventId}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Photos
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      {uploading && (
        <div className="mb-4 p-4 luxury-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground">Uploading photos...</span>
            <span className="text-sm text-primary">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      {/* Drag & Drop Zone */}
      <button
        type="button"
        className={`border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer w-full ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/40 hover:bg-secondary/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload
          className={`w-10 h-10 ${isDragging ? "text-primary" : "text-muted-foreground/50"}`}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Drop photos here" : "Drag & drop photos here"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click to browse files
          </p>
        </div>
      </button>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="relative aspect-square rounded-lg overflow-hidden luxury-card group"
          >
            <img
              src={photo.url}
              alt={`Gallery item ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-2 right-2">
                <Button
                  size="sm"
                  className="h-7 w-7 p-0 bg-primary/90 hover:bg-primary text-primary-foreground"
                  onClick={() => setTagDialogPhoto(photo)}
                >
                  <Tag className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            {photo.taggedClients.length > 0 && (
              <div className="absolute top-1.5 left-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/90 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary-foreground">
                    {photo.taggedClients.length}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {photos.length === 0 && !uploading && (
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {currentEventId
              ? "No photos uploaded yet"
              : "Select an event first"}
          </p>
        </div>
      )}

      {/* Tag Dialog */}
      <AnimatePresence>
        {tagDialogPhoto && (
          <Dialog
            open={!!tagDialogPhoto}
            onOpenChange={() => setTagDialogPhoto(null)}
          >
            <DialogContent className="bg-card border-border max-w-sm">
              <DialogHeader>
                <DialogTitle className="font-display text-foreground">
                  Tag a Client
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={tagDialogPhoto.url}
                    alt="Selected client tag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">
                    Client Name
                  </Label>
                  <Input
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div>
                  <Label className="text-foreground mb-2 block">
                    Email (optional)
                  </Label>
                  <Input
                    value={tagEmail}
                    onChange={(e) => setTagEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setTagDialogPhoto(null)}
                    className="flex-1 border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleTagSave}
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    Tag Client
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== CLIENTS TAB =====
function ClientsTab({ events }: { events: PhotoEvent[] }) {
  const allClients: {
    name: string;
    email: string;
    eventName: string;
    photoCount: number;
  }[] = [];

  for (const event of events) {
    const photosData = localStorage.getItem(`ulike_photos_${event.id}`);
    if (photosData) {
      const photos: Photo[] = JSON.parse(photosData);
      const clientMap = new Map<
        string,
        { name: string; email: string; count: number }
      >();
      for (const photo of photos) {
        for (const client of photo.taggedClients) {
          const key = client.email || client.name;
          if (!clientMap.has(key)) {
            clientMap.set(key, {
              name: client.name,
              email: client.email,
              count: 0,
            });
          }
          clientMap.get(key)!.count++;
        }
      }
      for (const [, client] of clientMap) {
        allClients.push({
          name: client.name,
          email: client.email,
          eventName: event.name,
          photoCount: client.count,
        });
      }
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Clients
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {allClients.length} tagged client{allClients.length !== 1 ? "s" : ""}
        </p>
      </div>

      {allClients.length > 0 ? (
        <div className="luxury-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Client
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Event
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Photos
                </th>
              </tr>
            </thead>
            <tbody>
              {allClients.map((client, i) => (
                <motion.tr
                  key={`${client.name}-${client.eventName}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {client.name}
                        </div>
                        {client.email && (
                          <div className="text-xs text-muted-foreground">
                            {client.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {client.eventName}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary text-xs"
                    >
                      {client.photoCount} photos
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No clients tagged yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Tag clients in your photos to see them here
          </p>
        </div>
      )}
    </div>
  );
}

// ===== SETTINGS TAB =====
function SettingsTab({ profile }: { profile: { name: string; role: string } }) {
  const [name, setName] = useState(profile.name);
  const [logoFile, setLogoFile] = useState<string | null>(
    localStorage.getItem("ulike_photographer_logo"),
  );
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = localStorage.getItem("ulike_user_profile");
      const profileData = existing ? JSON.parse(existing) : {};
      profileData.name = name.trim();
      localStorage.setItem("ulike_user_profile", JSON.stringify(profileData));
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      localStorage.setItem("ulike_photographer_logo", dataUrl);
      setLogoFile(dataUrl);
      toast.success("Logo uploaded!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your photographer profile
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Branding */}
        <div className="luxury-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Branding
          </h2>
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center flex-shrink-0">
              {logoFile ? (
                <img
                  src={logoFile}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground/40" />
              )}
            </div>
            <div>
              <p className="text-sm text-foreground font-medium mb-1">
                Photographer Logo
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Displayed on your galleries and client-facing pages
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-border text-foreground hover:bg-secondary gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          </div>

          {logoFile && (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Branding Preview
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={logoFile}
                  alt="Logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-display text-sm font-semibold text-foreground">
                  {name}
                </span>
              </div>
            </div>
          )}

          {logoFile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem("ulike_photographer_logo");
                setLogoFile(null);
                toast.success("Logo removed");
              }}
              className="mt-2 text-muted-foreground hover:text-destructive gap-2"
            >
              <X className="w-4 h-4" />
              Remove Logo
            </Button>
          )}
        </div>

        {/* Profile */}
        <div className="luxury-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground mb-2 block">Display Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or studio name"
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SUBSCRIPTION TAB =====
function SubscriptionTab() {
  const freeFeatures = [
    "Unlimited events",
    "Unlimited photo uploads",
    "AI face recognition",
    "Custom branding & logo",
    "Client gallery sharing",
    "Priority support",
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Plan & Billing
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your current plan and included features
        </p>
      </div>

      {/* Current Plan */}
      <div className="luxury-card p-6 mb-6 border-2 border-green-500/50 bg-green-500/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Current Plan
            </p>
            <p className="font-display text-2xl font-bold text-green-500">
              FREE Plan
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You are on the FREE Plan — No subscription required
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-sm px-3 py-1">
            ✓ Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {freeFeatures.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-3 h-3 text-green-500" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <p className="text-sm text-foreground font-medium mb-1">
            🎉 Always Free for Photographers
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            U Like Photography is completely free for photographers. Your
            clients pay for accessing their photos — choose from ₹99, ₹199, or
            ₹499 packages when downloading their memories.
          </p>
        </div>
      </div>
    </div>
  );
}
