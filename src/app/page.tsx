import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  MapPin, 
  Recycle, 
  Zap, 
  ShieldCheck, 
  Smartphone,
  Truck,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-muted/30 -z-10 clip-path-hero hidden lg:block" />
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-6">
                <Badge variant="outline" className="px-5 py-1.5 text-xs font-black uppercase tracking-[0.2em] border-black/10 bg-white/50 backdrop-blur-sm">
                  Service available in Accra & Kumasi
                </Badge>
                <h1 className="font-headline text-6xl font-black leading-[1.05] tracking-tighter md:text-8xl lg:text-9xl">
                  Order a <br /><span className="text-primary italic">Pickup</span>. <br />Anytime.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
                  The smartest way to manage waste in Ghana. AI classification, dynamic pricing, and real-time tracking at your fingertips.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/dashboard">
                  <Button size="lg" className="h-16 px-10 text-lg font-bold bg-black text-white hover:bg-black/90 shadow-2xl btn-hover-effect rounded-2xl">
                    Request a Pickup <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Link href="/collector">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-black/10 hover:bg-black/5 rounded-2xl">
                    Become a Collector
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-10 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black">10k+</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pickups Done</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-black">98%</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Rating</span>
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
              <div className="absolute -bottom-10 -left-10 bg-black text-white p-8 rounded-[2rem] shadow-2xl hidden md:block animate-bounce-subtle">
                <Truck className="h-10 w-10 text-primary mb-4" />
                <p className="text-sm font-black uppercase tracking-widest opacity-60">Live Status</p>
                <p className="text-xl font-bold">142 Trucks Active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-black text-white py-32 md:py-48">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl space-y-4 mb-24">
            <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Built for the <br />Ghanaian context.
            </h2>
            <p className="text-xl text-white/50 max-w-xl">We understand the local landscape. Our tools are designed to work exactly where you are.</p>
          </div>
          
          <div className="grid gap-px bg-white/10 border border-white/10 rounded-[2.5rem] overflow-hidden">
            <div className="grid md:grid-cols-3">
              {[
                { icon: MapPin, title: 'Landmark Addressing', desc: 'No street name? No problem. Just say "Behind Melcom" and we will find you.' },
                { icon: Zap, title: 'AI Trash Scanning', desc: 'Snap a photo of your waste. Our AI classifies it and gives you a fair price instantly.' },
                { icon: Globe, title: 'Network Optimized', desc: 'Low bandwidth? USSD and Lite versions ensure you can always book a pickup.' }
              ].map((f, i) => (
                <div key={i} className="p-12 space-y-6 hover:bg-white/5 transition-colors group">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{f.title}</h3>
                  <p className="text-white/40 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <Card className="rounded-[3rem] border-none uber-shadow overflow-hidden bg-primary/5">
            <CardContent className="p-16 grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                  Order. <br />Track. <br />Clean.
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-white mt-1">1</div>
                    <p className="font-bold text-lg">Snap a photo of your waste accumulation.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-white mt-1">2</div>
                    <p className="font-bold text-lg">Get matched with a verified local collector.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-white mt-1">3</div>
                    <p className="font-bold text-lg">Track the truck arrival and pay digitally.</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative h-full w-full rounded-[2.5rem] bg-white uber-shadow border p-12 flex flex-col justify-between">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 bg-black rounded-full" />
                         <div>
                            <p className="text-xs font-black uppercase opacity-60">Driver</p>
                            <p className="font-bold">Kojo Mensah</p>
                         </div>
                      </div>
                      <Badge className="bg-secondary text-white border-none">8 MINS AWAY</Badge>
                   </div>
                   <div className="h-32 w-full bg-muted rounded-2xl relative overflow-hidden">
                      <Image src="https://picsum.photos/seed/map-tiny/600/300" alt="Map" fill className="object-cover opacity-50 grayscale" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="h-4 w-4 bg-primary rounded-full animate-ping" />
                      </div>
                   </div>
                   <Button className="w-full h-14 rounded-2xl bg-black text-white font-black">TRACK LIVE</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-24">
        <div className="container mx-auto px-4 grid gap-16 md:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-headline text-3xl font-black uppercase">Borla<span className="text-primary">Haze</span></span>
            </Link>
            <p className="text-white/40 font-medium">Sustainable waste management infrastructure for a cleaner Ghana.</p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-6">Service</h4>
            <ul className="space-y-4 font-bold">
              <li><Link href="/dashboard" className="hover:text-primary">Order Pickup</Link></li>
              <li><Link href="#" className="hover:text-primary">Commercial</Link></li>
              <li><Link href="/collector" className="hover:text-primary">Become a Driver</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-6">Company</h4>
            <ul className="space-y-4 font-bold">
              <li><Link href="#" className="hover:text-primary">Impact</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-white/40 mb-6">Social</h4>
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-white/10 rounded-full hover:bg-primary transition-colors cursor-pointer" />
              <div className="h-10 w-10 bg-white/10 rounded-full hover:bg-primary transition-colors cursor-pointer" />
              <div className="h-10 w-10 bg-white/10 rounded-full hover:bg-primary transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24 pt-8 border-t border-white/10 text-center text-xs font-black uppercase tracking-widest text-white/20">
          © 2025 BorlaHaze. Proudly made in Accra.
        </div>
      </footer>
    </div>
  );
}