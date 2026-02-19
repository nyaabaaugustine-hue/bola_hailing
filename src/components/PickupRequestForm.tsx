"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Loader2, Sparkles, CreditCard, CheckCircle2, DollarSign } from 'lucide-react';
import { resolveGhanaAddress } from '@/ai/flows/ghana-address-voice-resolution';
import { wasteImageClassification } from '@/ai/flows/waste-image-classification-flow';
import { dynamicPickupPricing } from '@/ai/flows/dynamic-pickup-pricing-flow';
import { smartCollectorMatching } from '@/ai/flows/smart-collector-matching';
import { useToast } from '@/hooks/use-toast';

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
      toast({ title: "Location Resolved", description: `Resolved to: ${result.resolvedAddress}` });
    } catch (e) {
      toast({ variant: 'destructive', title: "Resolution Error", description: "Could not find that location. Try a different landmark." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: any) => {
    setLoading(true);
    // Simulate reading image as data URI
    const mockDataUri = "data:image/jpeg;base64,..."; // In real app, use FileReader
    try {
      const result = await wasteImageClassification({
        photoDataUri: mockDataUri,
        userDescription: "Standard household waste"
      });
      setWasteData(result);
      
      // Immediately calculate price after classification
      const priceResult = await dynamicPickupPricing({
        wasteType: 'Mixed domestic refuse',
        estimatedWeight: result.estimatedWeightKg,
        estimatedVolume: result.estimatedVolumeM3,
        userLocation: resolvedLoc.resolvedCoordinates,
        collectorLocation: { lat: 5.61, lng: -0.11 }, // Mock collector loc
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
      toast({ variant: 'destructive', title: "Classification Failed", description: "Our AI couldn't process that image. Try again." });
    } finally {
      setLoading(false);
    }
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
            truckCapacityKg: 500,
            truckCapacityM3: 10,
            acceptedWasteTypes: ['MIXED_DOMESTIC', 'SACHET_PLASTIC'],
            reliabilityScore: 95,
            historicalAcceptanceRate: 98,
            routeEfficiencyScore: 90,
            isAvailable: true
          }
        ]
      });
      setStep(4);
      toast({ title: "Booking Confirmed!", description: "A collector is on the way." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Matching Error", description: "No collectors available in your area right now." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl border-none overflow-hidden">
      <div className="flex bg-muted/30 p-4 gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>
      <CardContent className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label>Pickup Location Type</Label>
              <Select defaultValue={locationType} onValueChange={setLocationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LANDMARK">Landmark Description</SelectItem>
                  <SelectItem value="GHANA_POST">GhanaPost Digital Address</SelectItem>
                  <SelectItem value="GPS_COORDINATE">Current GPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{locationType === 'LANDMARK' ? 'Describe your location' : 'Enter Digital Address'}</Label>
              <Input 
                placeholder={locationType === 'LANDMARK' ? 'e.g. Behind Melcom Spintex, next to the white kiosk' : 'e.g. GA-123-4567'}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button className="w-full h-12 text-lg" onClick={handleAddressResolve} disabled={loading || !address}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <MapPin className="mr-2 h-5 w-5" />}
              Set Pickup Location
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center space-y-4">
              <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Camera className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold">Snap your Borla</h3>
                <p className="text-sm text-muted-foreground">Upload a photo for AI classification and volume estimation.</p>
              </div>
              <input type="file" className="hidden" id="waste-photo" onChange={handleImageUpload} />
              <Button asChild variant="secondary" className="bg-primary text-white hover:bg-primary/90">
                <label htmlFor="waste-photo" className="cursor-pointer">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                  Take or Upload Photo
                </label>
              </Button>
            </div>
            <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>Go Back</Button>
          </div>
        )}

        {step === 3 && wasteData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-xl bg-muted/30 p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold">AI Analysis</span>
                </div>
                <Badge variant="outline" className="border-secondary text-secondary">Ready to Book</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-bold text-lg">{wasteData.wasteCategories[0].replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Weight</p>
                  <p className="font-bold text-lg">{wasteData.estimatedWeightKg} kg</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Fair Price</p>
                  <p className="text-3xl font-black text-primary">GHS {priceData?.pickupPrice.toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{priceData?.explanation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                {['MoMo', 'Card', 'Cash'].map((m) => (
                  <Button key={m} variant="outline" className="h-16 flex flex-col gap-1 border-2 focus:border-primary">
                    <span className="text-xs font-bold uppercase">{m}</span>
                    <CreditCard className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>

            <Button className="w-full h-14 text-xl font-bold shadow-xl shadow-primary/20" onClick={handleConfirmOrder} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <CheckCircle2 className="mr-2 h-6 w-6" />}
              Confirm Pickup
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6 py-10 animate-in zoom-in-95">
            <div className="mx-auto h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-white shadow-xl shadow-secondary/20">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold">You're All Set!</h2>
              <p className="text-muted-foreground">A truck has been matched and is heading to your landmark.</p>
            </div>
            <div className="rounded-xl border p-4 bg-muted/10 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collector</span>
                <span className="font-bold">Kojo Waste Ops</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Arrival</span>
                <span className="font-bold text-primary">12 Minutes</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" onClick={() => setStep(1)}>Request Another</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}