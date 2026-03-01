import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Camera, CheckCircle, Loader2, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Role = "photographer" | "client";

export default function AuthPage() {
  const search = useSearch({ from: "/auth" }) as { role?: string };
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();

  const [selectedRole, setSelectedRole] = useState<Role>(
    (search?.role as Role) || "client",
  );
  const [displayName, setDisplayName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (isAuthenticated) {
      const profile = localStorage.getItem("ulike_user_profile");
      if (!profile) {
        setShowNameInput(true);
      } else {
        const profileData = JSON.parse(profile) as {
          name: string;
          role: string;
        };
        if (profileData.role === "photographer") {
          navigate({ to: "/photographer", search: { tab: "" } });
        } else if (profileData.role === "admin") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/client", search: { tab: "" } });
        }
      }
    }
  }, [isAuthenticated, navigate]);

  const handleConnect = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error("Connection failed. Please try again.");
      }
    }
  };

  const handleProfileSetup = async () => {
    if (!displayName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setIsSettingUp(true);
    try {
      const profile = {
        name: displayName.trim(),
        role: selectedRole,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("ulike_user_profile", JSON.stringify(profile));
      toast.success("Profile created! Welcome to U Like Photography");
      setTimeout(() => {
        if (selectedRole === "photographer") {
          navigate({ to: "/photographer", search: { tab: "" } });
        } else {
          navigate({ to: "/client", search: { tab: "" } });
        }
      }, 500);
    } catch {
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsSettingUp(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1200x600.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background" />

      {/* Decorative */}
      <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/uploads/Black-and-Yellow-Classy-and-Refined-Photography-Logo-1.png"
                alt="U Like Photography"
                className="w-32 h-auto object-contain"
              />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              U Like Photography
            </h1>
            <p className="text-muted-foreground text-sm">
              {showNameInput
                ? "Complete your profile to get started"
                : "Connect to access your account"}
            </p>
          </div>

          <div className="luxury-card p-8">
            {!isAuthenticated ? (
              <>
                {/* Role Selection */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-foreground mb-3 block uppercase tracking-wider">
                    I am a...
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("photographer")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                        selectedRole === "photographer"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <Camera className="w-6 h-6" />
                      <span className="text-sm font-medium">Photographer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("client")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                        selectedRole === "client"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <User className="w-6 h-6" />
                      <span className="text-sm font-medium">Client</span>
                    </button>
                  </div>
                </div>

                <div className="mb-6 p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    {selectedRole === "photographer"
                      ? "Photographers join FREE. Upload photos, create events, and deliver photos to your clients using AI face recognition."
                      : "View and download your photos. Pay per photo package in Rs to access your memories."}
                  </p>
                </div>

                <Button
                  onClick={handleConnect}
                  disabled={isLoggingIn}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 text-base"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Connect with Internet Identity
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
                  Powered by Internet Identity — secure, private, no passwords
                  required.
                </p>
              </>
            ) : showNameInput ? (
              <>
                {/* Profile Setup */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                    Connected Successfully!
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Set up your profile to continue
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="displayName"
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={
                        selectedRole === "photographer"
                          ? "Photography Studio Name or Your Name"
                          : "Your Full Name"
                      }
                      className="bg-secondary/50 border-border focus:border-primary h-11"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleProfileSetup();
                      }}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block uppercase tracking-wider">
                      Account Type
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("photographer")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                          selectedRole === "photographer"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <Camera className="w-5 h-5" />
                        <span className="text-xs font-medium">
                          Photographer
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole("client")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                          selectedRole === "client"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span className="text-xs font-medium">Client</span>
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleProfileSetup}
                    disabled={isSettingUp || !displayName.trim()}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12"
                  >
                    {isSettingUp ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">Redirecting...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
