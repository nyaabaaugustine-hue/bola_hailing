import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Smartphone,
  Truck,
  ShieldCheck,
  Globe,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <Navigation />
      
      <section className="relative pt-48 pb-32 md:pt-64 md:pb-48 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-muted/30 -z-10 hidden lg:block rounded-bl-[10rem]" />
        
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-12 relative z-10">
              <div className="space-y-6">
                <Badge variant="outline" className="px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] border-black/10 bg-white/50 backdrop-blur-sm">
                  Service available in Accra & Kumasi 🇬🇭
                </Badge>
                <h1 className="font-headline text-6xl font-black leading-[1.05] tracking-tighter md:text-8xl lg:text-9xl flex flex-col">
                  <span>Trash Hailing</span>
                  <span className="text-primary italic text-3xl md:text-5xl lg:text-6xl mt-4">Reimagined.</span>
                </h1>
                <div className="space-y-6 max-w-xl">
                  <p className="text-2xl font-black text-foreground leading-tight">
                    Clean surroundings are just a tap away.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    Our platform connects you to the nearest waste collectors instantly. Smart classification, fair pricing, and reliable service at your doorstep.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/login">
                  <Button size="lg" className="h-18 px-12 text-xl font-black bg-black text-white dark:bg-primary dark:text-primary-foreground shadow-2xl btn-hover-effect rounded-2xl">
                    Get Started <ArrowRight className="ml-3 h-7 w-7" />
                  </Button>
                </Link>
                <Link href="/collector">
                  <Button size="lg" variant="outline" className="h-18 px-12 text-xl font-black border-black/10 hover:bg-black/5 rounded-2xl">
                    Become a Collector
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-10 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest opacity-70">USSD Support (*713#)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest opacity-70">Verified Operators</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative lg:-mr-20">
              <div className="aspect-[4/3] lg:aspect-square w-full rounded-[4rem] overflow-hidden shadow-[0_60px_140px_-40px_rgba(0,0,0,0.25)] border-[16px] border-white dark:border-muted relative">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt={heroImage.description} 
                    fill 
                    className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                    priority
                  />
                )}
                
                <div className="absolute top-10 left-10 bg-white/95 dark:bg-black/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl hidden md:block">
                  <div className="flex items-center gap-5">
                     <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                        <Truck className="h-8 w-8" />
                     </div>
                     <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Network</p>
                        <p className="font-black text-2xl tracking-tight">142 Trucks Live</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-12 -left-12 bg-black text-white p-10 rounded-[3rem] shadow-3xl hidden xl:block border-8 border-white dark:border-muted">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-4 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">System Operational</span>
                  </div>
                  <p className="text-3xl font-black tracking-tighter text-secondary">98.4% Efficiency</p>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[98.4%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-40">
        <div className="container mx-auto px-4">
          <div className="mb-20 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Reliable Waste Management Infrastructure</h2>
            <p className="text-2xl text-white/60 max-w-3xl font-medium leading-relaxed">Powering commercial fleets and household pickups with one unified platform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Zap, title: "Instant Dispatch", desc: "Matched with the nearest truck in under 60 seconds." },
              { icon: Globe, title: "Landmark Resolution", desc: "No digital address? Our AI understands local landmarks." },
              { icon: ShieldCheck, title: "Safety First", desc: "Every collector is vetted, rated, and GPS-tracked." }
            ].map((feature, i) => (
              <div key={i} className="space-y-6 group">
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{feature.title}</h3>
                <p className="text-xl text-white/40 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-32 border-t border-white/10">
        <div className="container mx-auto px-4 grid gap-20 md:grid-cols-4">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              {logo && (
                <div className="relative h-24 w-24 overflow-hidden rounded-[7%]">
                  <Image src={logo.imageUrl} alt="WasteGo" fill className="object-contain" />
                </div>
              )}
            </Link>
            <p className="text-xl text-white/40 font-medium leading-relaxed">Sustainable infrastructure for a cleaner, smarter Ghana.</p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.3em] text-[11px] text-white/40 mb-10">Service</h4>
            <ul className="space-y-6 font-black text-lg uppercase tracking-tight">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Order Pickup</Link></li>
              <li><Link href="/collector" className="hover:text-primary transition-colors">Drive With Us</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Command</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.3em] text-[11px] text-white/40 mb-10">Company</h4>
            <ul className="space-y-6 font-black text-lg uppercase tracking-tight">
              <li><Link href="#" className="hover:text-primary transition-colors">Safety Standards</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms & Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-[0.3em] text-[11px] text-white/40 mb-10">Connect</h4>
            <div className="flex gap-6">
              <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer flex items-center justify-center shadow-lg">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer flex items-center justify-center shadow-lg">
                <Globe className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-32 pt-10 border-t border-white/10 text-center text-[11px] font-black uppercase tracking-[0.4em] text-white/20">
          © 2026 WasteGo. Made in Accra.
        </div>
      </footer>
    </div>
  );
}