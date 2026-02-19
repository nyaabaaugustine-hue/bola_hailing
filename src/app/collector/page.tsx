"use client";

import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Truck, Navigation2, MapPin, Camera, Fuel, Phone, Power, User, CheckCircle2, DollarSign } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { DUMMY_LANDFILLS, DEMO_COLLECTOR, ACTIVE_SCENARIO_JOB, DEMO_TRANSACTION } from '@/lib/dummy-data';

export default function CollectorPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [hasJob, setHasJob] = useState(false);
  const [jobAccepted, setJobAccepted] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(false);
  
  const activeUser = DEMO_COLLECTOR;

  const handleAcceptJob = () => {
    setJobAccepted(true);
  };

  const handleCompleteJob = () => {
    setJobCompleted(true);
    setHasJob(false);
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      
      {/* Driver Header / Status Bar */}
      <div className={`transition-colors duration-500 pt-24 pb-6 ${isOnline ? 'bg-secondary' : 'bg-muted'}`}>
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
            
            {/* Left Col: Earnings & Fleet Info */}
            <div className="lg:col-span-4 space-y-6">
               <Card className="uber-shadow border-none bg-black text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <CardHeader className="relative z-10">
                     <p className="text-xs font-bold uppercase tracking-widest opacity-60">Today's Earnings</p>
                     <CardTitle className="text-5xl font-black text-secondary">GHS {jobCompleted ? '443.50' : '420.50'}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold opacity-60">Trips</p>
                        <p className="text-xl font-bold">{jobCompleted ? '13' : '12'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold opacity-60">Wallet</p>
                        <p className="text-xl font-bold">GHS {jobCompleted ? '23.00' : '0.00'}</p>
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

               <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-2 font-black"
                onClick={() => setHasJob(true)}
                disabled={hasJob || jobAccepted}
               >
                 SIMULATE INCOMING JOB
               </Button>
            </div>

            {/* Right Col: Active Job & Navigation */}
            <div className="lg:col-span-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="font-headline text-2xl font-black">Current Mission</h2>
                  {hasJob && !jobAccepted && <Badge variant="destructive" className="animate-pulse">URGENT REQUEST</Badge>}
                  {jobAccepted && <Badge variant="secondary" className="bg-secondary text-white">IN PROGRESS</Badge>}
               </div>

               {hasJob && !jobAccepted ? (
                 <Card className="uber-shadow border-4 border-primary/40 bg-primary/5 animate-in zoom-in-95">
                    <CardHeader>
                       <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-black uppercase tracking-widest text-primary">New Pickup Alert</p>
                          <p className="font-black text-2xl text-primary">{ACTIVE_SCENARIO_JOB.price}</p>
                       </div>
                       <CardTitle className="text-2xl font-black">{ACTIVE_SCENARIO_JOB.customerName}</CardTitle>
                       <CardDescription className="text-black/60 font-medium">
                         {ACTIVE_SCENARIO_JOB.wasteType} • {ACTIVE_SCENARIO_JOB.volume}
                       </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="p-5 rounded-2xl bg-white border-2 border-primary/20 flex items-start gap-4">
                          <MapPin className="h-6 w-6 text-primary mt-1" />
                          <div>
                             <p className="font-black text-lg">Landmark</p>
                             <p className="text-sm text-muted-foreground">{ACTIVE_SCENARIO_JOB.landmark}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <Button className="h-16 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary/90" onClick={handleAcceptJob}>
                            ACCEPT JOB
                          </Button>
                          <Button variant="ghost" className="h-16 rounded-2xl font-black text-black/40" onClick={() => setHasJob(false)}>
                            DECLINE
                          </Button>
                       </div>
                    </CardContent>
                 </Card>
               ) : jobAccepted ? (
                 <Card className="uber-shadow border-none relative overflow-hidden">
                    <CardHeader>
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                             <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                             <CardTitle className="text-xl font-bold">Heading to {ACTIVE_SCENARIO_JOB.customerName.split(' ')[0]}</CardTitle>
                             <CardDescription>Estimated Arrival: 7 mins</CardDescription>
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="rounded-2xl border-2 bg-muted/10 p-6 space-y-4">
                          <div className="flex items-start gap-3">
                             <MapPin className="h-5 w-5 text-primary mt-1" />
                             <p className="font-black">{ACTIVE_SCENARIO_JOB.landmark}</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-3 gap-4">
                          <Button className="col-span-2 h-16 rounded-2xl bg-black text-white font-black">
                             <Navigation2 className="mr-2 h-5 w-5" /> NAVIGATE
                          </Button>
                          <Button variant="outline" className="h-16 rounded-2xl border-2">
                             <Phone className="h-5 w-5" />
                          </Button>
                       </div>

                       {!jobCompleted ? (
                         <Button 
                          className="w-full h-16 rounded-2xl bg-secondary text-white font-black text-lg" 
                          onClick={handleCompleteJob}
                         >
                            <Camera className="mr-2 h-6 w-6" /> VERIFY PICKUP & COMPLETE
                         </Button>
                       ) : (
                         <div className="space-y-4 animate-in fade-in zoom-in-95">
                            <div className="p-6 rounded-2xl bg-secondary/10 border-2 border-secondary/20 text-secondary text-center">
                               <CheckCircle2 className="h-12 w-12 mx-auto mb-2" />
                               <p className="font-black text-xl">PICKUP COMPLETED</p>
                               <p className="text-sm">GHS 23.00 credited to your wallet.</p>
                            </div>
                            <Button className="w-full h-14 rounded-2xl bg-black text-white font-black" onClick={() => { setJobAccepted(false); setJobCompleted(false); }}>
                               READY FOR NEXT JOB
                            </Button>
                         </div>
                       )}
                    </CardContent>
                 </Card>
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed rounded-[2.5rem] bg-muted/10 text-center space-y-4">
                    <Truck className="h-16 w-16 text-muted-foreground opacity-20" />
                    <p className="font-black text-muted-foreground">Waiting for nearby requests in Madina...</p>
                 </div>
               )}

               {/* Landfill availability */}
               <div className="grid md:grid-cols-3 gap-4">
                  {DUMMY_LANDFILLS.map((l, i) => (
                    <Card key={i} className="uber-shadow border-none p-4 flex flex-col items-center text-center">
                       <p className="text-[10px] font-black uppercase text-muted-foreground">{l.name}</p>
                       <p className="text-xl font-black mt-1">{l.time}</p>
                       <Badge className={`mt-2 ${l.status === 'Low' ? 'bg-secondary' : l.status === 'High' ? 'bg-destructive' : 'bg-orange-500'} text-white border-none`} variant="default">
                          {l.status} Traffic
                       </Badge>
                    </Card>
                  ))}
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
