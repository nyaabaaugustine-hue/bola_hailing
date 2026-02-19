import Navigation from '@/components/Navigation';
import PickupRequestForm from '@/components/PickupRequestForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Truck, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto py-8 px-4 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl font-bold md:text-4xl">Request a Pickup</h1>
              <p className="text-muted-foreground">Enter your location and upload a photo of your waste for an instant quote.</p>
            </div>
            <PickupRequestForm />
          </div>

          {/* Right Column: Active Jobs & History */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" /> Active Pickups
                </CardTitle>
                <CardDescription>Real-time status of your requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/20 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs uppercase bg-primary/10 text-primary border-primary/20">In Progress</Badge>
                    <span className="text-xs text-muted-foreground">12:45 PM</span>
                  </div>
                  <h4 className="font-bold text-sm">Domestic Mixed Waste</h4>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Behind Melcom Spintex
                  </p>
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-2/3 transition-all duration-500" />
                  </div>
                  <p className="text-[10px] mt-1 text-primary font-medium">Collector is 5 mins away</p>
                </div>
                
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground italic">No other active pickups</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" /> Recent History
                </CardTitle>
                <CardDescription>Your last 30 days of clean impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { type: 'Sachet Plastics', loc: 'East Legon', status: 'Completed', date: 'Yesterday' },
                  { type: 'Organic Waste', loc: 'Madina Market', status: 'Completed', date: '3 days ago' }
                ].map((job, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="text-sm font-semibold">{job.type}</h4>
                      <p className="text-xs text-muted-foreground">{job.loc} • {job.date}</p>
                    </div>
                    <div className="flex items-center text-secondary gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs font-medium">{job.status}</span>
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