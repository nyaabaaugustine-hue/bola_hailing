'use client';

import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Truck, Navigation2, MapPin, Camera, DollarSign, ListTodo, Fuel, Phone, MessageSquare, Power, User } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function CollectorPage() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      
      {/* Driver Header / Status Bar */}
      <div className={`transition-colors duration-500 py-4 ${isOnline ? 'bg-secondary' : 'bg-muted'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
             <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isOnline ? 'bg-white/20' : 'bg-black/20 text-muted-foreground'}`}>
                <User className="h-5 w-5" />
             </div>
             <div>
                <p className="font-bold text-lg">Good morning, Kojo</p>
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
                     <CardTitle className="text-5xl font-black text-secondary">GHS 420.50</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold opacity-60">Trips</p>
                        <p className="text-xl font-bold">12</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold opacity-60">Hours</p>
                        <p className="text-xl font-bold">5.4h</p>
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
                        <span className="font-bold">65%</span>
                     </div>
                     <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                           <Truck className="h-5 w-5 text-primary" />
                           <span className="text-sm font-bold">Capacity</span>
                        </div>
                        <span className="font-bold text-primary">450kg Free</span>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Right Col: Active Job & Navigation */}
            <div className="lg:col-span-8 space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="font-headline text-2xl font-black">Current Mission</h2>
                  <Badge variant="outline" className="text-secondary border-secondary animate-pulse">New Job</Badge>
               </div>

               <Card className="uber-shadow border-4 border-secondary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24">
                     <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-t-secondary border-l-[80px] border-l-transparent" />
                     <Navigation2 className="absolute top-3 right-3 h-5 w-5 text-white" />
                  </div>
                  <CardHeader>
                     <div className="flex items-center gap-4 mb-2">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-muted">
                           <Image src="https://picsum.photos/seed/user1/100/100" width={100} height={100} alt="Customer" />
                        </div>
                        <div>
                           <CardTitle className="text-xl font-bold">Pickup from Amara</CardTitle>
                           <CardDescription>Household Mixed Waste • ~25 kg</CardDescription>
                        </div>
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="rounded-2xl border-2 bg-muted/10 p-6 space-y-4 relative">
                        <div className="flex items-start gap-3">
                           <MapPin className="h-5 w-5 text-primary mt-1" />
                           <div>
                              <p className="font-black text-lg">East Legon (Near ANC Mall)</p>
                              <p className="text-sm text-muted-foreground italic">"Right after the red container, before the blue gate"</p>
                           </div>
                        </div>
                        <div className="absolute right-6 top-6">
                           <div className="bg-white px-3 py-1 rounded-full uber-shadow text-xs font-black text-secondary border border-secondary/20">
                              4.2 KM AWAY
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="col-span-2 h-16 rounded-2xl bg-black text-white font-black text-lg hover:bg-black/90 group">
                           <Navigation2 className="mr-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                           NAVIGATE
                        </Button>
                        <Button variant="outline" className="h-16 rounded-2xl border-2 font-black">
                           <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" className="h-16 rounded-2xl border-2 font-black">
                           <MessageSquare className="h-5 w-5" />
                        </Button>
                     </div>

                     <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 hover:bg-primary/10 transition-colors">
                        <Camera className="mr-2 h-5 w-5 text-primary" />
                        VERIFY PICKUP & COMPLETE
                     </Button>
                  </CardContent>
               </Card>

               {/* Landfill availability as a secondary concern */}
               <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'Kpone Landfill', time: '15m', status: 'Moderate' },
                    { name: 'Abelekuma', time: '5m', status: 'Low' },
                    { name: 'Nsawam site', time: '45m', status: 'High' }
                  ].map((l, i) => (
                    <Card key={i} className="uber-shadow border-none p-4 flex flex-col items-center text-center">
                       <p className="text-[10px] font-black uppercase text-muted-foreground">{l.name}</p>
                       <p className="text-xl font-black mt-1">{l.time}</p>
                       <Badge className={`mt-2 ${l.status === 'Low' ? 'bg-secondary' : l.status === 'High' ? 'bg-destructive' : 'bg-orange-500'}`}>
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