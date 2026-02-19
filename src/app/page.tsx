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
  ChevronRight,
  Truck
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
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-1 text-sm font-medium bg-secondary/10 text-secondary border-secondary/20">
                  Trash Hailing Reimagined for Ghana 🇬🇭
                </Badge>
                <h1 className="font-headline text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                  Clean surroundings are just a <span className="text-primary italic">tap away.</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  BorlaHaze connects you to the nearest waste collectors instantly. 
                  Smart classification, fair pricing, and reliable service at your doorstep.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                    Book a Pickup Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-secondary text-secondary hover:bg-secondary/5">
                  Become a Collector
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" /> USSD Support (*XXX#)
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-secondary" /> Verified Operators
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto">
              <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl" />
              <div className="relative h-full w-full overflow-hidden rounded-3xl border shadow-2xl">
                {heroImage && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt={heroImage.description} 
                    fill 
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">One Platform, Every Waste Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From households to construction sites, we've got you covered.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MapPin, title: 'Landmark-Based Addressing', desc: 'No digital address? No problem. Use "Behind Melcom" or "Total Junction" to pinpoint your pickup.' },
              { icon: Zap, title: 'AI Waste Classification', desc: 'Snap a photo of your trash. Our AI identifies sachet plastics, coconut husks, and organics for better sorting.' },
              { icon: Recycle, title: 'Eco-Friendly Disposal', desc: 'We route your waste to authorized landfills and recycling hubs, ensuring environmental sustainability.' },
              { icon: Smartphone, title: 'Mobile Money Ready', desc: 'Pay seamlessly with MTN MoMo, Telecel Cash, or AirtelTigo. Cash on pickup is always an option.' },
              { icon: Zap, title: 'Dynamic Pricing', desc: 'Fair, transparent pricing based on volume, weight, and distance. No hidden fees.' },
              { icon: Truck, title: 'Real-time Tracking', desc: 'Watch your collector arrive in real-time. Fast response times across all major cities in Ghana.' }
            ].map((service, i) => (
              <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-background">
                <CardContent className="pt-8 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-xl font-bold">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-secondary p-8 md:p-16 text-center text-secondary-foreground shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <h2 className="font-headline text-4xl font-extrabold md:text-5xl leading-tight">Ready to make Ghana cleaner?</h2>
              <p className="text-xl opacity-90 leading-relaxed">Join thousands of households and businesses managing waste responsibly with BorlaHaze.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-secondary hover:bg-white/90">
                    Get Started Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-white text-white hover:bg-white/10">
                  Download the App
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <Recycle className="h-5 w-5" />
              </div>
              <span className="font-headline text-xl font-bold tracking-tight">
                Borla<span className="text-primary">Haze</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">Cleaning Ghana, one tap at a time. Sustainable waste management for all.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Request Pickup</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Commercial Waste</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Landfills</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Impact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Facebook</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2025 BorlaHaze. Made with ❤️ in Accra.
        </div>
      </footer>
    </div>
  );
}
