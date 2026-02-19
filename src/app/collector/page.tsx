
"use client";

import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Truck, Navigation2, MapPin, Camera, Fuel, Phone, Power, User, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { DEMO_COLLECTOR } from '@/lib/dummy-data';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, where, doc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function CollectorPage() {
  const { user: authUser } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  
  const activeUser = DEMO_COLLECTOR;

  // Listen for active jobs assigned to this collector or pending requested jobs
  const pendingJobsQuery = query(
    collection(db, 'jobs'),
    where('status', '==', 'APPROVED'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  
  const activeJobQuery = useMemo(() => {
    if (!authUser) return null;
    return query(
      collection(db, 'jobs'),
      where('collectorId', '==', authUser.uid),
      where('status', 'in', ['MATCHED', 'EN_ROUTE', 'ARRIVED']),
      limit(1)
    );
  }, [db, authUser]);

  const { data: pendingJobs, loading: pendingLoading } = useCollection(pendingJobsQuery);
  const { data: activeJobs, loading: activeLoading } = useCollection(activeJobQuery);

  const pendingJob = pendingJobs[0] as any;
  const activeJob = activeJobs[0] as any;

  const handleAcceptJob = async (jobId: string) => {
    if (!authUser) return;
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        status: 'MATCHED',
        collectorId: authUser.uid,
        collectorName: authUser.displayName || 'Kwame Mensah',
        liveCollectorLocation: {
          lat: 5.67691,
          lng: -0.16240
        }
      });
      toast({ title: "Job Accepted", description: "Navigate to the pickup location." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to accept job." });
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, { status: 'COMPLETED' });
      toast({ title: "Mission Accomplished", description: "Earnings credited to your wallet." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to complete job." });
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      
      <div className={`transition-colors duration-500 pt-32 pb-6 ${isOnline ? 'bg-secondary' : 'bg-muted'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
             <div className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center ${isOnline ? 'bg-white/20' : 'bg-black/20 text-muted-foreground'}`}>
                <Image src={activeUser.image} width={40} height={40} alt="Profile" className="object-cover" />
             </div>
             <div>
                <p className="font-bold text-lg">Good morning, {activeUser.name.split(' ')[0]}</p>
                <p className="text-xs opacity-70">{isOnline ? 'You are online and active' : 'You are offline'}</p>
             </div>
          </div>
          <div className="flex items-center gap-4 bg-black/10 px-6 py-2 rounded-full backdrop-blur-md">
             <span className="font-bold text-sm tracking-widest">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
             <Switch 
                checked={isOnline} 
                onCheckedChange={setIsOnline}
                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20 [&_span]:data-[state=checked]:bg-secondary" 
              />
          </div>
        </div>
      </div>

      <main className="container mx-auto py-8 px-4 md:py-12">
        {!isOnline ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in zoom-in-95">
             <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <Power className="h-12 w-12" />
             </div>
             <div className="space-y-2">
                <h1 className="text-3xl font-black">Ready to Earn?</h1>
                <p className="text-muted-foreground max-w-sm">Switch your status to online to start receiving trash pickup requests in your area.</p>
             </div>
             <Button size="lg" className="rounded-full px-12 h-14 bg-secondary font-black" onClick={() => setIsOnline(true)}>GO ONLINE</Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12 animate-in slide-in-from-bottom-4 duration-500">
            
            <div className="lg:col-span-4 space-y-6">
               <Card className="uber-shadow border-none bg-black text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <CardHeader className="relative z-10">
                     <p className="text-xs font-bold uppercase tracking-widest opacity-60">Today's Earnings</p>
                     <CardTitle className="text-5xl font-black text-secondary">GHS 420.50</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold opacity-60">Trips</p>
                        <p className="text-xl font-bold">12</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold opacity-60">Wallet</p>
                        <p className="text-xl font-bold">GHS 23.00</p>
                     </div>
                  </CardContent>
               </Card>

               <Card className="uber-shadow border-none">
                  <CardHeader>
                     <CardTitle className="text-lg font-headline">Vehicle Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                           <Fuel className="h-5 w-5 text-orange-500" />
                           <span className="text-sm font-bold">Fuel Level</span>
                        </div>
                        <span className="font-bold">62%</span>
                     </div>
                     <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                           <Truck className="h-5 w-5 text-primary" />
                           <span className="text-sm font-bold">Capacity</span>
                        </div>
                        <span className="font-bold text-primary">{activeUser.capacity_m3}m³ Total</span>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="font-headline text-2xl font-black">Incoming Missions</h2>
                  {pendingJob && <Badge variant="destructive" className="animate-pulse">URGENT REQUEST</Badge>}
               </div>

               {activeJob ? (
                 <Card className="uber-shadow border-none relative overflow-hidden">
                    <CardHeader>
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                             <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                             <CardTitle className="text-xl font-bold">Heading to {activeJob.customerName}</CardTitle>
                             <CardDescription>Status: {activeJob.status}</CardDescription>
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="rounded-2xl border-2 bg-muted/10 p-6 space-y-4">
                          <div className="flex items-start gap-3">
                             <MapPin className="h-5 w-5 text-primary mt-1" />
                             <div>
                               <p className="font-black">{activeJob.pickupLocation?.landmark}</p>
                               <p className="text-xs text-muted-foreground">{activeJob.pickupLocation?.address}</p>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-3 gap-4">
                          <Button className="col-span-2 h-16 rounded-2xl bg-black text-white font-black">
                             <Navigation2 className="mr-2 h-5 w-5" /> NAVIGATE
                          </Button>
                          <a href={`tel:${activeJob.customerPhone}`} className="block">
                            <Button variant="outline" className="w-full h-16 rounded-2xl border-2 border-primary text-primary hover:bg-primary/10">
                               <Phone className="h-5 w-5" />
                            </Button>
                          </a>
                       </div>

                       <Button 
                        className="w-full h-16 rounded-2xl bg-secondary text-white font-black text-lg" 
                        onClick={() => handleCompleteJob(activeJob.id)}
                       >
                          <Camera className="mr-2 h-6 w-6" /> VERIFY PICKUP & COMPLETE
                       </Button>
                    </CardContent>
                 </Card>
               ) : pendingJob ? (
                 <Card className="uber-shadow border-4 border-primary/40 bg-primary/5 animate-in zoom-in-95">
                    <CardHeader>
                       <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-black uppercase tracking-widest text-primary">New Pickup Alert</p>
                          <p className="font-black text-2xl text-primary">GHS {pendingJob.price}</p>
                       </div>
                       <CardTitle className="text-2xl font-black">{pendingJob.customerName}</CardTitle>
                       <CardDescription className="text-black/60 font-medium">
                         {pendingJob.wasteDetails?.type} • {pendingJob.wasteDetails?.volume} m³
                       </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="p-5 rounded-2xl bg-white border-2 border-primary/20 flex items-start gap-4">
                          <MapPin className="h-6 w-6 text-primary mt-1" />
                          <div>
                             <p className="font-black text-lg">Landmark</p>
                             <p className="text-sm text-muted-foreground">{pendingJob.pickupLocation?.landmark}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <Button className="h-16 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary/90" onClick={() => handleAcceptJob(pendingJob.id)}>
                            ACCEPT JOB
                          </Button>
                          <Button variant="ghost" className="h-16 rounded-2xl font-black text-black/40">
                            DECLINE
                          </Button>
                       </div>
                    </CardContent>
                 </Card>
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed rounded-[2.5rem] bg-muted/10 text-center space-y-4">
                    <Truck className="h-16 w-16 text-muted-foreground opacity-20" />
                    <p className="font-black text-muted-foreground">Waiting for nearby approved requests...</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
