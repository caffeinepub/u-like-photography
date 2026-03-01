import { Button } from "@/components/ui/button";
import { Link, useSearch } from "@tanstack/react-router";
import { ArrowRight, Camera, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

export default function PaymentSuccess() {
  const search = useSearch({ from: "/payment-success" }) as {
    session_id?: string;
  };
  const { actor } = useActor();
  useEffect(() => {
    // Optionally verify session status
    if (search?.session_id && actor) {
      actor.getStripeSessionStatus(search.session_id).catch(() => {
        // Silent - page already shows success state
      });
    }
  }, [search, actor]);

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
          className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-400" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Your subscription is now active. Welcome to U Like Photography
          Professional!
        </p>

        <div className="space-y-3">
          <Link to="/photographer" search={{ tab: "" }}>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Camera className="w-4 h-4" />
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/">
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
