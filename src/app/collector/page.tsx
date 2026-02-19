import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Truck, Navigation2, MapPin, Camera, DollarSign, ListTodo, Fuel } from 'lucide-react';

export default function CollectorPage() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto py-8 px-4 md:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Status Panel */}
          <Card className="lg:col-span-1 shadow-lg bg-primary text-white h-fit">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold">Status</h2>
                <Switch className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20" />
              </div>
              <div className="space-y-1">
                <p className="text-xs opacity-70 uppercase font-bold tracking-widest">Available Capacity</p>
                <p className="text-2xl font-black">450 kg / 1.5 m³</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs opacity-70 uppercase font-bold tracking-widest">Accepted Types</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/20 text-[10px]">Sachet Plastics</Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/20 text-[10px]">Organic</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs & Map */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-headline text-3xl font-bold">Pickup Queue</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Fuel className="h-4 w-4" /> Optimizing Route...
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-lg border-2 border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-primary hover:bg-primary">Next Stop</Badge>
                    <span className="text-xs text-muted-foreground font-bold">4.2 km away</span>
                  </div>
                  <CardTitle className="font-headline mt-2">Spintex Road (Behind Melcom)</CardTitle>
                  <CardDescription>Household Mixed Waste • ~25 kg</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border bg-white p-4 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">GA-182-3921</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation2 className="h-4 w-4 text-secondary" />
                      <span className="text-muted-foreground">Landmark: "Right after the blue kiosk"</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                      <Navigation2 className="mr-2 h-4 w-4" /> Navigate
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Camera className="mr-2 h-4 w-4" /> Verify Pickup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Earnings Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" /> Daily Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase font-bold">Today</p>
                      <p className="text-2xl font-black text-secondary">GHS 420.50</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase font-bold">Pickups</p>
                      <p className="text-2xl font-black">12</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <p className="text-xs text-muted-foreground font-bold uppercase">Recent Earnings</p>
                    <div className="flex justify-between text-sm">
                      <span>Pickup #1029</span>
                      <span className="font-bold">GHS 35.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pickup #1028</span>
                      <span className="font-bold">GHS 28.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Landfill Availability</CardTitle>
                <CardDescription>Estimated queue times for authorized dump sites</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Kpone Landfill', status: 'Moderate', time: '15 mins', fee: 'GHS 50' },
                  { name: 'Abelekuma Recycling', status: 'Low', time: '5 mins', fee: 'GHS 20' },
                  { name: 'Nsawam Composting', status: 'High', time: '45 mins', fee: 'GHS 30' }
                ].map((l, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <div>
                      <h4 className="font-bold text-sm">{l.name}</h4>
                      <p className="text-xs text-muted-foreground">Tipping Fee: {l.fee}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={l.status === 'Low' ? 'default' : l.status === 'Moderate' ? 'secondary' : 'destructive'} className="text-[10px]">
                        {l.status} Traffic
                      </Badge>
                      <p className="text-xs mt-1 font-bold">{l.time} wait</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}