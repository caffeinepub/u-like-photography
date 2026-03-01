import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      localStorage.removeItem("ulike_user_profile");
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isLandingPage = currentPath === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLandingPage
          ? "bg-background/80 backdrop-blur-md border-b border-border/50"
          : "bg-background border-b border-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img
            src="/assets/uploads/Black-and-Yellow-Classy-and-Refined-Photography-Logo-1.png"
            alt="U Like Photography"
            className="max-h-10 sm:max-h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/photographer"
                search={{ tab: "" }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/client"
                search={{ tab: "" }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Gallery
              </Link>
            </>
          )}
          <Link
            to="/auth"
            search={{ role: "" }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isAuthenticated ? "Profile" : "Sign In"}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated && (
            <Link to="/auth" search={{ role: "" }}>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>
          )}
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {isLoggingIn
              ? "Connecting..."
              : isAuthenticated
                ? "Sign Out"
                : "Connect Wallet"}
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden text-foreground p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/photographer"
                    search={{ tab: "" }}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/client"
                    search={{ tab: "" }}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    My Gallery
                  </Link>
                </>
              )}
              <Link
                to="/auth"
                search={{ role: "" }}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isAuthenticated ? "Profile" : "Sign In"}
              </Link>
              <Button
                onClick={() => {
                  handleAuth();
                  setMenuOpen(false);
                }}
                disabled={isLoggingIn}
                size="sm"
                className="bg-primary text-primary-foreground w-full"
              >
                {isLoggingIn
                  ? "Connecting..."
                  : isAuthenticated
                    ? "Sign Out"
                    : "Connect"}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-background border-t border-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/uploads/Black-and-Yellow-Classy-and-Refined-Photography-Logo-1.png"
                alt="U Like Photography"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered photo delivery that transforms moments into memories.
              Professional, secure, and beautifully presented.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              📞 M: 9878990216
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-widest">
              Photographers
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/photographer"
                  search={{ tab: "" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  search={{ role: "" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/photographer"
                  search={{ tab: "subscription" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-widest">
              Clients
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/client"
                  search={{ tab: "" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  My Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/client"
                  search={{ tab: "scan" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  Face Scan
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  search={{ role: "" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  Access Gallery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            AI Face Scan Technology · Secure Cloud Storage · Professional
            Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
