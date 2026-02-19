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
  ArrowUpRight
} from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto py-8 px-4 md:py-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-headline text-3xl font-bold">Admin Command Center</h1>
              <p className="text-muted-foreground">Monitoring BorlaHaze fleet and community impact across Ghana.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1">
                98% SLA Compliance
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                4.2 tons collected today
              </Badge>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Active Collectors', val: '142', icon: Truck, color: 'text-primary' },
              { label: 'Pending Requests', val: '28', icon: MapIcon, color: 'text-secondary' },
              { label: 'Users Active', val: '1.2k', icon: Users, color: 'text-blue-500' },
              { label: 'Revenue (GHS)', val: '12.4k', icon: BarChart3, color: 'text-orange-600' }
            ].map((stat, i) => (
              <Card key={i} className="shadow-lg border-none">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-bold uppercase">{stat.label}</p>
                    <p className="text-3xl font-black">{stat.val}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Waste Heatmap Placeholder */}
            <Card className="shadow-lg border-none h-full">
              <CardHeader>
                <CardTitle className="font-headline">Waste Demand Heatmap</CardTitle>
                <CardDescription>High-demand zones based on real-time requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full rounded-xl bg-muted/50 flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/accra-map/800/400')] bg-cover grayscale" />
                   <div className="relative z-10 text-center space-y-4">
                      <div className="flex gap-2 justify-center">
                        <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
                        <span className="text-xs font-bold uppercase tracking-widest">Kasoa (Critical)</span>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <div className="h-4 w-4 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">Madina (High)</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">Simulated Map View of Accra/Kumasi Zones</p>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability Metrics */}
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-secondary" /> Environmental Impact
                </CardTitle>
                <CardDescription>Recycling and diversion rates this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Recyclable Diversion</span>
                    <span className="text-secondary">64%</span>
                  </div>
                  <Progress value={64} className="h-2 bg-muted" />
                  <p className="text-xs text-muted-foreground leading-relaxed">64% of waste was diverted from landfills to recycling facilities (Sachet plastics & metals).</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Organic Composting</span>
                    <span className="text-orange-500">42%</span>
                  </div>
                  <Progress value={42} className="h-2 bg-muted" />
                  <p className="text-xs text-muted-foreground leading-relaxed">42% of organic market waste successfully routed to composting sites in Nsawam.</p>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-secondary/5 p-4 border border-secondary/10">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">CO2 Savings</p>
                    <p className="text-xl font-black text-secondary">2.4 Tons</p>
                  </div>
                  <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Active Alerts</p>
                    <p className="text-xl font-black text-primary">3 Hotspots</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Illegal Dumping Alerts */}
          <Card className="shadow-lg border-none border-t-4 border-t-red-500">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" /> Community Alerts
              </CardTitle>
              <CardDescription>Citizen reports of illegal dumping hotspots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { loc: 'Ashaiman Underbridge', status: 'Verified', reports: 12, time: '2h ago' },
                  { loc: 'Circle Lorry Station', status: 'Pending', reports: 5, time: '5h ago' }
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <MapIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-bold">{alert.loc}</h4>
                        <p className="text-xs text-muted-foreground">{alert.reports} citizen reports • {alert.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      Dispatch Truck <ArrowUpRight className="h-4 w-4" />
                    </Button>
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
