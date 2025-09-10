import React, { useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import heroBackground from '../assets/hero-background.jpg';

const Login: React.FC = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Hilo - Social Pairing';
  }, []);

  const handleAuth = async (email: string, code?: string) => {
    // Mock API calls for now
    if (code) {
      console.log('Verifying code:', { email, code });
      // TODO: Call actual API endpoint /api/auth/verify-code
    } else {
      console.log('Sending code to:', email);
      // TODO: Call actual API endpoint /api/auth/send-code
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/80 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <AuthForm onSubmit={handleAuth} />
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Premium social pairing for university students
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary-glow/20 rounded-full blur-xl animate-pulse delay-700" />
    </div>
  );
};

export default Login;