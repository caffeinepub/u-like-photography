import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Product,
  type ShoppingItem,
  type StripeConfiguration,
  UserRole,
} from "../backend";
import { useActor } from "./useActor";

// ===== USER PROFILE =====
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<{ name: string; role: string } | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const stored = localStorage.getItem("ulike_user_profile");
      if (stored) {
        return JSON.parse(stored) as { name: string; role: string };
      }
      return null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// ===== USER ROLE =====
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ===== PRODUCTS =====
export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ===== STRIPE =====
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isStripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isStripeConfigured"] });
    },
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error("Stripe session missing url");
      }
      return session;
    },
  });
}

// ===== EVENTS (local storage based) =====
export interface PhotoEvent {
  id: string;
  name: string;
  date: string;
  type: "wedding" | "birthday" | "graduation" | "corporate" | "special";
  coverPhoto?: string;
  photoCount: number;
  clientCount: number;
  accessCode: string;
  photographerId: string;
}

export interface Photo {
  id: string;
  eventId: string;
  url: string;
  thumbnailUrl: string;
  taggedClients: TaggedClient[];
  uploadedAt: string;
  isFavorite?: boolean;
}

export interface TaggedClient {
  name: string;
  email: string;
  clientId?: string;
}

export function useGetEvents(photographerId: string) {
  return useQuery<PhotoEvent[]>({
    queryKey: ["events", photographerId],
    queryFn: () => {
      const stored = localStorage.getItem(`ulike_events_${photographerId}`);
      if (stored) return JSON.parse(stored) as PhotoEvent[];
      return getSampleEvents(photographerId);
    },
    enabled: !!photographerId,
  });
}

export function useGetEventByCode(code: string) {
  return useQuery<PhotoEvent | null>({
    queryKey: ["event_code", code],
    queryFn: () => {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("ulike_events_"),
      );
      for (const key of keys) {
        const events = JSON.parse(
          localStorage.getItem(key) || "[]",
        ) as PhotoEvent[];
        const event = events.find((e) => e.accessCode === code);
        if (event) return event;
      }
      // Check sample events
      const sampleEvs = getSampleEvents("sample-photographer-1");
      return sampleEvs.find((e) => e.accessCode === code) || null;
    },
    enabled: !!code,
  });
}

export function useGetPhotos(eventId: string) {
  return useQuery<Photo[]>({
    queryKey: ["photos", eventId],
    queryFn: () => {
      const stored = localStorage.getItem(`ulike_photos_${eventId}`);
      if (stored) return JSON.parse(stored) as Photo[];
      return getSamplePhotos(eventId);
    },
    enabled: !!eventId,
  });
}

function getSampleEvents(photographerId: string): PhotoEvent[] {
  return [
    {
      id: "event-1",
      name: "Sarah & James Wedding",
      date: "2025-11-15",
      type: "wedding",
      coverPhoto: "/assets/generated/sample-wedding.dim_600x400.jpg",
      photoCount: 247,
      clientCount: 84,
      accessCode: "WEDDING2025",
      photographerId,
    },
    {
      id: "event-2",
      name: "Emma's 30th Birthday Gala",
      date: "2025-12-03",
      type: "birthday",
      coverPhoto: "/assets/generated/sample-birthday.dim_600x400.jpg",
      photoCount: 128,
      clientCount: 45,
      accessCode: "EMMA30TH",
      photographerId,
    },
    {
      id: "event-3",
      name: "Harvard Class of 2025 Graduation",
      date: "2025-05-22",
      type: "graduation",
      coverPhoto: "/assets/generated/sample-graduation.dim_600x400.jpg",
      photoCount: 312,
      clientCount: 156,
      accessCode: "GRAD2025",
      photographerId,
    },
  ];
}

function getSamplePhotos(eventId: string): Photo[] {
  const coverPhotos = [
    "/assets/generated/sample-wedding.dim_600x400.jpg",
    "/assets/generated/sample-birthday.dim_600x400.jpg",
    "/assets/generated/sample-graduation.dim_600x400.jpg",
  ];

  return Array.from({ length: 12 }, (_, i) => ({
    id: `photo-${eventId}-${i}`,
    eventId,
    url: coverPhotos[i % coverPhotos.length],
    thumbnailUrl: coverPhotos[i % coverPhotos.length],
    taggedClients: i < 4 ? [{ name: "You", email: "client@example.com" }] : [],
    uploadedAt: new Date(Date.now() - i * 3600000).toISOString(),
    isFavorite: i === 0 || i === 2,
  }));
}
