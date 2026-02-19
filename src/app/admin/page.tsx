'use client';

import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Map as MapIcon, 
  Users, 
  Truck, 
  Leaf, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto py-8 px-4 md:py-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-headline text-4xl font-black tracking-tight">Fleet Command</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-secondary" /> Monitoring live network operations in Accra & Kumasi.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl border-2 font-bold gap-2">
                <TrendingUp className="h-4 w-4" /> Full Analytics
              </Button>
              <Button className="rounded-xl font-bold bg-black text-white hover:bg-black/90">
                System Health: Good
              </Button>
            </div>
          </div>

          {/* Core Network Stats */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Drivers', val: '142', icon: Truck, color: 'text-primary' },
              { label: 'Live Bookings', val: '28', icon: Activity, color: 'text-secondary' },
              { label: 'Total Users', val: '1.2k', icon: Users, color: 'text-blue-500' },
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

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Real-time Heatmap */}
            <Card className="lg:col-span-2 uber-shadow border-none overflow-hidden h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                   <div>
                      <CardTitle className="font-headline text-xl">Demand Hotspots</CardTitle>
                      <CardDescription>Visualizing pickup density in Accra</CardDescription>
                   </div>
                   <Badge className="bg-secondary/10 text-secondary border-none">LIVE MAP</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[21/9] w-full rounded-2xl bg-muted relative overflow-hidden group">
                   <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/seed/accra-admin-map/1200/600')] bg-cover grayscale" />
                   
                   {/* Simulated Hotspots */}
                   <div className="absolute top-1/4 left-1/3 h-16 w-16 bg-red-500/20 rounded-full animate-pulse border border-red-500/40">
                      <div className="absolute inset-0 m-auto h-4 w-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                   </div>
                   <div className="absolute bottom-1/3 right-1/4 h-24 w-24 bg-orange-500/20 rounded-full animate-pulse delay-700 border border-orange-500/40">
                      <div className="absolute inset-0 m-auto h-4 w-4 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50" />
                   </div>

                   <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-xl text-white space-y-2 max-w-xs">
                      <p className="text-[10px] font-black tracking-widest uppercase opacity-60">Peak Demand</p>
                      <p className="text-sm font-bold">Kasoa Underbridge • 14 Requests</p>
                      <Button size="sm" className="w-full bg-secondary h-8 text-[10px] font-black">RE-ROUTE NEAREST TRUCKS</Button>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability Metrics */}
            <Card className="uber-shadow border-none">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-secondary" /> Eco-Performance
                </CardTitle>
                <CardDescription>Monthly diversion targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Recyclables</span>
                    <span className="text-secondary">64%</span>
                  </div>
                  <Progress value={64} className="h-3 bg-muted" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Organics</span>
                    <span className="text-orange-500">42%</span>
                  </div>
                  <Progress value={42} className="h-3 bg-muted" />
                </div>

                <div className="pt-4 p-6 rounded-2xl bg-black text-white relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-24 w-24" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Impact Leader</p>
                  <p className="text-2xl font-black mt-1">2.4 Tons saved</p>
                  <p className="text-xs text-white/50 mt-2">Carbon offset equivalent to 42 planted trees in Aburi.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* High Priority Alerts */}
          <Card className="uber-shadow border-none overflow-hidden">
            <CardHeader className="bg-destructive/5 border-b border-destructive/10">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <CardTitle className="font-headline text-lg">System Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { loc: 'Ashaiman Underbridge', issue: 'Illegal Dumping Cluster', severity: 'Critical', time: '2h ago' },
                  { loc: 'Circle Station', issue: 'Collector Shortage', severity: 'Medium', time: '5h ago' }
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${alert.severity === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-orange-500/10 text-orange-500'}`}>
                        <MapIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg">{alert.loc}</h4>
                        <p className="text-sm text-muted-foreground">{alert.issue} • {alert.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'secondary'}>{alert.severity}</Badge>
                       <Button variant="outline" className="rounded-xl border-2 font-bold gap-2">
                         Dispatch <ArrowUpRight className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}