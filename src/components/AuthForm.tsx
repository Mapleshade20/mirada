import React, { useState } from 'react';
import { GlassCard } from './ui/glass-card';
import { Button } from './ui/glass-button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, KeyRound, Loader2 } from 'lucide-react';

interface AuthFormProps {
  onSubmit: (email: string, code?: string) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleSendCode = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      await onSubmit(email);
      setIsCodeSent(true);
      setTimer(60);
      
      // Start countdown timer
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to send code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) return;
    
    setIsLoading(true);
    try {
      await onSubmit(email, code);
    } catch (error) {
      console.error('Failed to verify code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Welcome to Hilo
        </h1>
        <p className="text-muted-foreground">
          {isCodeSent ? 'Enter the verification code' : 'Sign in to continue'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your.email@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isCodeSent}
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Verification Code Input */}
        {isCodeSent && (
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground font-medium">
              Verification Code
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="pl-10 bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 text-center text-lg tracking-widest"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Code sent to {email}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={isCodeSent ? handleVerifyCode : handleSendCode}
          disabled={isLoading || (!email || (isCodeSent && code.length !== 6))}
          variant="gradient"
          size="lg"
          className="w-full"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isCodeSent ? 'Verify Code' : 'Send Verification Code'}
        </Button>

        {/* Timer & Resend */}
        {isCodeSent && (
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in {timer}s
              </p>
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCodeSent(false);
                  setCode('');
                }}
                className="text-primary hover:text-primary-glow"
              >
                Send new code
              </Button>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default AuthForm;