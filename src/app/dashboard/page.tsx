
"use client";

import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import PickupRequestForm from '@/components/PickupRequestForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Truck, CheckCircle2, Navigation2, MoreHorizontal, Phone, Star, Leaf, TrendingUp, Sparkles } from 'lucide-react';
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

  // History query for Impact scoring
  const historyQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'jobs'),
      where('customerId', '==', user.uid),
      where('status', 'in', ['COMPLETED']),
      limit(10)
    );
  }, [db, user]);

  const { data: history } = useCollection(historyQuery);

  const totalKgDiverted = history.reduce((acc: number, job: any) => acc + (job.wasteDetails?.weight || 0), 0);
  const impactLevel = Math.floor(totalKgDiverted / 50) + 1;

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto pt-28 pb-12 px-4 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-12">
          
          <div className="lg:col-span-8 space-y-6">
            {activeJob ? (
              <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h1 className="font-headline text-3xl font-black uppercase tracking-tighter">Pickup {activeJob.status}</h1>
                    <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                       <Sparkles className="h-4 w-4 text-primary" /> AI Match: Optimized for {activeJob.wasteDetails?.type}
                    </p>
                  </div>
                  <Badge className="bg-primary px-4 py-1.5 text-white border-none rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Collector arriving</Badge>
                </div>
                
                <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden border-4 border-white uber-shadow bg-muted shadow-2xl">
                  <LiveTrackingMap 
                    center={[activeJob.pickupLocation?.lat || 5.67955, activeJob.pickupLocation?.lng || -0.16421]}
                    pickupPos={[activeJob.pickupLocation?.lat || 5.67955, activeJob.pickupLocation?.lng || -0.16421]}
                    collectorPos={activeJob.liveCollectorLocation ? [activeJob.liveCollectorLocation.lat, activeJob.liveCollectorLocation.lng] : undefined}
                  />
                  
                  {activeJob.collectorId && (
                    <div className="absolute bottom-8 left-8 right-8 z-[1000]">
                      <Card className="bg-white/95 backdrop-blur-md border-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl">
                        <CardContent className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-black/5 bg-muted shadow-inner">
                              <Image 
                                src={`https://picsum.photos/seed/${activeJob.collectorId}/200/200`} 
                                width={200} 
                                height={200} 
                                alt="Driver" 
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-black text-xl uppercase tracking-tighter">{activeJob.collectorName || 'Collector Assigned'}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold mt-1">
                                <Badge variant="outline" className="text-[9px] font-black border-primary text-primary px-2">VERIFIED</Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-primary text-primary" />
                                  <span>4.8 Rating</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                             <a href={`tel:${activeJob.collectorPhone || '0244123456'}`}>
                               <Button size="icon" variant="outline" className="rounded-2xl h-14 w-14 border-2 border-primary text-primary hover:bg-primary/10 transition-all active:scale-90">
                                 <Phone className="h-6 w-6" />
                               </Button>
                             </a>
                             <Button size="icon" className="rounded-2xl h-14 w-14 bg-black text-white hover:bg-black/90 transition-all active:scale-90">
                               <MoreHorizontal className="h-6 w-6" />
                             </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'ETA', val: '4 mins', icon: Clock, color: 'text-blue-500' },
                    { label: 'Network', val: activeJob.status, icon: Truck, color: 'text-primary' },
                    { label: 'AI Class', val: activeJob.wasteDetails?.type || 'Mixed', icon: Sparkles, color: 'text-secondary' },
                    { label: 'Fee', val: `GHS ${activeJob.price || '0'}`, icon: CheckCircle2, color: 'text-green-600' }
                  ].map((item, i) => (
                    <Card key={i} className="uber-shadow border-none rounded-3xl bg-white/50 backdrop-blur-sm border border-white">
                      <CardContent className="p-5 flex flex-col items-center text-center">
                        <div className={`h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center mb-3 ${item.color}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">{item.label}</p>
                        <p className="font-black text-sm uppercase tracking-tight">{item.val}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="font-headline text-5xl font-black tracking-tighter uppercase leading-[0.9]">Request a Mission</h1>
                  <p className="text-muted-foreground font-medium text-lg">AI-powered waste logistics at your doorstep.</p>
                </div>
                <PickupRequestForm />
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="uber-shadow border-none bg-black text-white rounded-[2.5rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Leaf className="h-32 w-32" />
              </div>
              <CardHeader className="relative z-10 p-8">
                <div className="flex items-center gap-2 mb-2">
                   <Leaf className="h-4 w-4 text-secondary" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Sustainability Score</span>
                </div>
                <CardTitle className="font-headline text-3xl font-black uppercase tracking-tighter">Impact Level {impactLevel}</CardTitle>
                <CardDescription className="text-white/50 font-medium">Cleaning Ghana together, one pickup at a time.</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-8 pt-0 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Total Diverted</p>
                    <p className="text-4xl font-black text-secondary">{totalKgDiverted}<span className="text-sm ml-1 opacity-50">kg</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Eco-Points</p>
                    <p className="text-4xl font-black text-primary">{totalKgDiverted * 10}</p>
                  </div>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>Progress to Level {impactLevel + 1}</span>
                      <span>{totalKgDiverted % 50} / 50 kg</span>
                   </div>
                   <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${(totalKgDiverted % 50) * 2}%` }} />
                   </div>
                </div>
                {!activeJob && (
                  <Button variant="outline" className="w-full h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black rounded-2xl text-xs uppercase tracking-widest">
                    <TrendingUp className="mr-2 h-4 w-4" /> View Full Impact Report
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="uber-shadow border-none rounded-[2.5rem]">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="font-headline text-xl uppercase tracking-tighter flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" /> Mission History
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-4">
                {history.length > 0 ? history.map((job: any, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group border-2 border-transparent hover:border-black/5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight">{job.wasteDetails?.type || 'Pickup'}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{job.pickupLocation?.landmark || 'Location'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-secondary">GHS {job.price}</p>
                      <Badge variant="ghost" className="p-0 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </Badge>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-30">
                     <Truck className="h-12 w-12" />
                     <p className="text-[10px] font-black uppercase tracking-widest">No completed missions yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
