
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Smartphone,
  Truck,
  Zap,
  ShieldCheck,
  Globe,
  Info
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <Navigation />
      
      {/* Hero Section - Grand Height Optimized for Visual Impact */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-48 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-muted/30 -z-10 hidden lg:block rounded-bl-[10rem]" />
        
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Text Content */}
            <div className="lg:col-span-6 space-y-10 relative z-10">
              <div className="space-y-6">
                <Badge variant="outline" className="px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border-black/10 bg-white/50 backdrop-blur-sm">
                  Service available in Accra & Kumasi 🇬🇭
                </Badge>
                <h1 className="font-headline text-6xl font-black leading-[1.05] tracking-tighter md:text-8xl lg:text-9xl flex flex-col">
                  <span>Trash Hailing</span>
                  {/* Reduced 'Reimagined' text size for sophisticated hierarchy */}
                  <span className="text-primary italic text-3xl md:text-5xl lg:text-6xl mt-2">Reimagined.</span>
                </h1>
                <div className="space-y-4 max-w-xl">
                  <p className="text-2xl font-black text-black leading-tight">
                    Clean surroundings are just a tap away.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    DEMO connects you to the nearest waste collectors instantly. Smart classification, fair pricing, and reliable service at your doorstep.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/login">
                  <Button size="lg" className="h-16 px-10 text-lg font-bold bg-black text-white hover:bg-black/90 shadow-2xl btn-hover-effect rounded-2xl">
                    Book a Pickup Now <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Link href="/collector">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-black/10 hover:bg-black/5 rounded-2xl">
                    Become a Collector
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">USSD Support (*713#)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Verified Operators</span>
                </div>
              </div>
            </div>

            {/* Enlarged Image Content */}
            <div className="lg:col-span-6 relative lg:-mr-20">
              <div className="aspect-[4/3] lg:aspect-square w-full rounded-[3rem] overflow-hidden shadow-[0_50px_120px_-30px_rgba(0,0,0,0.2)] border-[12px] border-white relative">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt={heroImage.description} 
                    fill 
                    className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
                    priority
                    data-ai-hint="garbage truck"
                  />
                )}
                
                {/* Overlay Badge for Image */}
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl hidden md:block">
                  <div className="flex items-center gap-3">
                     <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white">
                        <Truck className="h-6 w-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Active Network</p>
                        <p className="font-bold text-lg">142 Trucks Live</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating card */}
              <div className="absolute -bottom-10 -left-10 bg-black text-white p-8 rounded-[2.5rem] shadow-2xl hidden xl:block border-4 border-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">System Operational</span>
                  </div>
                  <p className="text-2xl font-black">98.4% Efficiency</p>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[98.4%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section className="bg-black text-white py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Ghana's Most Reliable Waste Network.</h2>
            <p className="text-xl text-white/60 max-w-2xl font-medium">Powering commercial fleets and household pickups with one unified platform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Instant Dispatch", desc: "Matched with the nearest truck in under 60 seconds." },
              { icon: Globe, title: "Landmark Resolution", desc: "No digital address? Our AI understands local landmarks." },
              { icon: ShieldCheck, title: "Safety First", desc: "Every collector is vetted, rated, and GPS-tracked." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-12 rounded-[2.5rem] bg-muted/50 border-2 border-black/5 space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tighter">For Households</h3>
                <p className="text-xl font-bold text-primary">On-Demand Convenience</p>
                <p className="text-muted-foreground font-medium">Schedule a pickup for your weekly refuse or one-off cleanup. Pay with MoMo or Card instantly.</p>
              </div>
              <Button variant="link" className="p-0 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                Learn more <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-12 rounded-[2.5rem] bg-black text-white space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tighter">For Business</h3>
                <p className="text-xl font-bold text-secondary">Fleet Management</p>
                <p className="text-white/60 font-medium">Enterprise-grade tools for waste management companies to track, optimize, and scale their operations.</p>
              </div>
              <Button variant="link" className="p-0 font-black uppercase text-xs tracking-widest text-white flex items-center gap-2">
                Partner with us <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-24 border-t border-white/10">
        <div className="container mx-auto px-4 grid gap-16 md:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-headline text-3xl font-black uppercase">DEMO</span>
            </Link>
            <p className="text-white/40 font-medium">Sustainable infrastructure for a cleaner, smarter Ghana.</p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-6">Service</h4>
            <ul className="space-y-4 font-bold">
              <li><Link href="/dashboard" className="hover:text-primary">Order Pickup</Link></li>
              <li><Link href="#" className="hover:text-primary">Commercial Solutions</Link></li>
              <li><Link href="/collector" className="hover:text-primary">Drive With Us</Link></li>
              <li><Link href="#" className="hover:text-primary">USSD Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-6">Company</h4>
            <ul className="space-y-4 font-bold">
              <li><Link href="#" className="hover:text-primary">About Impact</Link></li>
              <li><Link href="#" className="hover:text-primary">Safety Standards</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-6">Connect</h4>
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-white/10 rounded-full hover:bg-primary transition-colors cursor-pointer flex items-center justify-center">
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="h-10 w-10 bg-white/10 rounded-full hover:bg-primary transition-colors cursor-pointer flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24 pt-8 border-t border-white/10 text-center text-[10px] font-black uppercase tracking-widest text-white/20">
          © 2025 DEMO. Made in Accra.
        </div>
      </footer>
    </div>
  );
}
