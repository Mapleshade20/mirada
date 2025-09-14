import { KeyRound, Loader2, Mail } from "lucide-react";
import type React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { getEmailRateLimit, validateEmail } from "../utils/validation";
import { Button } from "./ui/glass-button";
import { GlassCard } from "./ui/glass-card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, sendVerificationCode, isLoading, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const emailId = useId();
  const codeId = useId();
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCodeSent && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [isCodeSent]);

  const handleSendCode = async () => {
    if (!email) return;

    // Validate email before sending
    if (!validateEmail(email)) {
      toast.error(t("auth.validEmailError"));
      return;
    }

    clearError();
    try {
      await sendVerificationCode(email);
      setIsCodeSent(true);
      setTimer(getEmailRateLimit());
      toast.success(t("auth.codeSentSuccess"));

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
    } catch (_error) {
      toast.error(t("auth.sendCodeError"));
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) return;

    clearError();
    try {
      await login(email, code);
      toast.success(t("auth.loginSuccess"));
      navigate("/dashboard");
    } catch (_error) {
      toast.error(t("auth.invalidCodeError"));
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {t("auth.welcomeTitle")}
        </h1>
        <p className="text-muted-foreground">
          {isCodeSent ? t("auth.codePrompt") : t("auth.signInPrompt")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor={emailId} className="text-foreground font-medium">
            {t("auth.emailLabel")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id={emailId}
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !isCodeSent &&
                  validateEmail(email) &&
                  !isLoading
                ) {
                  handleSendCode();
                }
              }}
              disabled={isCodeSent}
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Verification Code Input */}
        {isCodeSent && (
          <div className="space-y-2">
            <Label htmlFor={codeId} className="text-foreground font-medium">
              {t("auth.codeLabel")}
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={codeInputRef}
                id={codeId}
                type="text"
                placeholder={t("auth.codePlaceholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && code.length === 6 && !isLoading) {
                    handleVerifyCode();
                  }
                }}
                maxLength={6}
                className="pl-10 bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 text-center text-lg tracking-widest"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t("auth.codeSentTo", { email })}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={isCodeSent ? handleVerifyCode : handleSendCode}
          disabled={
            isLoading ||
            !email ||
            (isCodeSent && code.length !== 6) ||
            (!isCodeSent && !validateEmail(email))
          }
          variant="gradient"
          size="lg"
          className="w-full"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isCodeSent ? t("auth.verifyCode") : t("auth.sendCode")}
        </Button>

        {/* Timer & Resend */}
        {isCodeSent && (
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("auth.resendIn", { seconds: timer })}
              </p>
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCodeSent(false);
                  setCode("");
                }}
                className="text-primary hover:text-primary-glow"
              >
                {t("auth.sendNewCode")}
              </Button>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default AuthForm;
