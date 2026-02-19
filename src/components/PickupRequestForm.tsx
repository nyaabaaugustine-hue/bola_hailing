
"use client";

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Camera, 
  MapPin, 
  Loader2, 
  Sparkles, 
  CreditCard, 
  Truck, 
  Smartphone, 
  Star, 
  Trash2, 
  ArrowRight, 
  Info, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Mic, 
  Activity,
  Navigation as NavigationIcon,
  Compass
} from 'lucide-react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [resolvedLoc, setResolvedLoc] = useState<any>(null);
  const [wasteData, setWasteData] = useState<any>(null);
  const [priceData, setPriceData] = useState<any>(null);
  const [matchedCollector, setMatchedCollector] = useState<any>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | null>(null);
  const [paymentDetail, setPaymentDetail] = useState('');

  const simulateVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setAddress("Opposite Yellow Kiosk, Zongo Junction, Madina");
      setIsRecording(false);
      toast({ title: "Voice Resolved", description: "Landmark description captured successfully." });
    }, 2500);
  };

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
        // Simulate AI Vision Analysis
        setTimeout(() => {
          setWasteData(DEMO_AI_OUTPUT);
          setPriceData(DEMO_PRICING);
          setStep(3);
          setLoading(false);
          toast({ title: "AI Scan Complete", description: "Classified as Mixed Domestic Waste (~45kg)." });
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
    } catch (error) {
      console.error("Order error:", error);
      toast({ variant: 'destructive', title: "Order Failed", description: "Could not save your request. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="uber-shadow border-none overflow-hidden bg-white rounded-[3rem]">
      <div className="flex bg-muted/10 p-6 gap-3 border-b border-black/5">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-700 ${s <= step ? 'bg-black' : 'bg-black/10'}`} />
        ))}
      </div>
      
      <CardContent className="p-12">
        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
              <h2 className="font-headline text-5xl font-black tracking-tighter uppercase leading-[0.9]">Set Landmark</h2>
              <p className="text-muted-foreground font-medium text-lg">Our AI resolves local landmarks instantly.</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Resolution Mode</Label>
                <div className="grid grid-cols-3 gap-6">
                   {[
                     { id: 'LANDMARK', label: 'Landmark', icon: MapPin, color: 'text-primary' },
                     { id: 'GHANA_POST', label: 'Digital Addr', icon: ShieldCheck, color: 'text-secondary' },
                     { id: 'GPS_COORDINATE', label: 'GPS Pin', icon: Activity, color: 'text-orange-500' }
                   ].map((mode) => (
                     <button 
                       key={mode.id}
                       onClick={() => setLocationType(mode.id)}
                       className={`p-6 rounded-[2.5rem] flex flex-col items-center gap-4 border-4 transition-all duration-300 ${locationType === mode.id ? 'border-black bg-black text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] scale-105' : 'border-black/5 bg-muted/30 text-black/60 hover:border-black/20'}`}
                     >
                        <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${locationType === mode.id ? 'bg-white/20' : 'bg-white'}`}>
                           <mode.icon className={`h-8 w-8 ${locationType === mode.id ? 'text-white' : mode.color}`} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{mode.label}</span>
                     </button>
                   ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Landmark Description</Label>
                <div className="relative group">
                   <Input 
                    className="h-24 text-2xl px-10 pr-24 rounded-[2rem] border-4 border-black/5 bg-muted/30 focus:bg-white focus:border-black transition-all font-black placeholder:font-medium shadow-inner"
                    placeholder={locationType === 'LANDMARK' ? 'Opposite Yellow Kiosk...' : 'e.g. GA-123-4567'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <button 
                    onClick={simulateVoiceInput}
                    className={`absolute right-4 top-4 h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-destructive text-white animate-pulse' : 'bg-black text-white hover:bg-primary shadow-xl'}`}
                  >
                    {isRecording ? <Activity className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </button>
                </div>
                <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[1.5rem] border-2 border-primary/10">
                   <Sparkles className="h-6 w-6 text-primary shrink-0" />
                   <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-relaxed">
                     Our landmark resolution engine is active. Voice transcriptions will be automatically geo-coded.
                   </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-24 text-2xl font-black rounded-[2rem] bg-black text-white hover:bg-black/90 btn-hover-effect group mt-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]" 
              onClick={handleAddressResolve} 
              disabled={loading || !address}
            >
              {loading ? <Loader2 className="mr-3 h-8 w-8 animate-spin" /> : <Compass className="mr-3 h-8 w-8" />}
              CONFIRM POSITION <ArrowRight className="ml-2 h-8 w-8 group-hover:translate-x-3 transition-transform" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
              <h3 className="font-headline text-5xl font-black tracking-tighter uppercase leading-[0.9]">AI Vision Scan</h3>
              <p className="text-muted-foreground font-medium text-lg">Snap a photo to determine waste type and fair pricing.</p>
            </div>
            
            <div 
              className="group relative h-96 w-full rounded-[3.5rem] border-4 border-dashed border-black/10 hover:border-primary/50 transition-all bg-muted/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-inner"
              onClick={triggerFileInput}
            >
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

               {selectedImageUrl && (
                 <Image src={selectedImageUrl} alt="Waste Preview" fill className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
               )}

               {loading ? (
                 <div className="flex flex-col items-center gap-8 relative z-10 p-10">
                    <div className="relative">
                       <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                       <div className="relative h-28 w-28 bg-black rounded-[2.5rem] flex items-center justify-center text-primary shadow-2xl">
                          <Loader2 className="h-14 w-14 animate-spin" />
                       </div>
                    </div>
                    <div className="text-center space-y-3">
                      <p className="font-black text-black tracking-[0.3em] uppercase text-xs">Processing Visual Profile</p>
                      <div className="flex items-center gap-2 justify-center">
                         <div className="h-1.5 w-12 bg-black/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-progress-indefinite" />
                         </div>
                         <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Detecting Sachet Plastic...</p>
                      </div>
                    </div>
                 </div>
               ) : !selectedImageUrl ? (
                 <div className="flex flex-col items-center gap-8 p-12 text-center relative z-10">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                      <Camera className="h-12 w-12" />
                    </div>
                    <div className="space-y-3">
                      <p className="font-black text-3xl uppercase tracking-tighter">Capture & Classify</p>
                      <p className="text-sm text-black/40 font-bold uppercase tracking-widest">Instant volume & weight estimation</p>
                    </div>
                 </div>
               ) : (
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 backdrop-blur-sm">
                    <Button variant="outline" className="h-14 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs">
                      Retake Photo
                    </Button>
                 </div>
               )}
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full h-12 text-black/40 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-transparent" 
              onClick={() => setStep(1)} 
              disabled={loading}
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to Location
            </Button>
          </div>
        )}

        {step === 3 && wasteData && (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
             <div className="rounded-[3rem] bg-black text-white p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                   <Sparkles className="h-64 w-64" />
                </div>
                <div className="flex justify-between items-start mb-12 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="font-black uppercase tracking-[0.3em] text-[10px] text-white/60">Dynamic Pricing Engine</span>
                   </div>
                   <Badge className="bg-secondary text-white border-none font-black uppercase tracking-widest text-[9px] px-4 py-1 rounded-full shadow-lg shadow-secondary/20">Market Verified</Badge>
                </div>
                <div className="flex items-end justify-between relative z-10">
                   <div>
                      <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40 mb-3">Calculated Mission Fee</p>
                      <p className="text-8xl font-black leading-[0.8] tracking-tighter">GHS {priceData?.pickupFee.toFixed(2)}</p>
                      <div className="flex flex-wrap gap-2 mt-8">
                         <Badge variant="outline" className="border-white/20 text-white font-black uppercase tracking-widest text-[9px] px-3">
                           {wasteData.wasteType.replace(/_/g, ' ')}
                         </Badge>
                         <Badge variant="outline" className="border-white/20 text-white font-black uppercase tracking-widest text-[9px] px-3">
                           ~{wasteData.estimatedWeight_kg}kg Capacity
                         </Badge>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.4em] mb-2">Truck ETA</p>
                      <p className="font-black text-4xl text-primary">{DEMO_ROUTING.etaPickup}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.3em] text-center">Secure Settlement Options</p>
                <div className="grid grid-cols-2 gap-6">
                   {[
                     { id: 'momo', label: 'Mobile Money', icon: Smartphone, color: 'text-yellow-500', desc: 'Instant verification' },
                     { id: 'card', label: 'Debit Card', icon: CreditCard, color: 'text-blue-500', desc: 'Auto-settle' }
                   ].map((p) => (
                     <button 
                        key={p.id} 
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`h-40 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 border-4 transition-all duration-300 ${paymentMethod === p.id ? 'border-black bg-black text-white shadow-2xl scale-105' : 'border-black/5 hover:border-black/20 bg-white'}`}
                     >
                        <p.icon className={`h-10 w-10 ${paymentMethod === p.id ? 'text-white' : p.color}`} />
                        <div className="text-center">
                           <span className="font-black text-[11px] uppercase tracking-widest block">{p.label}</span>
                           <span className={`text-[8px] font-bold uppercase tracking-widest opacity-40 block mt-1 ${paymentMethod === p.id ? 'text-white' : ''}`}>{p.desc}</span>
                        </div>
                     </button>
                   ))}
                </div>
             </div>

             <div className="pt-8">
                <Button 
                  className="w-full h-24 text-2xl font-black rounded-3xl bg-black text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] btn-hover-effect flex items-center justify-center gap-4" 
                  onClick={handleProceedToPayment} 
                  disabled={!paymentMethod}
                >
                   PROCEED TO CHECKOUT <ArrowRight className="h-8 w-8" />
                </Button>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-4 text-center">
              <h3 className="font-headline text-5xl font-black tracking-tighter uppercase leading-[0.9]">Settlement</h3>
              <p className="text-muted-foreground font-medium text-lg">Instant settlement via Ghana's payment rails.</p>
            </div>

            <div className="p-10 rounded-[3rem] bg-muted/20 border-4 border-black/5 space-y-10">
               <div className="flex items-center gap-6 pb-8 border-b border-black/5">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-xl ${paymentMethod === 'momo' ? 'bg-yellow-500' : 'bg-blue-600'}`}>
                    {paymentMethod === 'momo' ? <Smartphone className="h-8 w-8" /> : <CreditCard className="h-8 w-8" />}
                  </div>
                  <div>
                    <p className="font-black text-xl uppercase tracking-tighter">{paymentMethod === 'momo' ? 'MoMo Verification' : 'Card Authorization'}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mission ID: MIS-{Math.floor(Math.random() * 9000) + 1000}</p>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                      {paymentMethod === 'momo' ? 'Enter Wallet Number' : 'Card Identification'}
                    </Label>
                    <Input 
                      placeholder={paymentMethod === 'momo' ? '024 000 0000' : '4242 4242 4242 4242'} 
                      className="h-20 rounded-2xl border-4 border-black/5 font-black text-2xl px-8 shadow-inner"
                      value={paymentDetail}
                      onChange={(e) => setPaymentDetail(e.target.value)}
                    />
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Expiry Date</Label>
                         <Input placeholder="MM / YY" className="h-16 rounded-2xl border-4 border-black/5 font-black text-lg px-6" />
                      </div>
                      <div className="space-y-4">
                         <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Security Code</Label>
                         <Input placeholder="123" className="h-16 rounded-2xl border-4 border-black/5 font-black text-lg px-6" />
                      </div>
                    </div>
                  )}
               </div>

               <div className="flex items-center gap-4 p-6 bg-secondary/10 rounded-3xl text-secondary border-2 border-secondary/20 shadow-sm">
                  <ShieldCheck className="h-8 w-8 shrink-0" />
                  <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
                    Verified Sandbox: No actual funds will be deducted during this demonstration.
                  </p>
               </div>
            </div>

            <Button 
              className="w-full h-24 text-3xl font-black rounded-3xl bg-secondary text-white shadow-[0_25px_50px_rgba(34,197,94,0.3)] btn-hover-effect flex items-center justify-center gap-4" 
              onClick={handleConfirmOrder} 
              disabled={loading || !paymentDetail}
            >
              {loading ? <Loader2 className="h-10 w-10 animate-spin" /> : <><CheckCircle2 className="h-8 w-8" /> AUTHORIZE GHS {priceData?.pickupFee}</>}
            </Button>

            <Button variant="ghost" className="w-full text-black/40 font-black uppercase tracking-[0.3em] text-[10px]" onClick={() => setStep(3)}>
              Modify Settlement Method
            </Button>
          </div>
        )}

        {step === 5 && matchedCollector && (
          <div className="text-center py-12 animate-in zoom-in-95 duration-700 space-y-16">
            <div className="relative mx-auto h-64 w-64">
               <div className="absolute inset-0 bg-secondary/10 rounded-full animate-ping duration-[3s]" />
               <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse duration-[2s]" />
               <div className="relative h-64 w-64 rounded-full bg-black flex items-center justify-center text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border-8 border-white">
                 <Truck className="h-32 w-32 text-primary" />
               </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-6xl font-black tracking-tighter uppercase leading-[0.8]">Network Lock</h2>
              <p className="text-muted-foreground font-medium text-xl max-w-sm mx-auto">Collector {matchedCollector.name} is now moving to your landmark.</p>
            </div>
            
            <Card className="uber-shadow border-none bg-muted/20 p-10 rounded-[3.5rem] border-2 border-black/5">
               <div className="flex items-center gap-8">
                  <div className="h-24 w-24 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative">
                    <Image src={matchedCollector.image} width={200} height={200} alt="Driver" className="object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                     <p className="font-black text-3xl uppercase tracking-tighter leading-none">{matchedCollector.name}</p>
                     <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-widest">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <span>{matchedCollector.rating} Rating</span>
                        </div>
                        <Badge variant="outline" className="border-black/10 text-black/40 font-black uppercase tracking-widest text-[9px]">Verified Fleet</Badge>
                     </div>
                  </div>
                  <div className="text-right flex flex-col gap-3">
                    <div className="bg-black text-white font-black px-6 py-3 rounded-2xl text-xl shadow-lg">{DEMO_ROUTING.etaPickup}</div>
                    <a href={`tel:${matchedCollector.phone}`}>
                      <Button size="sm" variant="outline" className="rounded-2xl border-2 border-primary text-primary hover:bg-primary/10 gap-3 h-14 w-full font-black text-xs uppercase tracking-widest">
                        <Phone className="h-4 w-4" /> CONTACT
                      </Button>
                    </a>
                  </div>
               </div>
            </Card>

            <Button 
              className="w-full h-20 rounded-3xl font-black text-xl bg-black text-white shadow-2xl hover:bg-black/90 transition-all uppercase tracking-tighter" 
              onClick={() => window.location.reload()}
            >
              Enter Live Tracking Map
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Badge({ className, children, variant = 'default' }: any) {
  const variants = {
    default: 'bg-primary text-white border-none',
    secondary: 'bg-secondary text-white border-none',
    outline: 'bg-transparent border-2',
    ghost: 'bg-transparent border-none'
  };
  return <div className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant as keyof typeof variants]} ${className}`}>{children}</div>
}
