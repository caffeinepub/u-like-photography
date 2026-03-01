import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Camera,
  Download,
  Heart,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Photo,
  useGetEventByCode,
  useGetPhotos,
} from "../hooks/useQueries";

const EVENT_TYPE_COLORS: Record<string, string> = {
  wedding: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  birthday: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  graduation: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  corporate: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  special: "bg-primary/20 text-primary border-primary/30",
};

export default function SharedEventPage() {
  const { code } = useParams({ strict: false }) as { code: string };
  const { identity } = useInternetIdentity();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    new Set(
      JSON.parse(localStorage.getItem("ulike_favorites") || "[]") as string[],
    ),
  );

  const { data: event, isLoading: eventLoading } = useGetEventByCode(code);
  const { data: photos = [], isLoading: photosLoading } = useGetPhotos(
    event?.id || "",
  );

  const isAuthenticated = !!identity;
  const profile = localStorage.getItem("ulike_user_profile")
    ? JSON.parse(localStorage.getItem("ulike_user_profile")!)
    : null;

  const handleFavorite = (photoId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      localStorage.setItem("ulike_favorites", JSON.stringify([...next]));
      return next;
    });
  };

  const handleDownload = (photo: Photo) => {
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = `ulike-photo-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Photo download started!");
  };

  const visiblePhotos =
    isAuthenticated && profile
      ? photos.filter(
          (p) =>
            p.taggedClients.length === 0 ||
            p.taggedClients.some((c) => c.name === profile.name),
        )
      : photos.slice(0, 6); // Show limited preview for guests

  const photographerLogo = localStorage.getItem("ulike_photographer_logo");

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-64 rounded-2xl mb-6" />
          <Skeleton className="h-8 w-1/2 mb-3" />
          <Skeleton className="h-4 w-1/3 mb-8" />
          <div className="grid grid-cols-3 gap-4">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <Skeleton key={k} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            Event Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            This event link may be expired or the access code is incorrect.
          </p>
          <Link to="/">
            <Button className="bg-primary text-primary-foreground">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Event Hero */}
      <div className="relative h-80 overflow-hidden">
        {event.coverPhoto ? (
          <img
            src={event.coverPhoto}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Photographer branding */}
            <div className="flex items-center gap-3 mb-4">
              {photographerLogo && (
                <img
                  src={photographerLogo}
                  alt="Photographer"
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
              )}
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Camera className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                U Like Photography
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {event.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.special}`}
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-primary/30 text-primary text-sm"
              >
                {photos.length} Photos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Guest CTA */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="luxury-card p-6 mb-8 border-primary/30 bg-primary/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  Find Your Personal Photos
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to use AI face scan and instantly find all photos
                  featuring you in this event.
                </p>
                <Link to="/auth" search={{ role: "client" }}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    Sign In to Access All Photos
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Photos Grid */}
        {photosLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].map((k) => (
              <Skeleton key={k} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {visiblePhotos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    {isAuthenticated ? "Your Photos" : "Preview"}
                  </h2>
                  {!isAuthenticated && photos.length > 6 && (
                    <p className="text-xs text-muted-foreground">
                      Showing 6 of {photos.length} — sign in to see all
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {visiblePhotos.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="relative aspect-square rounded-xl overflow-hidden luxury-card group"
                    >
                      <img
                        src={photo.url}
                        alt={`Gallery item ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!isAuthenticated && (
                        <div className="absolute inset-0 bg-background/20" />
                      )}
                      {isAuthenticated && (
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                            <Button
                              size="sm"
                              className="h-7 w-7 p-0 bg-primary/90 hover:bg-primary text-primary-foreground"
                              onClick={() => handleDownload(photo)}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              className={`h-7 w-7 p-0 ${
                                favoriteIds.has(photo.id)
                                  ? "bg-pink-500/90"
                                  : "bg-background/70 hover:bg-background/90"
                              } text-white`}
                              onClick={() => handleFavorite(photo.id)}
                            >
                              <Heart
                                className={`w-3 h-3 ${favoriteIds.has(photo.id) ? "fill-current" : ""}`}
                              />
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Guest blur overlay for more photos */}
                {!isAuthenticated && photos.length > 6 && (
                  <div className="relative mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 opacity-40 blur-sm pointer-events-none">
                      {photos.slice(6, 10).map((photo) => (
                        <div
                          key={`blur-${photo.id}`}
                          className="aspect-square rounded-xl overflow-hidden"
                        >
                          <img
                            src={photo.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link to="/auth" search={{ role: "client" }}>
                        <Button className="bg-primary text-primary-foreground gap-2">
                          <Lock className="w-4 h-4" />
                          Unlock {photos.length - 6} More Photos
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
