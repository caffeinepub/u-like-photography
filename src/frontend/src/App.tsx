import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { PageLayout } from "./components/Layout";
import AdminPanel from "./pages/AdminPanel";
import AuthPage from "./pages/AuthPage";
import ClientPortal from "./pages/ClientPortal";
import LandingPage from "./pages/LandingPage";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";
import PhotographerDashboard from "./pages/PhotographerDashboard";
import SharedEventPage from "./pages/SharedEventPage";

// ===== ROOT ROUTE =====
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// ===== LAYOUT ROUTE (with header/footer) =====
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => (
    <PageLayout>
      <Outlet />
    </PageLayout>
  ),
});

// ===== STANDALONE ROUTES (no nav layout) =====
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as string) || "",
  }),
});

const photographerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/photographer",
  component: PhotographerDashboard,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || "",
  }),
  beforeLoad: () => {
    const profile = localStorage.getItem("ulike_user_profile");
    if (!profile) {
      throw redirect({ to: "/auth", search: { role: "photographer" } });
    }
  },
});

const clientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client",
  component: ClientPortal,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || "",
  }),
  beforeLoad: () => {
    const profile = localStorage.getItem("ulike_user_profile");
    if (!profile) {
      throw redirect({ to: "/auth", search: { role: "client" } });
    }
  },
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) || "",
  }),
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
});

// ===== LAYOUT ROUTES =====
const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: LandingPage,
});

const eventRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/event/$code",
  component: SharedEventPage,
});

// ===== ROUTER =====
const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([indexRoute, eventRoute]),
  authRoute,
  photographerRoute,
  clientRoute,
  adminRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
