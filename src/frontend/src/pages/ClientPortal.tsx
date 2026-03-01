import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Camera,
  CheckCircle,
  Download,
  Heart,
  Image,
  Loader2,
  Play,
  RotateCw,
  Scan,
  ScanFace,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCamera } from "../camera/useCamera";
import {
  type Photo,
  type PhotoEvent,
  useGetEvents,
  useGetPhotos,
} from "../hooks/useQueries";

function useClientProfile() {
  const stored = localStorage.getItem("ulike_user_profile");
  if (stored) {
    return JSON.parse(stored) as { name: string; role: string };
  }
  return null;
}

type ScanState =
  | "idle"
  | "starting"
  | "scanning"
  | "processing"
  | "done"
  | "error";

export default function ClientPortal() {
  const navigate = useNavigate();
  const profile = useClientProfile();
  const [activeTab, setActiveTab] = useState("gallery");
  const [eventCode, setEventCode] = useState(
    localStorage.getItem("ulike_last_event_code") || "",
  );
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [allMyPhotos, setAllMyPhotos] = useState<Photo[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    new Set(
      JSON.parse(localStorage.getItem("ulike_favorites") || "[]") as string[],
    ),
  );
  const [paymentPhoto, setPaymentPhoto] = useState<Photo | null>(null);

  // Load sample events for demo
  const samplePhotographerId = "sample-photographer-1";
  const { data: events = [] } = useGetEvents(samplePhotographerId);

  useEffect(() => {
    if (!profile) {
      navigate({ to: "/auth", search: { role: "client" } });
    }
  }, [profile, navigate]);

  useEffect(() => {
    // Load all photos tagged to client from all events
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("ulike_photos_"),
    );
    const tagged: Photo[] = [];
    for (const key of keys) {
      const photos = JSON.parse(localStorage.getItem(key) || "[]") as Photo[];
      const myPhotos = photos.filter((p) =>
        p.taggedClients.some(
          (c) => c.name === profile?.name || c.email === "client@example.com",
        ),
      );
      tagged.push(...myPhotos);
    }

    // Add sample photos from events
    for (const event of events) {
      const key = `ulike_photos_${event.id}`;
      const existing = localStorage.getItem(key);
      if (!existing) {
        // Demo: show first 4 sample photos as "my photos"
        const samplePhotos: Photo[] = [
          {
            id: `${event.id}-0`,
            eventId: event.id,
            url: "/assets/generated/sample-wedding.dim_600x400.jpg",
            thumbnailUrl: "/assets/generated/sample-wedding.dim_600x400.jpg",
            taggedClients: [{ name: "You", email: "client@example.com" }],
            uploadedAt: new Date().toISOString(),
          },
          {
            id: `${event.id}-2`,
            eventId: event.id,
            url: "/assets/generated/sample-birthday.dim_600x400.jpg",
            thumbnailUrl: "/assets/generated/sample-birthday.dim_600x400.jpg",
            taggedClients: [{ name: "You", email: "client@example.com" }],
            uploadedAt: new Date().toISOString(),
          },
        ];
        tagged.push(...samplePhotos);
      }
    }

    setAllMyPhotos(tagged);
  }, [events, profile]);

  const handleFavorite = (photoId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      localStorage.setItem("ulike_favorites", JSON.stringify([...next]));
      return next;
    });
  };

  const handleDownload = (photo: Photo) => {
    setPaymentPhoto(photo);
  };

  const executeDownload = (photo: Photo) => {
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = `ulike-photo-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setPaymentPhoto(null);
    toast.success("Download started!");
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Welcome, <span className="text-primary">{profile.name}</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {allMyPhotos.length} photos found for you
              </p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              Client Portal
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary/50 border border-border mb-6 h-auto p-1">
            <TabsTrigger
              value="scan"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm px-4 py-2"
            >
              <ScanFace className="w-4 h-4" />
              Face Scan
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm px-4 py-2"
            >
              <Image className="w-4 h-4" />
              My Gallery
            </TabsTrigger>
            <TabsTrigger
              value="event"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm px-4 py-2"
            >
              <Search className="w-4 h-4" />
              Event Access
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm px-4 py-2"
            >
              <Heart className="w-4 h-4" />
              Favorites
              {favoriteIds.size > 0 && (
                <span className="ml-1 text-xs bg-primary/30 rounded-full px-1.5 py-0.5">
                  {favoriteIds.size}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan">
            <FaceScanTab
              onScanComplete={() => setActiveTab("gallery")}
              clientName={profile.name}
            />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab
              photos={allMyPhotos}
              favoriteIds={favoriteIds}
              onFavorite={handleFavorite}
              onDownload={handleDownload}
              title="My Photos"
              emptyMessage="No photos found yet. Use face scan or enter an event code to find your photos."
            />
          </TabsContent>

          <TabsContent value="event">
            <EventAccessTab
              eventCode={eventCode}
              setEventCode={(code) => {
                setEventCode(code);
                localStorage.setItem("ulike_last_event_code", code);
              }}
              events={events}
              currentEventId={currentEventId}
              setCurrentEventId={setCurrentEventId}
              favoriteIds={favoriteIds}
              onFavorite={handleFavorite}
              onDownload={handleDownload}
              clientName={profile.name}
            />
          </TabsContent>

          <TabsContent value="favorites">
            <GalleryTab
              photos={allMyPhotos.filter((p) => favoriteIds.has(p.id))}
              favoriteIds={favoriteIds}
              onFavorite={handleFavorite}
              onDownload={handleDownload}
              title="Favorite Photos"
              emptyMessage="Heart photos to save them here"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Dialog */}
      <Dialog
        open={!!paymentPhoto}
        onOpenChange={(open) => !open && setPaymentPhoto(null)}
      >
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              Download Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Choose a download option to access your photo:
            </p>

            {/* Single photo option */}
            <div className="p-4 rounded-lg border border-border bg-secondary/30 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Single Photo
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Download this photo in HD
                </p>
              </div>
              <Button
                onClick={() => paymentPhoto && executeDownload(paymentPhoto)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold whitespace-nowrap"
              >
                Pay ₹49
              </Button>
            </div>

            {/* Full package option */}
            <div className="p-4 rounded-lg border-2 border-primary bg-primary/5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    Full Package
                  </p>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                    Best Value
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  All your photos from this event in HD
                </p>
              </div>
              <Button
                onClick={() => paymentPhoto && executeDownload(paymentPhoto)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold whitespace-nowrap"
              >
                Get ₹199
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              💳 Secure payment · Instant download after payment
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== FACE SCAN =====
function FaceScanTab({
  onScanComplete,
  clientName,
}: {
  onScanComplete: () => void;
  clientName: string;
}) {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "user", quality: 0.9 });

  const handleStartScan = async () => {
    setScanState("starting");
    const success = await startCamera();
    if (success) {
      setScanState("idle");
    } else {
      setScanState("error");
    }
  };

  const handleCapture = async () => {
    setScanState("scanning");
    const file = await capturePhoto();

    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedImage(url);
      await stopCamera();

      setScanState("processing");
      setScanProgress(0);

      // Simulate AI face scanning with progress
      scanIntervalRef.current = setInterval(() => {
        setScanProgress((p) => {
          if (p >= 100) {
            clearInterval(scanIntervalRef.current!);
            setScanState("done");
            toast.success(`Found your photos, ${clientName}! 🎉`);
            return 100;
          }
          return p + Math.random() * 12 + 3;
        });
      }, 150);
    } else {
      setScanState("error");
    }
  };

  const handleReset = () => {
    setScanState("idle");
    setCapturedImage(null);
    setScanProgress(0);
    if (capturedImage) URL.revokeObjectURL(capturedImage);
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            AI Face Scan
          </h2>
          <p className="text-muted-foreground text-sm">
            Our AI will scan your face and instantly find all your photos from
            events
          </p>
        </div>

        {/* Camera/Capture Area */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary/50 mb-4">
          {/* Video preview */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${!isActive || capturedImage ? "hidden" : ""}`}
            playsInline
            muted
            style={{ minHeight: "240px" }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Captured image */}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          {/* Idle state */}
          {!isActive && !capturedImage && scanState !== "starting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Camera className="w-16 h-16 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm text-center px-4">
                {isSupported === false
                  ? "Camera not supported on this browser"
                  : "Start camera to scan your face"}
              </p>
            </div>
          )}

          {/* Loading state */}
          {(isLoading || scanState === "starting") && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* Scan overlay */}
          {isActive && !capturedImage && scanState === "idle" && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Scanning frame corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />
            </div>
          )}

          {/* Processing overlay */}
          {scanState === "processing" && capturedImage && (
            <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center gap-3">
              {/* Animated scan line */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-primary/80"
                style={{
                  animation: "scan-line 1.5s linear infinite",
                  boxShadow: "0 0 8px oklch(0.78 0.12 85)",
                }}
              />
              <div className="text-center z-10">
                <div className="text-primary text-sm font-semibold mb-1">
                  Scanning Face...
                </div>
                <div className="text-muted-foreground text-xs">
                  {Math.round(scanProgress)}% complete
                </div>
              </div>
            </div>
          )}

          {/* Done overlay */}
          {scanState === "done" && (
            <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-primary" />
              </motion.div>
              <p className="text-foreground font-semibold">Photos Found!</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-3 p-4">
              <X className="w-12 h-12 text-destructive" />
              <p className="text-sm text-muted-foreground text-center">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {scanState === "idle" && !isActive && !capturedImage && (
            <Button
              onClick={handleStartScan}
              disabled={isLoading || isSupported === false}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Play className="w-4 h-4" />
              Start Camera
            </Button>
          )}

          {isActive && scanState === "idle" && (
            <>
              <Button
                onClick={() => stopCamera()}
                variant="outline"
                className="border-border text-foreground"
              >
                Stop
              </Button>
              <Button
                onClick={handleCapture}
                disabled={!isActive || isLoading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Camera className="w-4 h-4" />
                Scan My Face
              </Button>
            </>
          )}

          {scanState === "processing" && (
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>AI is analyzing your face...</span>
                <span className="text-primary">
                  {Math.round(scanProgress)}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(scanProgress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {scanState === "done" && (
            <>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-border text-foreground gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Scan Again
              </Button>
              <Button
                onClick={onScanComplete}
                className="flex-1 bg-primary text-primary-foreground gap-2"
              >
                <Image className="w-4 h-4" />
                View My Photos
              </Button>
            </>
          )}

          {(scanState === "error" || (error && !isActive)) && (
            <Button
              onClick={handleReset}
              className="flex-1 bg-primary text-primary-foreground gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Your face data is processed locally and never stored
        </p>
      </motion.div>
    </div>
  );
}

// ===== GALLERY =====
function GalleryTab({
  photos,
  favoriteIds,
  onFavorite,
  onDownload,
  title,
  emptyMessage,
}: {
  photos: Photo[];
  favoriteIds: Set<string>;
  onFavorite: (id: string) => void;
  onDownload: (photo: Photo) => void;
  title: string;
  emptyMessage: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">
          {title}
        </h2>
        <Badge
          variant="outline"
          className="border-border text-muted-foreground"
        >
          {photos.length} photos
        </Badge>
      </div>

      {photos.length === 0 ? (
        <div className="luxury-card flex flex-col items-center justify-center py-20 text-center">
          <Image className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No photos yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="relative aspect-square rounded-lg overflow-hidden luxury-card group"
            >
              <img
                src={photo.url}
                alt={`Gallery item ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                  <Button
                    size="sm"
                    className="h-7 w-7 p-0 bg-primary/90 hover:bg-primary text-primary-foreground"
                    onClick={() => onDownload(photo)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    className={`h-7 w-7 p-0 ${
                      favoriteIds.has(photo.id)
                        ? "bg-pink-500/90 hover:bg-pink-500"
                        : "bg-background/70 hover:bg-background/90"
                    } text-white`}
                    onClick={() => onFavorite(photo.id)}
                  >
                    <Heart
                      className={`w-3 h-3 ${favoriteIds.has(photo.id) ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>
              </div>
              {favoriteIds.has(photo.id) && (
                <div className="absolute top-1.5 right-1.5">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400 drop-shadow" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== EVENT ACCESS =====
function EventAccessTab({
  eventCode,
  setEventCode,
  events,
  currentEventId,
  setCurrentEventId,
  favoriteIds,
  onFavorite,
  onDownload,
  clientName,
}: {
  eventCode: string;
  setEventCode: (code: string) => void;
  events: PhotoEvent[];
  currentEventId: string | null;
  setCurrentEventId: (id: string | null) => void;
  favoriteIds: Set<string>;
  onFavorite: (id: string) => void;
  onDownload: (photo: Photo) => void;
  clientName: string;
}) {
  const [searching, setSearching] = useState(false);
  const { data: eventPhotos = [] } = useGetPhotos(currentEventId || "");

  const currentEvent = events.find((e) => e.id === currentEventId);

  const handleSearch = async () => {
    if (!eventCode.trim()) {
      toast.error("Please enter an event access code");
      return;
    }
    setSearching(true);
    await new Promise((r) => setTimeout(r, 800));

    // Search in events
    const found = events.find(
      (e) => e.accessCode.toUpperCase() === eventCode.toUpperCase().trim(),
    );

    if (found) {
      setCurrentEventId(found.id);
      toast.success(`Found event: ${found.name}`);
    } else {
      toast.error("Event not found. Please check the access code.");
    }
    setSearching(false);
  };

  const photosToShow = currentEventId
    ? eventPhotos.filter(
        (p) =>
          p.taggedClients.length === 0 ||
          p.taggedClients.some(
            (c) => c.name === clientName || c.email === "client@example.com",
          ),
      )
    : [];

  return (
    <div className="max-w-4xl">
      <div className="luxury-card p-6 mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-1">
          Enter Event Access Code
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Get your access code from your photographer or use a shared event link
        </p>

        <div className="flex gap-3">
          <Input
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value.toUpperCase())}
            placeholder="Enter code (e.g. WEDDING2025)"
            className="bg-secondary/50 border-border focus:border-primary font-mono text-sm uppercase"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <Button
            onClick={handleSearch}
            disabled={searching || !eventCode.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 whitespace-nowrap"
          >
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Find Photos
          </Button>
        </div>

        {/* Quick access sample events */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">
            Sample events to try:
          </p>
          <div className="flex flex-wrap gap-2">
            {events.map((e) => (
              <button
                type="button"
                key={e.id}
                onClick={() => {
                  setEventCode(e.accessCode);
                  setCurrentEventId(e.id);
                  toast.success(`Accessing: ${e.name}`);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-mono"
              >
                {e.accessCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentEvent && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {currentEvent.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {new Date(currentEvent.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" · "}
                <span className="capitalize">{currentEvent.type}</span>
              </p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {photosToShow.length} photos
            </Badge>
          </div>

          <GalleryTab
            photos={photosToShow}
            favoriteIds={favoriteIds}
            onFavorite={onFavorite}
            onDownload={onDownload}
            title=""
            emptyMessage="No photos tagged for you in this event"
          />
        </div>
      )}
    </div>
  );
}
