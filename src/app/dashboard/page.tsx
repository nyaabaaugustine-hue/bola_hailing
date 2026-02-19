"use client";

import Navigation from '@/components/Navigation';
import PickupRequestForm from '@/components/PickupRequestForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Truck, CheckCircle2, Navigation2, MoreHorizontal, Phone, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { RECENT_PICKUPS, DUMMY_COLLECTORS } from '@/lib/dummy-data';

export default function Dashboard() {
  const [activeJob, setActiveJob] = useState(true);
  const mapImage = PlaceHolderImages.find(img => img.id === 'dashboard-map');
  const activeCollector = DUMMY_COLLECTORS[0];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto py-8 px-4 md:py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Main Content Area (Booking or Tracking) */}
          <div className="lg:col-span-8 space-y-6">
            {activeJob ? (
              <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                  <h1 className="font-headline text-3xl font-bold">Your Pickup is Active</h1>
                  <Badge className="bg-primary px-3 py-1 text-white border-none">{activeCollector.name.split(' ')[0]} is arriving</Badge>
                </div>
                
                {/* Simulated Uber Map */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border uber-shadow bg-muted">
                  {mapImage && (
                    <Image 
                      src={mapImage.imageUrl}
                      alt={mapImage.description}
                      fill
                      className="object-cover opacity-60 grayscale"
                      data-ai-hint={mapImage.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                       <div className="absolute -inset-8 bg-primary/20 rounded-full animate-ping" />
                       <div className="relative bg-primary p-3 rounded-full shadow-xl">
                          <Truck className="h-8 w-8 text-white" />
                       </div>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <Card className="bg-white/95 backdrop-blur border-none shadow-2xl">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                            <Image 
                              src={activeCollector.image} 
                              width={100} 
                              height={100} 
                              alt="Driver" 
                            />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{activeCollector.name}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              <span>{activeCollector.rating} • {activeCollector.vehicle.split('(')[0]}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-primary text-primary">
                             <Phone className="h-5 w-5" />
                           </Button>
                           <Button size="icon" className="rounded-full h-12 w-12 bg-primary text-white">
                             <MoreHorizontal className="h-5 w-5" />
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'ETA', val: '4 mins', icon: Clock },
                    { label: 'Distance', val: '1.2 km', icon: Navigation2 },
                    { label: 'Estimated', val: 'GHS 25', icon: CheckCircle2 },
                    { label: 'Status', val: 'En Route', icon: Truck }
                  ].map((item, i) => (
                    <Card key={i} className="uber-shadow border-none">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <item.icon className="h-5 w-5 text-primary mb-2" />
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">{item.label}</p>
                        <p className="font-bold">{item.val}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold md:text-4xl">Request a Pickup</h1>
                  <p className="text-muted-foreground">Book reliable waste management in seconds.</p>
                </div>
                <PickupRequestForm />
              </div>
            )}
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="uber-shadow border-none bg-secondary text-white">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Your Impact</CardTitle>
                <CardDescription className="text-white/70">Cleaning Ghana together</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold opacity-70">Total Pickups</p>
                    <p className="text-3xl font-black">{RECENT_PICKUPS.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold opacity-70">Weight Diversion</p>
                    <p className="text-3xl font-black">1.2t</p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full bg-white text-secondary hover:bg-white/90 font-bold" onClick={() => setActiveJob(!activeJob)}>
                  {activeJob ? "Book New Pickup" : "View Active Tracking"}
                </Button>
              </CardContent>
            </Card>

            <Card className="uber-shadow border-none">
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> Recent Trips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {RECENT_PICKUPS.map((job, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{job.type}</p>
                        <p className="text-xs text-muted-foreground">{job.loc} • {job.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{job.price}</p>
                      <CheckCircle2 className={`h-4 w-4 ml-auto ${job.status === 'Completed' ? 'text-secondary' : 'text-primary'}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
