import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="luxury-card p-12 max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-10 h-10 text-destructive" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Your payment was not completed. No charges were made to your account.
        </p>

        <div className="space-y-3">
          <Link to="/photographer" search={{ tab: "subscription" }}>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </Link>
          <Link to="/">
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
