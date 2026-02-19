
"use client";

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, MapPin, Loader2, Sparkles, CreditCard, Truck, Smartphone, Star, Trash2, ArrowRight, Info, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { resolveGhanaAddress } from '@/ai/flows/ghana-address-voice-resolution';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { DUMMY_COLLECTORS, DEMO_AI_OUTPUT, DEMO_PRICING, DEMO_ROUTING } from '@/lib/dummy-data';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PickupRequestForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [locationType, setLocationType] = useState('LANDMARK');
  const [resolvedLoc, setResolvedLoc] = useState<any>(null);
  const [wasteData, setWasteData] = useState<any>(null);
  const [priceData, setPriceData] = useState<any>(null);
  const [matchedCollector, setMatchedCollector] = useState<any>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | null>(null);
  const [paymentDetail, setPaymentDetail] = useState('');

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
      setResolvedLoc({ resolvedCoordinates: { lat: 5.67955, lng: -0.16421 }, resolvedAddress: address });
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (loading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageUrl(reader.result as string);
        setLoading(true);
        setTimeout(() => {
          setWasteData(DEMO_AI_OUTPUT);
          setPriceData(DEMO_PRICING);
          setStep(3);
          setLoading(false);
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceedToPayment = () => {
    if (!paymentMethod) {
      toast({ variant: 'destructive', title: "Selection Required", description: "Please choose a payment method." });
      return;
    }
    setStep(4);
  };

  const handleConfirmOrder = async () => {
    if (!paymentDetail) {
      toast({ variant: 'destructive', title: "Payment Required", description: "Please enter your MoMo number or card details." });
      return;
    }

    setLoading(true);
    try {
      // Use fallback ID if not logged in for testing
      const customerId = user?.uid || 'demo-user-123';
      const customerName = user?.displayName || 'Ama Owusu (Demo)';

      const jobData = {
        customerId,
        customerName,
        customerPhone: '0244001122',
        status: 'REQUESTED',
        pickupLocation: {
          lat: resolvedLoc.resolvedCoordinates.lat,
          lng: resolvedLoc.resolvedCoordinates.lng,
          address: resolvedLoc.resolvedAddress,
          landmark: address
        },
        wasteDetails: {
          type: wasteData.wasteType,
          volume: wasteData.estimatedVolume_m3,
          weight: wasteData.estimatedWeight_kg
        },
        price: priceData.pickupFee,
        payment: {
          method: paymentMethod,
          detail: paymentDetail,
          status: 'PENDING_VERIFICATION'
        },
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'jobs'), jobData);
      
      setMatchedCollector(DUMMY_COLLECTORS[0]);
      setStep(5);
      toast({ title: "Order Confirmed", description: "Your request has been broadcast to our fleet." });
    } catch (error) {
      console.error("Order error:", error);
      toast({ variant: 'destructive', title: "Order Failed", description: "Could not save your request. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="uber-shadow border-none overflow-hidden bg-white rounded-[2rem]">
      <div className="flex bg-muted/10 p-5 gap-3 border-b border-black/5">
        {[1, 2, 3, 4, 5].map((s) => (
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
                  placeholder={locationType === 'LANDMARK' ? 'e.g. Opposite Yellow Kiosk, Zongo Junction' : 'e.g. GA-123-4567'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <p className="text-[10px] text-black/40 font-bold italic flex items-center gap-2">
                  <Info className="h-3 w-3" /> Landmark-based resolution is optimized for our drivers.
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
              <p className="text-muted-foreground font-medium">Snap a photo to get an instant AI-powered price estimate.</p>
            </div>
            
            <div 
              className="group relative h-80 w-full rounded-[2rem] border-4 border-dashed border-black/5 hover:border-primary/50 transition-all bg-muted/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
              onClick={triggerFileInput}
            >
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileChange} 
               />

               {selectedImageUrl && (
                 <Image 
                   src={selectedImageUrl} 
                   alt="Waste Preview" 
                   fill 
                   className="object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all"
                 />
               )}

               {loading ? (
                 <div className="flex flex-col items-center gap-6 relative z-10 p-10">
                    <div className="relative">
                       <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                       <div className="relative h-20 w-20 bg-black rounded-2xl flex items-center justify-center text-primary shadow-2xl">
                          <Loader2 className="h-10 w-10 animate-spin" />
                       </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-black text-black tracking-[0.2em] uppercase text-xs">AI Analyzing Profile</p>
                      <p className="text-[10px] text-muted-foreground font-bold italic">Estimating volume & pickup difficulty...</p>
                    </div>
                 </div>
               ) : !selectedImageUrl ? (
                 <div className="flex flex-col items-center gap-6 p-10 text-center relative z-10">
                    <div className="h-24 w-24 rounded-3xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                      <Camera className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-2xl uppercase tracking-tighter">Capture or Upload</p>
                      <p className="text-sm text-black/40 font-medium">Auto-classify waste type & volume.</p>
                    </div>
                 </div>
               ) : (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <p className="text-white font-black uppercase tracking-widest text-sm">Tap to change image</p>
                 </div>
               )}
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full h-12 text-black/40 font-black uppercase tracking-widest text-[10px] hover:bg-transparent" 
              onClick={() => setStep(1)} 
              disabled={loading}
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to Location
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
                   <Badge className="bg-white/10 text-white border-none font-bold uppercase tracking-widest text-[9px] px-3">Instant Quote</Badge>
                </div>
                <div className="flex items-end justify-between relative z-10">
                   <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Estimated Total</p>
                      <p className="text-6xl font-black">GHS {priceData?.pickupFee.toFixed(2)}</p>
                      <p className="text-xs text-primary mt-4 font-black uppercase tracking-widest flex items-center gap-2">
                         {wasteData.wasteType.replace(/_/g, ' ')} • ~{wasteData.estimatedWeight_kg}kg
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">ETA</p>
                      <p className="font-black text-3xl">{DEMO_ROUTING.etaPickup}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { id: 'momo', label: 'Mobile Money', icon: Smartphone, color: 'text-yellow-500' },
                     { id: 'card', label: 'Debit Card', icon: CreditCard, color: 'text-blue-500' }
                   ].map((p) => (
                     <button 
                        key={p.id} 
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`h-28 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 border-2 transition-all ${paymentMethod === p.id ? 'border-black bg-black/5 ring-4 ring-black/5' : 'border-black/5 hover:border-black/20 bg-white'}`}
                     >
                        <p.icon className={`h-8 w-8 ${p.color}`} />
                        <span className="font-black text-[10px] uppercase tracking-widest">{p.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="pt-6 space-y-6">
                <Button 
                  className="w-full h-20 text-xl font-black rounded-2xl bg-black text-white shadow-2xl btn-hover-effect" 
                  onClick={handleProceedToPayment} 
                  disabled={!paymentMethod}
                >
                   Continue to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-3">
              <h3 className="font-headline text-4xl font-black tracking-tighter uppercase">Payment Details</h3>
              <p className="text-muted-foreground font-medium">Verify your demo transaction.</p>
            </div>

            <div className="p-6 rounded-[1.5rem] bg-muted/20 border-2 border-black/5 space-y-6">
               <div className="flex items-center gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${paymentMethod === 'momo' ? 'bg-yellow-500' : 'bg-blue-600'}`}>
                    {paymentMethod === 'momo' ? <Smartphone /> : <CreditCard />}
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">{paymentMethod === 'momo' ? 'MoMo Payment' : 'Card Payment'}</p>
                    <p className="text-xs text-muted-foreground">Demo Transaction: GHS {priceData?.pickupFee}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">
                      {paymentMethod === 'momo' ? 'Enter Phone Number (0244...)' : 'Enter Card Number (4242...)'}
                    </Label>
                    <Input 
                      placeholder={paymentMethod === 'momo' ? '0244 000 000' : '4242 4242 4242 4242'} 
                      className="h-16 rounded-xl border-2 font-bold text-lg"
                      value={paymentDetail}
                      onChange={(e) => setPaymentDetail(e.target.value)}
                    />
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">Expiry</Label>
                         <Input placeholder="MM/YY" className="h-14 rounded-xl border-2 font-bold" />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">CVV</Label>
                         <Input placeholder="123" className="h-14 rounded-xl border-2 font-bold" />
                      </div>
                    </div>
                  )}
               </div>

               <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-xl text-secondary border border-secondary/20">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <p className="text-[10px] font-bold uppercase leading-tight">Secure Sandbox: This is a demo transaction. No real funds will be deducted.</p>
               </div>
            </div>

            <Button 
              className="w-full h-20 text-xl font-black rounded-2xl bg-secondary text-white shadow-2xl btn-hover-effect" 
              onClick={handleConfirmOrder} 
              disabled={loading || !paymentDetail}
            >
              {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <><CheckCircle2 className="mr-2" /> Pay GHS {priceData?.pickupFee}</>}
            </Button>

            <Button variant="ghost" className="w-full text-black/40 font-black uppercase text-[10px]" onClick={() => setStep(3)}>
              Change Payment Method
            </Button>
          </div>
        )}

        {step === 5 && matchedCollector && (
          <div className="text-center py-10 animate-in zoom-in-95 duration-500 space-y-12">
            <div className="relative mx-auto h-48 w-48">
               <div className="absolute inset-0 bg-secondary/10 rounded-full animate-ping" />
               <div className="relative h-48 w-48 rounded-full bg-black flex items-center justify-center text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
                 <Truck className="h-24 w-24 text-primary" />
               </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-5xl font-black tracking-tighter uppercase">Truck Dispatched</h2>
              <p className="text-muted-foreground font-medium text-lg max-w-xs mx-auto">{matchedCollector.name} is on the way to your pickup location.</p>
            </div>
            
            <Card className="uber-shadow border-none bg-muted/30 p-8 rounded-[2rem]">
               <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-black shadow-xl">
                    <Image src={matchedCollector.image} width={200} height={200} alt="Driver" className="object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                     <p className="font-black text-2xl uppercase tracking-tighter">{matchedCollector.name}</p>
                     <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-[10px] font-black text-primary">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>{matchedCollector.rating}</span>
                        </div>
                        <span className="text-black/40 text-[10px] font-black uppercase tracking-widest">• Verified Driver</span>
                     </div>
                  </div>
                  <div className="text-right flex flex-col gap-2">
                    <div className="bg-black text-white font-black px-4 py-2 rounded-xl text-sm">{DEMO_ROUTING.etaPickup}</div>
                    <a href={`tel:${matchedCollector.phone}`}>
                      <Button size="sm" variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/10 gap-2 h-10 w-full">
                        <Phone className="h-3 w-3" /> Call
                      </Button>
                    </a>
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

function Badge({ className, children }: any) {
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</div>
}
