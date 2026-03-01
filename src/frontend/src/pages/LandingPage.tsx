import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  CheckCircle,
  Download,
  Image,
  Scan,
  Share2,
  Shield,
  Star,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Scan,
    title: "AI Face Recognition",
    description:
      "Advanced AI scans faces and instantly delivers each client their personal photos from thousands of images.",
  },
  {
    icon: Shield,
    title: "Private & Secure Galleries",
    description:
      "End-to-end encrypted photo storage. Only authorized clients can access their personal memories.",
  },
  {
    icon: Star,
    title: "Event Management",
    description:
      "Create events for weddings, birthdays, graduations. Organize and share with ease.",
  },
  {
    icon: Download,
    title: "Instant Download",
    description:
      "High-resolution photo downloads with one click. Clients keep their memories forever.",
  },
  {
    icon: Users,
    title: "Photographer Branding",
    description:
      "Custom logo, branded galleries. Your professional identity front and center.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on decentralized infrastructure for blazing-fast uploads and downloads globally.",
  },
];

const photographerSteps = [
  {
    step: "01",
    title: "Upload Your Photos",
    description: "Drag and drop your entire event's photos in bulk.",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI Organizes Everything",
    description: "Our AI automatically identifies and tags each person.",
    icon: Scan,
  },
  {
    step: "03",
    title: "Share with Clients",
    description:
      "Send personalized gallery links. Clients see only their photos.",
    icon: Share2,
  },
];

const clientSteps = [
  {
    step: "01",
    title: "Receive Your Link",
    description: "Get an event access link from your photographer.",
    icon: Share2,
  },
  {
    step: "02",
    title: "Scan Your Face",
    description: "Use face scan to instantly find all your photos.",
    icon: Camera,
  },
  {
    step: "03",
    title: "Download & Share",
    description: "Download high-res photos and share your memories.",
    icon: Download,
  },
];

const clientPackages = [
  {
    label: "Basic",
    price: "₹99",
    description: "View & download up to 20 photos",
  },
  {
    label: "Standard",
    price: "₹199",
    description: "Full gallery access + HD downloads",
  },
  {
    label: "Premium",
    price: "₹499",
    description: "Full album + prints + priority support",
  },
];

const testimonials = [
  {
    name: "Alexandra Chen",
    role: "Wedding Photographer",
    quote:
      "U Like Photography transformed how I deliver photos. My clients are absolutely amazed when they scan their face and instantly see all their photos. The AI is incredibly accurate.",
    rating: 5,
  },
  {
    name: "Marcus Williams",
    role: "Event Photographer",
    quote:
      "I used to spend days organizing and sending photos. Now it takes minutes. The AI face recognition saves me hours of work after every event.",
    rating: 5,
  },
  {
    name: "Sofia Rodriguez",
    role: "Portrait Photographer",
    quote:
      "The luxury feel of the galleries matches my brand perfectly. My clients love the experience, and I love how professional everything looks.",
    rating: 5,
  },
];

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-banner.dim_1200x600.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="absolute top-1/4 right-10 w-px h-32 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/assets/uploads/Black-and-Yellow-Classy-and-Refined-Photography-Logo-1.png"
              alt="U Like Photography Logo"
              className="w-48 h-auto mx-auto mb-6 object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/10 text-xs uppercase tracking-widest mb-6 px-4 py-1"
            >
              AI-Powered Photo Delivery
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Your Memories,
            <br />
            <span className="gold-text-gradient">Instantly Found</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            U Like Photography uses advanced AI face recognition to
            automatically find and deliver your personal photos. Upload once,
            clients find their memories in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/auth" search={{ role: "photographer" }}>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-base gap-2 group"
              >
                <Camera className="w-4 h-4" />
                I'm a Photographer
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth" search={{ role: "client" }}>
              <Button
                size="lg"
                variant="outline"
                className="border-border/70 text-foreground hover:bg-secondary/50 font-semibold px-8 py-6 text-base gap-2 group"
              >
                <Image className="w-4 h-4" />
                Find My Photos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { value: "2M+", label: "Photos Delivered" },
              { value: "15K+", label: "Photographers" },
              { value: "98.7%", label: "AI Accuracy" },
              { value: "< 3s", label: "Delivery Time" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/10 text-xs uppercase tracking-widest mb-4 px-4 py-1"
            >
              Features
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete platform for photographers and their clients.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="luxury-card luxury-card-hover p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/10 text-xs uppercase tracking-widest mb-4 px-4 py-1"
            >
              How It Works
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple. Smart. Seamless.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Photographer workflow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  For Photographers
                </h3>
              </div>
              <div className="space-y-6">
                {photographerSteps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
                      <span className="font-display text-xs font-bold text-primary">
                        {step.step}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/auth" search={{ role: "photographer" }}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    Start as Photographer <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Client workflow */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  For Clients
                </h3>
              </div>
              <div className="space-y-6">
                {clientSteps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
                      <span className="font-display text-xs font-bold text-primary">
                        {step.step}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/auth" search={{ role: "client" }}>
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-secondary/50 gap-2"
                  >
                    Find My Photos <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/10 text-xs uppercase tracking-widest mb-4 px-4 py-1"
            >
              Sample Events
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Beautiful Galleries
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "/assets/generated/sample-wedding.dim_600x400.jpg",
                title: "Sarah & James Wedding",
                date: "November 2025",
                count: 247,
                type: "Wedding",
              },
              {
                img: "/assets/generated/sample-birthday.dim_600x400.jpg",
                title: "Emma's 30th Birthday Gala",
                date: "December 2025",
                count: 128,
                type: "Birthday",
              },
              {
                img: "/assets/generated/sample-graduation.dim_600x400.jpg",
                title: "Harvard Class of 2025",
                date: "May 2025",
                count: 312,
                type: "Graduation",
              },
            ].map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="luxury-card luxury-card-hover overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground text-xs">
                      {event.type}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-foreground mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {event.date}
                    </span>
                    <span className="text-xs text-primary">
                      {event.count} photos
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24 bg-secondary/20" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/10 text-xs uppercase tracking-widest mb-4 px-4 py-1"
            >
              Pricing
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple Pricing
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Free for photographers. Clients pay for their photo packages in
              Rs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Photographer - FREE card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="relative rounded-xl p-8 flex flex-col border-2 border-green-500/60 bg-green-500/5"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-4 text-xs">
                  FREE Forever
                </Badge>
              </div>
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  For Photographers
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Everything you need to deliver photos professionally
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-green-500">
                    FREE
                  </span>
                </div>
              </div>
              <ul className="space-y-3 flex-1 mb-6">
                {[
                  "Unlimited events",
                  "Unlimited photo uploads",
                  "AI face recognition",
                  "Custom branding",
                  "Client gallery sharing",
                  "No subscription fee",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/auth" search={{ role: "photographer" }}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Join Free
                </Button>
              </Link>
            </motion.div>

            {/* Client - Pay per gallery card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative rounded-xl p-8 flex flex-col border-2 border-primary bg-primary/5"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 text-xs">
                  Pay Per Gallery
                </Badge>
              </div>
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  For Clients
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access and download your personal photo memories
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-primary">
                    Starting
                  </span>
                  <span className="font-display text-4xl font-bold text-primary ml-2">
                    ₹99
                  </span>
                </div>
              </div>
              <ul className="space-y-4 flex-1 mb-6">
                {clientPackages.map((pkg) => (
                  <li
                    key={pkg.label}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <span className="font-display text-sm font-bold text-primary w-20 flex-shrink-0">
                      {pkg.price}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-foreground">
                        {pkg.label}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pkg.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/auth" search={{ role: "client" }}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Access My Photos
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="border-primary/40 text-primary bg-primary/10 text-xs uppercase tracking-widest mb-4 px-4 py-1"
            >
              Testimonials
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Loved by Photographers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="luxury-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star
                      key={`star-${testimonial.name}-${j}`}
                      className="w-4 h-4 text-primary fill-primary"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-primary">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, oklch(0.78 0.12 85 / 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 50%, oklch(0.78 0.12 85 / 0.1) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Transform Your{" "}
              <span className="gold-text-gradient">Photography Business</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of photographers using AI to deliver photos faster,
              smarter, and more professionally than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" search={{ role: "photographer" }}>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 py-6 text-base gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Join Free — It's Free for Photographers
                </Button>
              </Link>
              <Link to="/auth" search={{ role: "client" }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary/50 font-semibold px-10 py-6 text-base gap-2"
                >
                  <Image className="w-5 h-5" />
                  Access My Photos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
