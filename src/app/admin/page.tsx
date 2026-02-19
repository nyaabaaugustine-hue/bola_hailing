
"use client";

import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Map as MapIcon, 
  Truck, 
  Leaf, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Phone,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DUMMY_COLLECTORS } from '@/lib/dummy-data';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const mapImage = PlaceHolderImages.find(img => img.id === 'admin-fleet-map');

  // Fetch live jobs from Firestore
  const jobsQuery = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  const { data: jobs, loading } = useCollection(jobsQuery);

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, { status: newStatus });
      toast({
        title: `Order ${newStatus}`,
        description: `Mission ${jobId.slice(0, 8)} has been ${newStatus.toLowerCase()}.`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update order status.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto pt-32 pb-12 px-4 md:pt-36">
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                    <ShieldCheck className="h-6 w-6" />
                 </div>
                 <h1 className="font-headline text-5xl font-black tracking-tighter uppercase leading-none">Fleet Command</h1>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                <Activity className="h-4 w-4 text-secondary animate-pulse" /> Infrastructure Monitoring Engine v2.4
              </p>
            </div>
            <div className="flex gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Trace mission..." className="pl-12 w-80 h-14 rounded-2xl border-2 font-bold bg-muted/20 focus:bg-white transition-all" />
              </div>
              <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-black gap-2 uppercase tracking-widest text-xs">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Fleet', val: DUMMY_COLLECTORS.length.toString(), icon: Truck, color: 'text-primary' },
              { label: 'Live Bookings', val: (jobs?.filter((o: any) => o.status !== 'COMPLETED').length || 0).toString(), icon: Activity, color: 'text-secondary' },
              { label: 'Carbon Offset', val: '14.2t', icon: Leaf, color: 'text-green-500' },
              { label: 'Net Revenue', val: 'GHS 12k', icon: BarChart3, color: 'text-orange-600' }
            ].map((stat, i) => (
              <Card key={i} className="uber-shadow border-none rounded-[2rem] hover:translate-y-[-8px] transition-all duration-500 group overflow-hidden bg-white">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em]">{stat.label}</p>
                    <p className="text-4xl font-black tracking-tighter">{stat.val}</p>
                  </div>
                  <div className={`h-14 w-14 rounded-[1.25rem] bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform ${stat.color} shadow-sm`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <Card className="uber-shadow border-none rounded-[3rem] overflow-hidden bg-white">
                <CardHeader className="p-10 border-b bg-muted/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-headline text-2xl uppercase tracking-tighter font-black">Mission Control Center</CardTitle>
                    <CardDescription className="font-bold text-xs uppercase tracking-widest opacity-60">Real-time logistics orchestration</CardDescription>
                  </div>
                  <Badge className="bg-secondary text-white border-none px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest">Live Updates Active</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-20 text-center text-muted-foreground font-black uppercase tracking-widest flex flex-col items-center gap-4">
                       <Loader2 className="h-10 w-10 animate-spin" />
                       Synchronizing Network...
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b-2 hover:bg-transparent">
                          <TableHead className="font-black uppercase text-[10px] tracking-widest px-8 h-16">Mission Trace</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Customer Unit</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">System Status</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Fee (GHS)</TableHead>
                          <TableHead className="text-right font-black uppercase text-[10px] tracking-widest px-8 h-16">Intervention</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs?.map((order: any) => (
                          <TableRow key={order.id} className="hover:bg-muted/10 border-b border-black/5 h-24">
                            <TableCell className="px-8">
                              <p className="font-black text-base tracking-tighter">{order.id.slice(0, 8).toUpperCase()}</p>
                              <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-1 uppercase tracking-widest">
                                <MapIcon className="h-3 w-3" /> {order.pickupLocation?.landmark || 'Madina Central'}
                              </p>
                            </TableCell>
                            <TableCell>
                               <p className="font-black text-sm uppercase tracking-tight">{order.customerName || 'Demo User'}</p>
                               <a href={`tel:${order.customerPhone}`} className="text-[10px] text-primary font-black flex items-center gap-1 mt-1 hover:underline tracking-widest">
                                 <Phone className="h-3 w-3" /> {order.customerPhone}
                               </a>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={order.status === 'COMPLETED' ? 'secondary' : order.status === 'CANCELLED' ? 'destructive' : 'outline'}
                                className="rounded-xl uppercase font-black text-[8px] px-3 py-1.5 border-2"
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-black text-lg tracking-tighter text-secondary">{order.price}</TableCell>
                            <TableCell className="text-right px-8 space-x-2">
                              {order.status === 'REQUESTED' && (
                                <div className="flex items-center justify-end gap-2">
                                  <Button size="sm" className="bg-black text-white rounded-2xl h-11 px-6 font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black/90" onClick={() => handleStatusChange(order.id, 'APPROVED')}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" /> APPROVE
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-destructive rounded-2xl h-11 px-4 font-black text-[10px] uppercase tracking-widest hover:bg-destructive/10" onClick={() => handleStatusChange(order.id, 'CANCELLED')}>
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                              {order.status !== 'REQUESTED' && (
                                <Button variant="outline" size="sm" className="rounded-2xl h-11 px-6 font-black text-[10px] uppercase tracking-widest border-2 hover:bg-muted/50">
                                   ANALYSIS LOGS
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <Card className="uber-shadow border-none rounded-[3rem] overflow-hidden bg-black text-white relative h-80">
                  <div className="absolute inset-0 opacity-20">
                     {mapImage && <Image src={mapImage.imageUrl} alt="Map" fill className="object-cover grayscale" />}
                  </div>
                  <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <Sparkles className="h-4 w-4 text-primary" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Fleet Intelligence</p>
                        </div>
                        <h3 className="font-headline text-3xl font-black uppercase tracking-tighter">Operational Efficiency</h3>
                     </div>
                     <div className="space-y-4">
                        <p className="text-6xl font-black text-secondary tracking-tighter">92.4%</p>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                              <span>Network Utilization</span>
                              <span>High</span>
                           </div>
                           <Progress value={92} className="h-3 bg-white/10 rounded-full" />
                        </div>
                     </div>
                  </div>
               </Card>

               <Card className="uber-shadow border-none rounded-[3rem] p-10 space-y-8 bg-white">
                  <div className="space-y-4">
                     <h4 className="font-black text-xl uppercase tracking-tighter flex items-center gap-3">
                        <Zap className="h-6 w-6 text-primary" /> Dispatch Center
                     </h4>
                     <p className="text-sm text-muted-foreground font-medium leading-relaxed">AI engine is currently optimizing routes for {DUMMY_COLLECTORS.length} active trucks.</p>
                  </div>
                  <div className="space-y-4">
                     <Button className="w-full h-16 rounded-[1.5rem] font-black border-4 border-black bg-white text-black hover:bg-black/5 uppercase tracking-widest text-xs">
                       RE-ROUTE IDLE UNITS
                     </Button>
                     <Button className="w-full h-16 rounded-[1.5rem] font-black bg-black text-white shadow-xl hover:bg-black/90 uppercase tracking-widest text-xs">
                       SYSTEM DIAGNOSTICS
                     </Button>
                  </div>
                  <div className="pt-4 border-t border-black/5">
                     <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Network Latency</span>
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest">12ms</span>
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
