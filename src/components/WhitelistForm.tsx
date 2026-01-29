import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PixelAxolotl from './PixelAxolotl';
import PixelIcon from './PixelIcon';
import FloatingPixels from './FloatingPixels';
import { toast } from '@/hooks/use-toast';
const WhitelistForm: React.FC = () => {
  const [formData, setFormData] = useState({
    gm_gn: '',
    wallet_address: '',
    twitter_handle: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gm_gn || !formData.wallet_address || !formData.twitter_handle || !formData.reason) {
      toast({
        title: "Oops! 🎮",
        description: "Please fill in all the fields, fren!",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.from('whitelist_entries').insert([{
        gm_gn: formData.gm_gn.trim(),
        wallet_address: formData.wallet_address.trim(),
        twitter_handle: formData.twitter_handle.trim(),
        reason: formData.reason.trim()
      }]);
      if (error) throw error;
      setIsSuccess(true);
      toast({
        title: "WAGMI! 🎉",
        description: "You're on the list, fren!"
      });
    } catch (error) {
      console.error('Error submitting:', error);
      toast({
        title: "Error! 😢",
        description: "Something went wrong. Try again!",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSuccess) {
    return <div className="min-h-screen flex items-center justify-center p-4 relative">
        <FloatingPixels />
        <div className="pixel-card max-w-md w-full text-center relative z-10">
          <div className="flex justify-center mb-6">
            <PixelAxolotl size={120} variant="excited" className="pixel-bounce" />
          </div>
          <h2 className="font-pixel text-lg text-primary mb-4 text-shadow-pixel">
            WAGMI FREN!
          </h2>
          <p className="font-pixel-body text-xl text-foreground mb-6">
            You&apos;re officially on the POKI whitelist! 🎉
            <br /><br />
            Keep an eye on your wallet and Twitter DMs. 
            LFG to the moon! 🚀
          </p>
          <div className="flex justify-center gap-2">
            <PixelIcon type="heart" size={24} className="text-primary pixel-pulse" />
            <PixelIcon type="star" size={24} className="text-accent pixel-pulse" style={{
            animationDelay: '0.2s'
          } as React.CSSProperties} />
            <PixelIcon type="heart" size={24} className="text-primary pixel-pulse" style={{
            animationDelay: '0.4s'
          } as React.CSSProperties} />
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingPixels />
      
      <div className="pixel-card max-w-lg w-full relative z-10">
        {/* Header with Axolotl */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex justify-center mb-4">
            <PixelAxolotl size={100} variant="happy" className="pixel-float" />
          </div>
          <h1 className="font-pixel text-xl md:text-2xl text-primary text-center text-shadow-pixel leading-relaxed">
            POKI WHITELIST
          </h1>
          <p className="font-pixel-body text-lg text-muted-foreground mt-2 text-center">
            Join the cutest NFT fam! ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GM/GN Field */}
          <div className="space-y-2">
            <label className="font-pixel text-xs flex items-center gap-2">
              <PixelIcon type="chat" size={18} className="text-primary" />
              Say GM / GN
            </label>
            <input type="text" name="gm_gn" value={formData.gm_gn} onChange={handleChange} placeholder="GM fren! ☀️" className="pixel-input" />
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <label className="font-pixel text-xs flex items-center gap-2">
              <PixelIcon type="wallet" size={18} className="text-primary" />
              Wallet Address
            </label>
            <input type="text" name="wallet_address" value={formData.wallet_address} onChange={handleChange} placeholder="0x..." className="pixel-input" />
          </div>

          {/* Twitter Handle */}
          <div className="space-y-2">
            <label className="font-pixel text-xs flex items-center gap-2">
              <PixelIcon type="twitter" size={18} className="text-primary" />
              X (Twitter) Handle
            </label>
            <input type="text" name="twitter_handle" value={formData.twitter_handle} onChange={handleChange} placeholder="@your_handle" className="pixel-input" />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="font-pixel text-xs flex items-center gap-2">
              <PixelIcon type="heart" size={18} className="text-primary" />
              Why do you want this whitelist?
            </label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Tell us why you're bullish on POKI! 🚀" rows={4} className="pixel-input resize-none" />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isSubmitting} className="pixel-button w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? <>
                <PixelAxolotl size={24} variant="excited" className="pixel-wiggle" />
                <span>SUBMITTING...</span>
              </> : <>
                <PixelIcon type="star" size={20} className="text-primary-foreground" />
                <span>JOIN THE FAM</span>
                <PixelIcon type="star" size={20} className="text-primary-foreground" />
              </>}
          </button>
        </form>

        {/* Footer link to admin */}
        <div className="mt-6 text-center">
          
        </div>
      </div>
    </div>;
};
export default WhitelistForm;