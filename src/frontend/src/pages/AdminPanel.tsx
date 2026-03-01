import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  Package,
  Plus,
  Settings,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useGetProducts,
  useIsCallerAdmin,
  useIsStripeConfigured,
  useSetStripeConfiguration,
} from "../hooks/useQueries";

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!identity || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center luxury-card p-10 max-w-sm">
          <Shield className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            You need admin privileges to access this panel.
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
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">
                U Like Photography Management
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="stripe">
          <TabsList className="bg-secondary/50 border border-border mb-6">
            <TabsTrigger
              value="stripe"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <CreditCard className="w-4 h-4" />
              Stripe
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe">
            <StripeConfigTab />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="settings">
            <AppSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ===== STRIPE CONFIG =====
function StripeConfigTab() {
  const { data: isConfigured } = useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState("");
  const [countries, setCountries] = useState("US,CA,GB,AU");

  const handleSave = async () => {
    if (!secretKey.trim()) {
      toast.error("Please enter your Stripe secret key");
      return;
    }
    try {
      await setConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries: countries
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      });
      toast.success("Stripe configuration saved!");
      setSecretKey("");
    } catch {
      toast.error("Failed to save Stripe configuration");
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-1">
          Stripe Configuration
        </h2>
        <p className="text-muted-foreground text-sm">
          Configure payment processing for subscriptions
        </p>
      </div>

      <div className="luxury-card p-6 mb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
            )}
            <span className="text-sm text-foreground">
              Stripe is{" "}
              <span
                className={isConfigured ? "text-green-400" : "text-yellow-400"}
              >
                {isConfigured ? "configured" : "not configured"}
              </span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-foreground mb-2 block">
              Stripe Secret Key
            </Label>
            <Input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_live_... or sk_test_..."
              className="bg-secondary/50 border-border focus:border-primary font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Find this in your Stripe dashboard → Developers → API Keys
            </p>
          </div>

          <div>
            <Label className="text-foreground mb-2 block">
              Allowed Countries (comma-separated)
            </Label>
            <Input
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="US,CA,GB,AU"
              className="bg-secondary/50 border-border focus:border-primary font-mono text-sm uppercase"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ISO country codes. See Stripe documentation for full list.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={setConfig.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {setConfig.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== PRODUCTS =====
function ProductsTab() {
  const { data: products = [], isLoading } = useGetProducts();
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    currency: "usd",
    priceInCents: BigInt(0),
  });

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    try {
      await addProduct.mutateAsync({
        ...formData,
        id: `prod_${Date.now()}`,
      });
      toast.success("Product added!");
      setShowDialog(false);
      setFormData({
        name: "",
        description: "",
        currency: "usd",
        priceInCents: BigInt(0),
      });
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-1">
            Products
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage subscription plans
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">
                Add Product
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-foreground mb-2 block">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Professional Plan"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div>
                <Label className="text-foreground mb-2 block">
                  Description
                </Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Unlimited events and photos"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div>
                <Label className="text-foreground mb-2 block">
                  Price (cents)
                </Label>
                <Input
                  type="number"
                  value={Number(formData.priceInCents)}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      priceInCents: BigInt(
                        Number.parseInt(e.target.value) || 0,
                      ),
                    }))
                  }
                  placeholder="7900"
                  className="bg-secondary/50 border-border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  In cents (e.g. 7900 = $79.00)
                </p>
              </div>
              <Button
                onClick={handleAdd}
                disabled={addProduct.isPending}
                className="w-full bg-primary text-primary-foreground"
              >
                {addProduct.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="luxury-card p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            No products yet. Add your subscription plans.
          </p>
        </div>
      ) : (
        <div className="luxury-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Name
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Description
                </th>
                <th className="text-left text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Price
                </th>
                <th className="text-right text-xs text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-border/50 hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {product.description}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary text-xs"
                    >
                      ${(Number(product.priceInCents) / 100).toFixed(2)}{" "}
                      {product.currency.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===== USERS =====
function UsersTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-1">
          User Management
        </h2>
        <p className="text-muted-foreground text-sm">
          Manage photographer and client accounts
        </p>
      </div>
      <div className="luxury-card p-12 text-center">
        <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          User Registry
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Users are managed through Internet Identity. Roles are assigned based
          on profile setup during onboarding.
        </p>
      </div>
    </div>
  );
}

// ===== APP SETTINGS =====
function AppSettingsTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-1">
          App Settings
        </h2>
        <p className="text-muted-foreground text-sm">
          Global application configuration
        </p>
      </div>
      <div className="luxury-card p-6 space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-sm font-medium text-foreground">App Name</p>
            <p className="text-xs text-muted-foreground">U Like Photography</p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            Active
          </Badge>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-sm font-medium text-foreground">
              AI Face Recognition
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by advanced ML models
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Enabled
          </Badge>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-sm font-medium text-foreground">
              Storage Backend
            </p>
            <p className="text-xs text-muted-foreground">
              Decentralized blob storage
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Connected
          </Badge>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Platform</p>
            <p className="text-xs text-muted-foreground">
              Internet Computer (ICP)
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-border text-muted-foreground"
          >
            v1.0.0
          </Badge>
        </div>
      </div>
    </div>
  );
}
