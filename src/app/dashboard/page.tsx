
"use client";

import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import PickupRequestForm from '@/components/PickupRequestForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Truck, CheckCircle2, Navigation2, MoreHorizontal, Phone, Star } from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { collection, query, where, limit } from 'firebase/firestore';
import { useFirestore, useUser, useCollection } from '@/firebase';

const LiveTrackingMap = dynamic(() => import('@/components/LiveTrackingMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-xs opacity-40">Initializing Fleet Map...</div>
});

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Real-time tracking of the active job
  const activeJobQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'jobs'),
      where('customerId', '==', user.uid),
      where('status', 'not-in', ['COMPLETED', 'CANCELLED']),
      limit(1)
    );
  }, [db, user]);

  const { data: activeJobs } = useCollection(activeJobQuery);
  const activeJob = activeJobs[0] as any;

  // History query
  const historyQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'jobs'),
      where('customerId', '==', user.uid),
      where('status', 'in', ['COMPLETED']),
      limit(5)
    );
  }, [db, user]);

  const { data: history } = useCollection(historyQuery);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto pt-28 pb-12 px-4 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-12">
          
          <div className="lg:col-span-8 space-y-6">
            {activeJob ? (
              <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                  <h1 className="font-headline text-3xl font-bold">Pickup is {activeJob.status}</h1>
                  <Badge className="bg-primary px-3 py-1 text-white border-none">Collector arriving</Badge>
                </div>
                
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border uber-shadow bg-muted shadow-2xl">
                  <LiveTrackingMap 
                    center={[activeJob.pickupLocation?.lat || 5.67955, activeJob.pickupLocation?.lng || -0.16421]}
                    pickupPos={[activeJob.pickupLocation?.lat || 5.67955, activeJob.pickupLocation?.lng || -0.16421]}
                    collectorPos={activeJob.liveCollectorLocation ? [activeJob.liveCollectorLocation.lat, activeJob.liveCollectorLocation.lng] : undefined}
                  />
                  
                  {activeJob.collectorId && (
                    <div className="absolute bottom-6 left-6 right-6 z-[1000]">
                      <Card className="bg-white/95 backdrop-blur border-none shadow-2xl">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary bg-muted">
                              <Image 
                                src={`https://picsum.photos/seed/${activeJob.collectorId}/100/100`} 
                                width={100} 
                                height={100} 
                                alt="Driver" 
                              />
                            </div>
                            <div>
                              <p className="font-bold text-lg">Collector Assigned</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                <span>4.8 Rating</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <a href={`tel:0244123456`}>
                               <Button size="icon" variant="outline" className="rounded-full h-12 w-12 border-primary text-primary hover:bg-primary/10">
                                 <Phone className="h-5 w-5" />
                               </Button>
                             </a>
                             <Button size="icon" className="rounded-full h-12 w-12 bg-primary text-white">
                               <MoreHorizontal className="h-5 w-5" />
                             </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'ETA', val: '4 mins', icon: Clock },
                    { label: 'Status', val: activeJob.status, icon: Truck },
                    { label: 'Waste', val: activeJob.wasteDetails?.type || 'Mixed', icon: CheckCircle2 },
                    { label: 'Amount', val: `GHS ${activeJob.price || '0'}`, icon: MapPin }
                  ].map((item, i) => (
                    <Card key={i} className="uber-shadow border-none">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <item.icon className={`h-5 w-5 mb-2 text-primary`} />
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

          <div className="lg:col-span-4 space-y-6">
            <Card className="uber-shadow border-none bg-secondary text-white">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Your Impact</CardTitle>
                <CardDescription className="text-white/70">Cleaning Ghana together</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold opacity-70">Pickups</p>
                    <p className="text-3xl font-black">{history.length}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold opacity-70">Impact</p>
                    <p className="text-3xl font-black">Level 1</p>
                  </div>
                </div>
                {!activeJob && (
                  <Button variant="secondary" className="w-full bg-white text-secondary hover:bg-white/90 font-bold">
                    View Impact Report
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="uber-shadow border-none">
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" /> History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {history.length > 0 ? history.map((job: any, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{job.wasteDetails?.type || 'Pickup'}</p>
                        <p className="text-xs text-muted-foreground">{job.pickupLocation?.address || 'Location'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">GHS {job.price}</p>
                      <CheckCircle2 className="h-4 w-4 ml-auto text-secondary" />
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-center text-muted-foreground py-4">No recent trips.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
