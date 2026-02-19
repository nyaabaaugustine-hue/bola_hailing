
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Smartphone,
  Truck,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-muted/30 -z-10 hidden lg:block" />
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-6">
                <Badge variant="outline" className="px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border-black/10 bg-white/50 backdrop-blur-sm">
                  Service available in Accra & Kumasi 🇬🇭
                </Badge>
                <h1 className="font-headline text-6xl font-black leading-[1.05] tracking-tighter md:text-8xl lg:text-9xl">
                  Trash Hailing <br /><span className="text-primary italic">Reimagined</span>.
                </h1>
                <div className="space-y-4 max-w-xl">
                  <p className="text-2xl font-black text-black leading-tight">
                    Clean surroundings are just a tap away.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    BorlaHaze connects you to the nearest waste collectors instantly. Smart classification, fair pricing, and reliable service at your doorstep.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/dashboard">
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

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt={heroImage.description} 
                    fill 
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
              </div>
              <div className="absolute -bottom-10 -left-10 bg-black text-white p-8 rounded-[2rem] shadow-2xl hidden md:block">
                <Truck className="h-10 w-10 text-primary mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Fleet Live</p>
                <p className="text-xl font-bold">142 Trucks Online</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features */}
      <section className="bg-black text-white py-32">
        <div className="container mx-auto px-4">
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

      {/* Impact Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-20">
            <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter">Ghana's Most Reliable <span className="text-secondary italic">Waste Network</span>.</h2>
            <p className="text-xl text-muted-foreground font-medium">Powering commercial fleets and household pickups with one unified platform.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10">
            <Card className="rounded-[3rem] border-none uber-shadow bg-muted/30 p-12 space-y-6">
              <Badge className="bg-primary text-white border-none uppercase tracking-widest px-4 py-1">For Households</Badge>
              <h3 className="text-4xl font-black tracking-tighter">On-Demand Convenience</h3>
              <p className="text-lg text-muted-foreground">Schedule a pickup for your weekly refuse or one-off cleanup. Pay with MoMo or Card instantly.</p>
              <Button variant="link" className="p-0 text-lg font-black text-black group">
                Learn more <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
            <Card className="rounded-[3rem] border-none uber-shadow bg-black text-white p-12 space-y-6">
              <Badge className="bg-secondary text-white border-none uppercase tracking-widest px-4 py-1">For Business</Badge>
              <h3 className="text-4xl font-black tracking-tighter">Fleet Management</h3>
              <p className="text-lg text-white/50">Enterprise-grade tools for waste management companies to track, optimize, and scale their operations.</p>
              <Button variant="link" className="p-0 text-lg font-black text-white group">
                Partner with us <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-24 border-t border-white/10">
        <div className="container mx-auto px-4 grid gap-16 md:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-headline text-3xl font-black uppercase">Borla<span className="text-primary">Haze</span></span>
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
          © 2025 BorlaHaze. Made in Accra.
        </div>
      </footer>
    </div>
  );
}
