"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Loader2, Sparkles, CreditCard, CheckCircle2, Truck, Smartphone, Star } from 'lucide-react';
import { resolveGhanaAddress } from '@/ai/flows/ghana-address-voice-resolution';
import { wasteImageClassification } from '@/ai/flows/waste-image-classification-flow';
import { dynamicPickupPricing } from '@/ai/flows/dynamic-pickup-pricing-flow';
import { smartCollectorMatching } from '@/ai/flows/smart-collector-matching';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function PickupRequestForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [locationType, setLocationType] = useState('LANDMARK');
  const [resolvedLoc, setResolvedLoc] = useState<any>(null);
  const [wasteData, setWasteData] = useState<any>(null);
  const [priceData, setPriceData] = useState<any>(null);

  const handleAddressResolve = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const result = await resolveGhanaAddress({
        locationType: locationType as any,
        landmarkDescription: locationType === 'LANDMARK' ? address : undefined,
        ghanaPostAddress: locationType === 'GHANA_POST' ? address : undefined,
      });
      setResolvedLoc(result);
      setStep(2);
    } catch (e) {
      toast({ variant: 'destructive', title: "Location Error", description: "Try a more common landmark like 'Behind Total Filling Station'." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    setLoading(true);
    // Simulate real AI processing delay for that premium feel
    setTimeout(async () => {
      const mockDataUri = "data:image/jpeg;base64,...";
      try {
        const result = await wasteImageClassification({
          photoDataUri: mockDataUri,
          userDescription: "Household cleanup"
        });
        setWasteData(result);
        
        const priceResult = await dynamicPickupPricing({
          wasteType: 'Mixed domestic refuse',
          estimatedWeight: result.estimatedWeightKg,
          estimatedVolume: result.estimatedVolumeM3,
          userLocation: resolvedLoc.resolvedCoordinates,
          collectorLocation: { lat: 5.61, lng: -0.11 },
          trafficConditions: 'moderate',
          zoneDemandDensity: 'medium',
          timeOfRequest: new Date().toISOString(),
          landfillTippingFees: 15,
          fuelCostIndex: 1.2,
          serviceUrgency: 'immediate'
        });
        setPriceData(priceResult);
        setStep(3);
      } catch (e) {
        toast({ variant: 'destructive', title: "AI Error", description: "Could not classify waste. Please try again." });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      await smartCollectorMatching({
        userLocation: resolvedLoc.resolvedCoordinates,
        wasteDetails: {
          wasteType: wasteData.wasteCategories[0],
          estimatedVolume: wasteData.estimatedVolumeM3,
          estimatedWeight: wasteData.estimatedWeightKg,
        },
        availableCollectors: [
          {
            collectorId: 'C1',
            currentLocation: { lat: 5.61, lng: -0.11 },
            truckCapacityKg: 1000,
            truckCapacityM3: 15,
            acceptedWasteTypes: ['MIXED_DOMESTIC', 'SACHET_PLASTIC'],
            reliabilityScore: 98,
            historicalAcceptanceRate: 99,
            routeEfficiencyScore: 92,
            isAvailable: true
          }
        ]
      });
      setStep(4);
    } catch (e) {
      toast({ variant: 'destructive', title: "No Collectors", description: "All trucks are currently busy in your zone." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="uber-shadow border-none overflow-hidden bg-white">
      <div className="flex bg-muted/20 p-4 gap-2 border-b">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>
      <CardContent className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pick a destination</Label>
              <Select defaultValue={locationType} onValueChange={setLocationType}>
                <SelectTrigger className="h-12 text-base rounded-xl">
                  <SelectValue placeholder="Location Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LANDMARK">📍 Landmark (Uber Style)</SelectItem>
                  <SelectItem value="GHANA_POST">📮 Digital Address</SelectItem>
                  <SelectItem value="GPS_COORDINATE">⚡ Current GPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Input 
                className="h-14 text-lg px-6 rounded-xl border-2 focus:border-primary transition-all"
                placeholder={locationType === 'LANDMARK' ? 'Where is the borla? (e.g. Total Junction)' : 'GA-123-4567'}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" onClick={handleAddressResolve} disabled={loading || !address}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MapPin className="mr-2 h-5 w-5" />}
              Set Pickup Spot
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
              <h3 className="font-headline text-2xl font-bold">What are we picking up?</h3>
              <p className="text-muted-foreground">AI will calculate your fair price based on volume.</p>
            </div>
            <div 
              className="group relative h-64 w-full rounded-2xl border-4 border-dashed border-muted hover:border-primary/50 transition-colors bg-muted/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
              onClick={handleImageUpload}
            >
               {loading ? (
                 <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="font-bold text-primary animate-pulse tracking-widest uppercase text-xs">AI Analyzing...</p>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Camera className="h-10 w-10" />
                    </div>
                    <p className="font-bold">Tap to snap a photo</p>
                 </div>
               )}
            </div>
            <Button variant="ghost" className="w-full h-12 text-muted-foreground font-bold" onClick={() => setStep(1)} disabled={loading}>Change Location</Button>
          </div>
        )}

        {step === 3 && wasteData && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
             <div className="rounded-2xl bg-primary text-white p-6 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-bold uppercase tracking-widest text-[10px]">AI Fair Price</span>
                   </div>
                   <Badge variant="secondary" className="bg-white/20 text-white border-none">Immediate</Badge>
                </div>
                <div className="flex items-end justify-between">
                   <div>
                      <p className="text-4xl font-black">GHS {priceData?.pickupPrice.toFixed(2)}</p>
                      <p className="text-xs opacity-80 mt-1">{wasteData.wasteCategories[0].replace('_', ' ')} • ~{wasteData.estimatedWeightKg}kg</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs opacity-70">Estimated Arrival</p>
                      <p className="font-bold text-xl">8 mins</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Select Payment</p>
                <div className="grid grid-cols-2 gap-3">
                   {[
                     { id: 'momo', label: 'MoMo', icon: Smartphone, color: 'text-yellow-500' },
                     { id: 'card', label: 'Card', icon: CreditCard, color: 'text-blue-500' }
                   ].map((p) => (
                     <Button key={p.id} variant="outline" className="h-16 rounded-xl flex items-center justify-between px-6 border-2 hover:border-primary transition-all">
                        <div className="flex items-center gap-3">
                           <p.icon className={`h-5 w-5 ${p.color}`} />
                           <span className="font-bold">{p.label}</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 opacity-20" />
                     </Button>
                   ))}
                </div>
             </div>

             <Button className="w-full h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform" onClick={handleConfirmOrder} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Confirm BorlaHaze"}
             </Button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-10 animate-in zoom-in-95 duration-500 space-y-8">
            <div className="relative mx-auto h-32 w-32">
               <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping" />
               <div className="relative h-32 w-32 rounded-full bg-secondary flex items-center justify-center text-white shadow-2xl">
                 <Truck className="h-16 w-16" />
               </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold">Driver is Matched!</h2>
              <p className="text-muted-foreground">Kojo Mensah is preparing for your pickup.</p>
            </div>
            
            <Card className="uber-shadow border-none bg-muted/30 p-4">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                    <Image src="https://picsum.photos/seed/driver1/100/100" width={100} height={100} alt="Driver" />
                  </div>
                  <div className="flex-1 text-left">
                     <p className="font-bold">Kojo Mensah</p>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span>4.9 • Verified Specialist</span>
                     </div>
                  </div>
                  <Badge variant="outline" className="border-primary text-primary">In 8 mins</Badge>
               </div>
            </Card>

            <Button className="w-full h-14 rounded-xl font-bold" variant="outline" onClick={() => setStep(1)}>Back to Dashboard</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}