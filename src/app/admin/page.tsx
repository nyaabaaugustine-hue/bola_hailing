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
  Phone
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DUMMY_COLLECTORS, DUMMY_ORDERS } from '@/lib/dummy-data';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const mapImage = PlaceHolderImages.find(img => img.id === 'admin-fleet-map');
  const [orders, setOrders] = useState(DUMMY_ORDERS);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast({
      title: `Order ${newStatus}`,
      description: `Order ${orderId} has been ${newStatus.toLowerCase()}.`
    });
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto pt-32 pb-12 px-4 md:pt-36">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-headline text-4xl font-black tracking-tight uppercase">Fleet Command</h1>
              <p className="text-muted-foreground flex items-center gap-2 font-medium">
                <Activity className="h-4 w-4 text-secondary" /> Monitoring network operations.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search orders..." className="pl-10 w-64 rounded-xl border-2" />
              </div>
              <Button variant="outline" className="rounded-xl border-2 font-bold gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Drivers', val: DUMMY_COLLECTORS.length.toString(), icon: Truck, color: 'text-primary' },
              { label: 'Live Bookings', val: orders.filter(o => o.status !== 'COMPLETED').length.toString(), icon: Activity, color: 'text-secondary' },
              { label: 'Total Weight', val: '14.2 Tons', icon: Leaf, color: 'text-blue-500' },
              { label: 'Network Revenue', val: 'GHS 12k', icon: BarChart3, color: 'text-orange-600' }
            ].map((stat, i) => (
              <Card key={i} className="uber-shadow border-none hover:translate-y-[-4px] transition-transform duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black">{stat.val}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Manage Orders Section */}
          <Card className="uber-shadow border-none overflow-hidden">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="font-headline text-2xl uppercase tracking-tighter">Live Order Management</CardTitle>
              <CardDescription>Track, approve, and manage service requests in real-time.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 hover:bg-transparent">
                    <TableHead className="font-black uppercase text-[10px] tracking-widest px-6">Order Details</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Customer</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Amount</TableHead>
                    <TableHead className="text-right font-black uppercase text-[10px] tracking-widest px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/20">
                      <TableCell className="px-6">
                        <p className="font-black text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapIcon className="h-3 w-3" /> {order.location}
                        </p>
                      </TableCell>
                      <TableCell>
                         <p className="font-bold">{order.customer}</p>
                         <a href={`tel:${order.phone}`} className="text-xs text-primary font-bold flex items-center gap-1 mt-1 hover:underline">
                           <Phone className="h-3 w-3" /> {order.phone}
                         </a>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.status === 'COMPLETED' ? 'secondary' : order.status === 'CANCELLED' ? 'destructive' : 'outline'}
                          className="rounded-lg uppercase font-black text-[9px] px-3 py-1"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black text-secondary">{order.price}</TableCell>
                      <TableCell className="text-right px-6 space-x-2">
                        {order.status === 'REQUESTED' && (
                          <>
                            <Button size="sm" className="bg-secondary text-white rounded-xl h-10 px-4 font-black text-xs" onClick={() => handleStatusChange(order.id, 'APPROVED')}>
                              <CheckCircle2 className="h-4 w-4 mr-2" /> APPROVE
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive rounded-xl h-10 px-4 font-black text-xs hover:bg-destructive/10" onClick={() => handleStatusChange(order.id, 'CANCELLED')}>
                              <XCircle className="h-4 w-4 mr-2" /> CANCEL
                            </Button>
                          </>
                        )}
                        {order.status !== 'REQUESTED' && (
                          <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 font-black text-xs border-2">
                             VIEW LOGS
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-3">
             <Card className="lg:col-span-2 uber-shadow border-none overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Operational Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="aspect-[21/9] w-full rounded-2xl bg-muted relative overflow-hidden group border-2 border-black/5">
                      {mapImage && (
                        <Image 
                          src={mapImage.imageUrl} 
                          alt={mapImage.description} 
                          fill 
                          className="object-cover opacity-40 grayscale"
                        />
                      )}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2 opacity-60">
                         <MapIcon className="h-12 w-12 mx-auto text-black/20" />
                         <p className="font-black text-xs uppercase tracking-widest">Real-time GPS Tracking Layer</p>
                      </div>
                   </div>
                </CardContent>
             </Card>
             <Card className="uber-shadow border-none">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Quick Dispatch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="p-6 rounded-2xl bg-black text-white relative overflow-hidden group">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Fleet Efficiency</p>
                      <p className="text-4xl font-black mt-1">92.4%</p>
                      <Progress value={92} className="h-2 bg-white/20 mt-4" />
                   </div>
                   <Button className="w-full h-14 rounded-xl font-black border-2 border-black bg-white text-black hover:bg-black/5">
                     RE-ROUTE IDLE TRUCKS
                   </Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
