"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Loader2, Sparkles, CreditCard, Truck, Smartphone, Star, Trash2, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
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
    if (!address) {
      toast({ variant: 'destructive', title: "Missing Information", description: "Please enter an address or landmark." });
      return;
    }
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
    // Simulate real AI processing
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
    <Card className="uber-shadow border-none overflow-hidden bg-white rounded-[2rem]">
      {/* Progress Bar */}
      <div className="flex bg-muted/10 p-5 gap-3 border-b border-black/5">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${s <= step ? 'bg-black' : 'bg-black/5'}`} />
        ))}
      </div>
      
      <CardContent className="p-10">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-black tracking-tighter uppercase">Pickup Location</h2>
              <p className="text-muted-foreground font-medium">Where should we find you?</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Method</Label>
                <Select value={locationType} onValueChange={setLocationType}>
                  <SelectTrigger className="h-16 text-lg rounded-2xl border-2 border-black/5 bg-muted/30 focus:bg-white focus:border-black transition-all">
                    <SelectValue placeholder="How should we find you?" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="LANDMARK" className="h-12 font-bold">📍 Ghanaian Landmark</SelectItem>
                    <SelectItem value="GHANA_POST" className="h-12 font-bold">📮 GhanaPost Digital Address</SelectItem>
                    <SelectItem value="GPS_COORDINATE" className="h-12 font-bold">⚡ Precise GPS Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Address / Description</Label>
                <Input 
                  className="h-16 text-lg px-6 rounded-2xl border-2 border-black/5 bg-muted/30 focus:bg-white focus:border-black transition-all"
                  placeholder={locationType === 'LANDMARK' ? 'e.g. Behind Total Filling Station' : 'e.g. GA-123-4567'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <p className="text-[10px] text-black/40 font-bold italic flex items-center gap-2">
                  <Info className="h-3 w-3" /> Landmark-based resolution is often more accurate for local drivers.
                </p>
              </div>
            </div>

            <Button 
              className="w-full h-16 text-lg font-black rounded-2xl bg-black text-white hover:bg-black/90 btn-hover-effect group mt-4 shadow-xl shadow-black/10" 
              onClick={handleAddressResolve} 
              disabled={loading || !address}
            >
              {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <MapPin className="mr-3 h-6 w-6" />}
              Set Destination <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-3">
              <h3 className="font-headline text-4xl font-black tracking-tighter uppercase">Scan Waste</h3>
              <p className="text-muted-foreground font-medium">Snap a photo. Our AI identifies the contents for better recycling.</p>
            </div>
            
            <div 
              className="group relative h-80 w-full rounded-[2rem] border-4 border-dashed border-black/5 hover:border-primary/50 transition-all bg-muted/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
              onClick={handleImageUpload}
            >
               {loading ? (
                 <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                       <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                       <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
                    </div>
                    <p className="font-black text-primary animate-pulse tracking-[0.2em] uppercase text-xs text-center">AI Analyzing Waste Profile...</p>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-6 p-10 text-center">
                    <div className="h-24 w-24 rounded-3xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                      <Camera className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-2xl uppercase tracking-tighter">Capture or Upload</p>
                      <p className="text-sm text-black/40 font-medium">High accuracy classification enabled.</p>
                    </div>
                 </div>
               )}
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full h-12 text-black/40 font-black uppercase tracking-widest text-[10px] hover:bg-transparent" 
              onClick={() => setStep(1)} 
              disabled={loading}
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Change Location
            </Button>
          </div>
        )}

        {step === 3 && wasteData && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
             <div className="rounded-[2.5rem] bg-black text-white p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Trash2 className="h-40 w-40" />
                </div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                   <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-black uppercase tracking-[0.2em] text-[10px] text-white/60">Dynamic Pricing Engine</span>
                   </div>
                   <Badge className="bg-white/10 text-white border-none font-bold uppercase tracking-widest text-[9px] px-3">Live Quote</Badge>
                </div>
                <div className="flex items-end justify-between relative z-10">
                   <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Estimated Total</p>
                      <p className="text-6xl font-black">GHS {priceData?.pickupPrice.toFixed(2)}</p>
                      <p className="text-xs text-primary mt-4 font-black uppercase tracking-widest flex items-center gap-2">
                         {wasteData.wasteCategories[0].replace(/_/g, ' ')} • ~{wasteData.estimatedWeightKg}kg
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">ETA</p>
                      <p className="font-black text-3xl">8 MINS</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">Payment Selection</p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'momo', label: 'Mobile Money', icon: Smartphone, color: 'text-yellow-500' },
                     { id: 'card', label: 'Debit Card', icon: CreditCard, color: 'text-blue-500' }
                   ].map((p) => (
                     <Button key={p.id} variant="outline" className="h-24 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 border-2 border-black/5 hover:border-black hover:bg-black/5 transition-all">
                        <p.icon className={`h-7 w-7 ${p.color}`} />
                        <span className="font-black text-[10px] uppercase tracking-widest">{p.label}</span>
                     </Button>
                   ))}
                </div>
             </div>

             <div className="pt-6 space-y-6">
                <Button 
                  className="w-full h-20 text-xl font-black rounded-2xl bg-black text-white shadow-2xl btn-hover-effect" 
                  onClick={handleConfirmOrder} 
                  disabled={loading}
                >
                   {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : "Confirm Pickup Order"}
                </Button>
                <p className="text-[10px] text-center text-black/40 px-12 leading-relaxed font-bold uppercase tracking-tighter">
                  By confirming, you agree to our fair usage policy for community waste collection.
                </p>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-10 animate-in zoom-in-95 duration-500 space-y-12">
            <div className="relative mx-auto h-48 w-48">
               <div className="absolute inset-0 bg-secondary/10 rounded-full animate-ping" />
               <div className="relative h-48 w-48 rounded-full bg-black flex items-center justify-center text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
                 <Truck className="h-24 w-24 text-primary" />
               </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-5xl font-black tracking-tighter uppercase">Truck Assigned</h2>
              <p className="text-muted-foreground font-medium text-lg max-w-xs mx-auto">Kojo Mensah is heading to your location now.</p>
            </div>
            
            <Card className="uber-shadow border-none bg-muted/30 p-8 rounded-[2rem]">
               <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-black shadow-xl">
                    <Image src="https://picsum.photos/seed/driver1/200/200" width={200} height={200} alt="Driver" />
                  </div>
                  <div className="flex-1 text-left">
                     <p className="font-black text-2xl uppercase tracking-tighter">Kojo Mensah</p>
                     <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-[10px] font-black text-primary">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>4.9</span>
                        </div>
                        <span className="text-black/40 text-[10px] font-black uppercase tracking-widest">• Verified Driver</span>
                     </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-black text-white font-black px-4 py-2 rounded-xl text-sm border-none">8 MINS</Badge>
                  </div>
               </div>
            </Card>

            <Button className="w-full h-16 rounded-2xl font-black text-lg bg-black text-white shadow-xl" variant="default" onClick={() => window.location.reload()}>
              Track Arrival Live
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
