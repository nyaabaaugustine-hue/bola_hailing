
"use client";

import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Navigation2, 
  MapPin, 
  Camera, 
  Fuel, 
  Phone, 
  Power, 
  User, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  Activity, 
  Star 
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
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
  const [fuelEfficiency, setFuelEfficiency] = useState(94);
  
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

  const { data: pendingJobs } = useCollection(pendingJobsQuery);
  const { data: activeJobs } = useCollection(activeJobQuery);

  const pendingJob = pendingJobs[0] as any;
  const activeJob = activeJobs[0] as any;

  // Simulate real-time fuel/route optimization updates
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      setFuelEfficiency(prev => Math.min(100, Math.max(85, prev + (Math.random() > 0.5 ? 0.1 : -0.1))));
    }, 5000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const handleAcceptJob = async (jobId: string) => {
    if (!authUser) return;
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        status: 'MATCHED',
        collectorId: authUser.uid,
        collectorName: authUser.displayName || 'Kwame Mensah',
        collectorPhone: '0559876543',
        liveCollectorLocation: {
          lat: 5.67691,
          lng: -0.16240
        }
      });
      toast({ title: "Job Accepted", description: "AI Route Optimization applied. Follow navigation." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to accept job." });
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, { status: 'COMPLETED' });
      toast({ title: "Mission Accomplished", description: "GHS 28.00 credited to your wallet." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to complete job." });
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      
      <div className={`transition-all duration-700 pt-32 pb-8 ${isOnline ? 'bg-secondary' : 'bg-muted'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-5">
             <div className={`h-16 w-16 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl flex items-center justify-center ${isOnline ? 'bg-white/20' : 'bg-black/20 text-muted-foreground'}`}>
                <Image src={activeUser.image} width={100} height={100} alt="Profile" className="object-cover" />
             </div>
             <div>
                <p className="font-black text-2xl uppercase tracking-tighter">Mission Control: {activeUser.name.split(' ')[0]}</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
                   {isOnline ? <><Zap className="h-3 w-3 fill-white" /> Online & Monitoring Nearby Fleet</> : <><Power className="h-3 w-3" /> System Disconnected</>}
                </p>
             </div>
          </div>
          <div className="flex items-center gap-6 bg-black/10 px-8 py-3 rounded-3xl backdrop-blur-xl border border-white/10 shadow-lg">
             <span className="font-black text-[10px] uppercase tracking-[0.3em]">{isOnline ? 'ACTIVE' : 'IDLE'}</span>
             <Switch 
                checked={isOnline} 
                onCheckedChange={setIsOnline}
                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20 [&_span]:data-[state=checked]:bg-secondary scale-125" 
              />
          </div>
        </div>
      </div>

      <main className="container mx-auto py-10 px-4 md:py-16">
        {!isOnline ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
             <div className="relative">
                <div className="absolute inset-0 bg-muted rounded-full animate-ping opacity-20" />
                <div className="relative h-32 w-32 rounded-[2.5rem] bg-muted flex items-center justify-center text-muted-foreground shadow-inner">
                   <Power className="h-16 w-16" />
                </div>
             </div>
             <div className="space-y-3">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Disconnected</h1>
                <p className="text-muted-foreground max-w-sm font-medium">Your truck is currently hidden from the network. Reconnect to see live pickup requests.</p>
             </div>
             <Button size="lg" className="rounded-2xl px-16 h-16 bg-secondary text-white font-black text-lg shadow-2xl shadow-secondary/30 transition-all hover:scale-105" onClick={() => setIsOnline(true)}>INITIALIZE ENGINE</Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-12 animate-in slide-in-from-bottom-8 duration-700">
            
            <div className="lg:col-span-4 space-y-8">
               <Card className="uber-shadow border-none bg-black text-white rounded-[2.5rem] overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                  <CardHeader className="relative z-10 p-10">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Wallet Liquidity</p>
                     <CardTitle className="text-6xl font-black text-secondary tracking-tighter">GHS 420<span className="text-xl ml-1 opacity-50">.50</span></CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-10 pt-0 grid grid-cols-2 gap-8 border-t border-white/5 mt-4 pt-8">
                     <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black tracking-widest opacity-40">Missions</p>
                        <p className="text-2xl font-black">12</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black tracking-widest opacity-40">Rating</p>
                        <div className="flex items-center gap-1">
                           <Star className="h-4 w-4 fill-primary text-primary" />
                           <p className="text-2xl font-black">4.8</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="uber-shadow border-none rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-8">
                     <CardTitle className="text-xl font-headline uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-secondary" /> Performance AI
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <Fuel className="h-5 w-5 text-orange-500" />
                              <span className="text-xs font-black uppercase tracking-widest">Efficiency Score</span>
                           </div>
                           <span className="font-black text-orange-500">{fuelEfficiency.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                           <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${fuelEfficiency}%` }} />
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-5 rounded-2xl bg-secondary/5 border-2 border-secondary/10">
                        <div className="flex items-center gap-3">
                           <Truck className="h-5 w-5 text-secondary" />
                           <span className="text-xs font-black uppercase tracking-widest">Net Payload</span>
                        </div>
                        <span className="font-black text-secondary text-lg">0.8<span className="text-[10px] ml-1">T</span></span>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-8 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">Live Missions</h2>
                    <p className="text-sm text-muted-foreground font-medium">Real-time optimization layer active.</p>
                  </div>
                  {pendingJob && (
                    <Badge className="bg-destructive text-white border-none animate-pulse px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                       Priority Request
                    </Badge>
                  )}
               </div>

               {activeJob ? (
                 <Card className="uber-shadow border-none rounded-[3rem] relative overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-white">
                    <CardHeader className="p-10 pb-6">
                       <div className="flex items-center gap-6">
                          <div className="h-20 w-20 rounded-[2rem] bg-black flex items-center justify-center overflow-hidden shadow-2xl">
                             <User className="h-10 w-10 text-white" />
                          </div>
                          <div>
                             <CardTitle className="text-3xl font-black uppercase tracking-tighter">Route to {activeJob.customerName}</CardTitle>
                             <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-secondary text-white border-none text-[9px] font-black uppercase tracking-widest">AI ROUTE OPTIMIZED</Badge>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{activeJob.status}</span>
                             </div>
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-10 pt-0 space-y-8">
                       <div className="rounded-[2.5rem] border-4 border-black/5 bg-muted/20 p-8 space-y-6">
                          <div className="flex items-start gap-5">
                             <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                                <MapPin className="h-5 w-5" />
                             </div>
                             <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Pickup Landmark</p>
                               <p className="font-black text-xl uppercase tracking-tight">{activeJob.pickupLocation?.landmark}</p>
                               <p className="text-sm text-muted-foreground font-medium mt-1">{activeJob.pickupLocation?.address}</p>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <Button className="md:col-span-9 h-20 rounded-[1.5rem] bg-black text-white font-black text-xl shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                             <Navigation2 className="mr-3 h-6 w-6" /> START NAVIGATION
                          </Button>
                          <a href={`tel:${activeJob.customerPhone}`} className="md:col-span-3">
                            <Button variant="outline" className="w-full h-20 rounded-[1.5rem] border-4 border-primary text-primary hover:bg-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                               <Phone className="h-7 w-7" />
                            </Button>
                          </a>
                       </div>

                       <Button 
                        className="w-full h-24 rounded-[2rem] bg-secondary text-white font-black text-2xl shadow-[0_25px_60px_-15px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4" 
                        onClick={() => handleCompleteJob(activeJob.id)}
                       >
                          <Camera className="h-8 w-8" /> VERIFY & COMPLETE
                       </Button>
                    </CardContent>
                 </Card>
               ) : pendingJob ? (
                 <Card className="uber-shadow border-[6px] border-primary/40 bg-primary/5 animate-in zoom-in-95 rounded-[3.5rem] overflow-hidden">
                    <CardHeader className="p-12 pb-6">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                             <Sparkles className="h-5 w-5 text-primary" />
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">New AI Match Detected</p>
                          </div>
                          <p className="font-black text-4xl text-primary tracking-tighter">GHS {pendingJob.price}</p>
                       </div>
                       <CardTitle className="text-5xl font-black uppercase tracking-tighter leading-none">{pendingJob.customerName}</CardTitle>
                       <CardDescription className="text-black/60 font-bold uppercase tracking-widest text-xs mt-4">
                         {pendingJob.wasteDetails?.type} • ~{pendingJob.wasteDetails?.volume} m³ Volume
                       </CardDescription>
                    </CardHeader>
                    <CardContent className="p-12 pt-0 space-y-10">
                       <div className="p-8 rounded-[2.5rem] bg-white border-2 border-primary/20 flex items-start gap-6 shadow-sm">
                          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                             <MapPin className="h-7 w-7" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Landmark Target</p>
                             <p className="font-black text-2xl uppercase tracking-tight">{pendingJob.pickupLocation?.landmark}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Button className="h-24 rounded-[2rem] bg-primary text-white font-black text-2xl shadow-2xl hover:bg-primary/90 transition-all hover:scale-[1.02]" onClick={() => handleAcceptJob(pendingJob.id)}>
                            ACCEPT JOB
                          </Button>
                          <Button variant="ghost" className="h-24 rounded-[2rem] font-black text-black/40 uppercase tracking-widest text-xs">
                            DECLINE MISSION
                          </Button>
                       </div>
                    </CardContent>
                 </Card>
               ) : (
                 <div className="flex flex-col items-center justify-center py-32 border-8 border-dashed rounded-[4rem] bg-muted/10 text-center space-y-6 opacity-20">
                    <Activity className="h-24 w-24 text-muted-foreground animate-pulse" />
                    <p className="font-black text-muted-foreground uppercase tracking-[0.4em] text-xs">Scanning Network for Nearby Missions...</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
