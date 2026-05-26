import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, BarChart3, Users, Building, ShieldCheck, Smartphone, Quote, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Best School Management System ERP in India | LearnNext",
  description: "LearnNext is the ultimate cloud-based School Management ERP System. Automate admissions, fees, attendance, payroll, and inventory with a premium SaaS platform.",
  keywords: "School ERP, School Management System, Student Information System, Online Fee Payment, School Software, Best ERP for Schools in India",
  openGraph: {
    title: "LearnNext: Run Your School Like a Product",
    description: "Empower your educational institution with our cutting-edge SaaS ERP. Real-time P&L analytics, parent portals, and dynamic role management.",
    url: "https://learnnext.com",
    siteName: "LearnNext ERP",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnNext | The Premium School ERP",
    description: "Automate your school administration today with LearnNext.",
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-[-1] bg-grid-fade bg-[size:32px_32px] opacity-30" />
      <div className="fixed left-[-12rem] top-[-12rem] z-[-1] h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      <div className="fixed bottom-[-12rem] right-[-10rem] z-[-1] h-96 w-96 rounded-full bg-accent/15 blur-[100px]" />
      <div className="fixed top-[40%] right-[-5rem] z-[-1] h-64 w-64 rounded-full bg-success/5 blur-[100px]" />

      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-heading text-xl font-bold tracking-tight">LearnNext</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Testimonials</Link>
            <Link href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="shadow-md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* --- HERO SECTION --- */}
        <section className="py-24 text-center lg:py-32 animate-enter">
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground shadow-sm backdrop-blur transition-transform hover:scale-105">
            <span className="rounded-full bg-primary/10 p-1.5 text-primary">
              <Star className="h-3.5 w-3.5 fill-primary" />
            </span>
            #1 Rated SaaS for Schools
          </div>

          <h1 className="mx-auto mt-8 max-w-4xl font-heading text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">School Management</span> System
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            Replace dozens of outdated software tools with one unified, premium SaaS platform. Automate admissions, track fees, manage inventory, and delight parents.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                Explore Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base backdrop-blur bg-background/50">
                Book a Demo
              </Button>
            </Link>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="py-24 border-t border-border/50">
          <header className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Why Choose LearnNext ERP?</h2>
            <p className="mt-4 text-muted-foreground">Built for modern educational institutions that value efficiency and aesthetics.</p>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BarChart3, title: "Real-time P&L Analytics", color: "text-primary", bg: "bg-primary/10", text: "As a school owner, you need to know your financial health. Our dashboard instantly calculates Income, Expenses, and Payroll to give you real-time Profit & Loss reports." },
              { icon: Users, title: "Parent & Student Portals", color: "text-success", bg: "bg-success/10", text: "Provide a premium experience. Students get a dedicated UI without administrative clutter—seeing only their pending homework, upcoming exams, fee schedules, and report cards." },
              { icon: Building, title: "Multi-Tenant SaaS", color: "text-warning", bg: "bg-warning/10", text: "Managing a chain of schools? LearnNext is built with strict multi-tenancy. A Super Admin can effortlessly onboard multiple branches, each with perfectly isolated databases." },
              { icon: ShieldCheck, title: "Dynamic Permissions", color: "text-accent", bg: "bg-accent/10", text: "Don't settle for hardcoded roles. Create custom roles like 'Accountant' or 'Librarian' and assign dynamic JSON-based permissions to control exactly what they can edit." },
              { icon: GraduationCap, title: "Alumni & Inventory", color: "text-danger", bg: "bg-danger/10", text: "Stay connected with passed-out students via our Alumni network. Plus, track every asset—from library books and lab microscopes to school uniforms—using advanced Inventory tracking." },
              { icon: Smartphone, title: "Fully Responsive & Export Ready", color: "text-primary", bg: "bg-primary/10", text: "Built with mobile-first Tailwind CSS. Whether on an iPad or desktop, it looks flawless. Export any data to CSV or beautifully formatted PDF files instantly." }
            ].map((feature, idx) => (
              <div key={idx} className="rounded-3xl border border-border/60 bg-card/40 p-8 shadow-panel backdrop-blur transition-all hover:-translate-y-1 hover:bg-card/60">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- DEEP DIVE SECTION --- */}
        <section className="py-24">
          <div className="rounded-[2.5rem] bg-secondary/30 p-8 md:p-16 border border-border/50 backdrop-blur-sm">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="font-heading text-3xl font-bold mb-6">Designed for Excellence. Engineered for Scale.</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Most school management software in the market is clunky, slow, and hard to use. We built LearnNext to solve this. Using the latest Next.js 15, React 19, and Node.js architectures, we deliver a <strong>blazing fast</strong> experience.
                </p>
                <ul className="space-y-4">
                  {[
                    "Automated Fee Collection & Defaulter Reminders",
                    "HR Payroll, Salary Slips, & Leave Management",
                    "Transport Routing & Hostel Allocations",
                    "One-click PDF Report Card Generation",
                    "End-to-End Secure File Uploads (Images/Documents)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-medium text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 flex flex-col items-center justify-center p-8 text-center">
                    <BarChart3 className="h-24 w-24 text-primary/50 mb-6 drop-shadow-lg" />
                    <p className="font-heading text-2xl font-bold">Premium UI/UX</p>
                    <p className="text-sm text-muted-foreground mt-2">Data visualization that makes sense.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS SECTION --- */}
        <section id="testimonials" className="py-24 border-t border-border/50">
          <header className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Trusted by 50+ Institutions</h2>
            <p className="mt-4 text-muted-foreground">See what school leaders are saying about LearnNext.</p>
          </header>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: "Dr. Sharma", role: "Principal, Delhi Public Academy", text: "LearnNext changed everything. The P&L analytics let me track our financial health daily. The UI is incredibly beautiful and intuitive." },
              { name: "Mrs. Gupta", role: "Admin Head, Global Edge School", text: "We used to struggle with inventory and transport tracking. Now, it's all in one place. Parents love the dedicated student portals!" },
              { name: "Mr. Verma", role: "Director, Sunshine Group of Schools", text: "The multi-tenant feature is a game changer for our 5 branches. Super admin dashboard gives me bird's-eye view of everything." }
            ].map((review, idx) => (
              <div key={idx} className="relative rounded-3xl border border-border/60 bg-card/40 p-8 shadow-sm backdrop-blur">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm text-foreground leading-relaxed italic mb-6">"{review.text}"</p>
                <div>
                  <p className="font-heading font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section id="pricing" className="py-24 border-t border-border/50">
          <header className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-muted-foreground">Choose the plan that fits your institution's size.</p>
          </header>

          <div className="grid gap-8 md:grid-cols-3 items-center max-w-5xl mx-auto">
            {/* Basic */}
            <div className="rounded-3xl border border-border/60 bg-card/40 p-8 shadow-sm backdrop-blur">
              <h3 className="font-heading text-xl font-bold">Basic</h3>
              <p className="text-sm text-muted-foreground mt-2">For small schools</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">₹2,000</span>
                <span className="text-sm font-semibold text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Up to 500 Students</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Admissions & Fees</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Basic Attendance</li>
              </ul>
              <Button className="mt-8 w-full" variant="outline">Get Started</Button>
            </div>

            {/* Premium */}
            <div className="rounded-3xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10 backdrop-blur relative transform md:-translate-y-4">
              <div className="absolute top-0 right-6 transform -translate-y-1/2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">Most Popular</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-primary">Premium</h3>
              <p className="text-sm text-muted-foreground mt-2">For growing schools</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">₹5,000</span>
                <span className="text-sm font-semibold text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Unlimited Students</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> HR Payroll & Inventory</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> P&L Analytics</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Transport & Hostel</li>
              </ul>
              <Button className="mt-8 w-full">Start Free Trial</Button>
            </div>

            {/* Enterprise */}
            <div className="rounded-3xl border border-border/60 bg-card/40 p-8 shadow-sm backdrop-blur">
              <h3 className="font-heading text-xl font-bold">Enterprise</h3>
              <p className="text-sm text-muted-foreground mt-2">For school chains</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight">Custom</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Multi-Tenant Architecture</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Super Admin SaaS Panel</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Custom Domain</li>
              </ul>
              <Button className="mt-8 w-full" variant="outline">Contact Sales</Button>
            </div>
          </div>
        </section>

        {/* --- CONTACT / DEMO FORM --- */}
        <section id="contact" className="py-24 border-t border-border/50">
          <div className="max-w-xl mx-auto rounded-[2.5rem] bg-card border border-border/60 p-8 md:p-12 shadow-2xl backdrop-blur">
            <header className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold">Book a Live Demo</h2>
              <p className="mt-2 text-sm text-muted-foreground">Drop your details below and our team will get in touch shortly.</p>
            </header>
            
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Name</label>
                  <input type="text" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">School Name</label>
                  <input type="text" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="Delhi Public School" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <input type="email" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="john@school.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                <input type="tel" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" placeholder="+91 98765 43210" />
              </div>
              <Button type="button" className="w-full h-12 mt-4 text-base">
                Request Demo
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="rounded-xl bg-primary/10 p-1.5 text-primary">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <span className="font-heading text-lg font-bold">LearnNext</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The most advanced cloud ERP system for modern educational institutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LearnNext ERP. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
               <span className="text-sm hover:text-foreground cursor-pointer">Twitter</span>
               <span className="text-sm hover:text-foreground cursor-pointer">LinkedIn</span>
               <span className="text-sm hover:text-foreground cursor-pointer">Facebook</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
