"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Loader2, Sparkles, CreditCard, CheckCircle2, Truck, Smartphone, Star, Trash2, ArrowRight, Info } from 'lucide-react';
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
            <div className="space-y-4">
              <h2 className="font-headline text-2xl font-black">Where is the Borla?</h2>
              <p className="text-muted-foreground text-sm">Select your location method for precision matching.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location Method</Label>
                <Select defaultValue={locationType} onValueChange={setLocationType}>
                  <SelectTrigger className="h-14 text-base rounded-xl border-2">
                    <SelectValue placeholder="How should we find you?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LANDMARK">📍 Landmark (Behind Melcom, etc.)</SelectItem>
                    <SelectItem value="GHANA_POST">📮 Digital Address (GA-123-4567)</SelectItem>
                    <SelectItem value="GPS_COORDINATE">⚡ Precise GPS Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detailed Address</Label>
                <Input 
                  className="h-14 text-lg px-6 rounded-xl border-2 focus:border-primary transition-all"
                  placeholder={locationType === 'LANDMARK' ? 'e.g. Total Junction, East Legon' : 'e.g. GA-001-2345'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                  <Info className="h-3 w-3" /> Landmark-based resolution is fastest for our collectors.
                </p>
              </div>
            </div>

            <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 group" onClick={handleAddressResolve} disabled={loading || !address}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MapPin className="mr-2 h-5 w-5" />}
              Set Pickup Spot <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
              <h3 className="font-headline text-3xl font-black">AI Classification</h3>
              <p className="text-muted-foreground">Snap a photo. We'll identify the waste and set a fair price.</p>
            </div>
            <div 
              className="group relative h-72 w-full rounded-2xl border-4 border-dashed border-muted hover:border-primary/50 transition-colors bg-muted/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
              onClick={handleImageUpload}
            >
               {loading ? (
                 <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                       <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                       <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
                    </div>
                    <p className="font-bold text-primary animate-pulse tracking-widest uppercase text-xs">AI Analyzing Load...</p>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-4 p-8 text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Camera className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="font-black text-xl">Upload or Snap Photo</p>
                      <p className="text-sm text-muted-foreground mt-1">Classification helps us route to recycling centers.</p>
                    </div>
                 </div>
               )}
            </div>
            <Button variant="ghost" className="w-full h-12 text-muted-foreground font-bold hover:bg-transparent" onClick={() => setStep(1)} disabled={loading}>
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Change Location
            </Button>
          </div>
        )}

        {step === 3 && wasteData && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
             <div className="rounded-2xl bg-primary text-white p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Trash2 className="h-32 w-32" />
                </div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-black uppercase tracking-widest text-[10px]">AI Dynamic Price</span>
                   </div>
                   <Badge className="bg-white/20 text-white border-none font-bold">Priority Pickup</Badge>
                </div>
                <div className="flex items-end justify-between relative z-10">
                   <div>
                      <p className="text-5xl font-black">GHS {priceData?.pickupPrice.toFixed(2)}</p>
                      <p className="text-sm opacity-90 mt-2 font-bold flex items-center gap-2">
                         {wasteData.wasteCategories[0].replace('_', ' ')} • ~{wasteData.estimatedWeightKg}kg
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">ETA</p>
                      <p className="font-black text-2xl">8 MINS</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Payment Method</p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'momo', label: 'Mobile Money', icon: Smartphone, color: 'text-yellow-500' },
                     { id: 'card', label: 'Debit Card', icon: CreditCard, color: 'text-blue-500' }
                   ].map((p) => (
                     <Button key={p.id} variant="outline" className="h-20 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all">
                        <p.icon className={`h-6 w-6 ${p.color}`} />
                        <span className="font-bold text-xs uppercase">{p.label}</span>
                     </Button>
                   ))}
                </div>
             </div>

             <div className="pt-4 space-y-4">
                <Button className="w-full h-16 text-xl font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={handleConfirmOrder} disabled={loading}>
                   {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Confirm BorlaHaze"}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground px-8 leading-relaxed">
                  By confirming, you agree to our fair usage policy for household and commercial refuse collection.
                </p>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-10 animate-in zoom-in-95 duration-500 space-y-10">
            <div className="relative mx-auto h-40 w-40">
               <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping" />
               <div className="relative h-40 w-40 rounded-full bg-secondary flex items-center justify-center text-white shadow-2xl">
                 <Truck className="h-20 w-20" />
               </div>
            </div>
            <div className="space-y-3">
              <h2 className="font-headline text-4xl font-black">Driver Assigned!</h2>
              <p className="text-muted-foreground text-lg max-w-xs mx-auto">Kojo is arriving in a White Compactor Truck.</p>
            </div>
            
            <Card className="uber-shadow border-none bg-muted/30 p-6 rounded-3xl">
               <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-primary shadow-lg">
                    <Image src="https://picsum.photos/seed/driver1/200/200" width={200} height={200} alt="Driver" />
                  </div>
                  <div className="flex-1 text-left">
                     <p className="font-black text-xl">Kojo Mensah</p>
                     <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-primary">
                          <Star className="h-4 w-4 fill-primary" />
                          <span>4.9</span>
                        </div>
                        <span className="text-muted-foreground text-xs">• Verified Hub Driver</span>
                     </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-primary text-primary font-black px-4 py-1">8 MINS</Badge>
                  </div>
               </div>
            </Card>

            <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl" variant="outline" onClick={() => window.location.reload()}>
              Track Arrival Live
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
