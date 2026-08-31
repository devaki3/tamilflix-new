import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell, Field, FormError, SubmitButton } from '../components/AuthShell';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function Login() {
  const { login, verifyOtp, resendOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as {from?: string;} | null)?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'login' | 'otp'>('login');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      setError('Please use a valid @gmail.com address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (result.ok) {
      toast(result.demo ? 'Signed in (offline mode)' : 'Welcome back', 'success');
      navigate(redirectTo, { replace: true });
      return;
    }
    if (result.needsVerification) {
      setStage('otp');
      toast('Verify your email to continue', 'info');
      return;
    }
    setError(result.error || 'Could not sign in.');
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const result = await verifyOtp(email, otp.trim());
    setBusy(false);
    if (result.ok) {
      toast('Email verified — welcome in', 'success');
      navigate(redirectTo, { replace: true });
      return;
    }
    setError(result.error || 'That code did not work.');
  };

  if (stage === 'otp') {
    return (
      <AuthShell
        eyebrow="One more step"
        title="Verify your email"
        subtitle={`Enter the 6-digit code we sent to ${email}.`}
        footer={
        <button
          type="button"
          onClick={async () => {
            const result = await resendOtp(email);
            toast(result.ok ? 'New code sent' : 'Could not resend the code', result.ok ? 'success' : 'error');
          }}
          className="text-rose-300 transition-colors duration-200 hover:text-rose-200">
          
            Resend code
          </button>
        }>
        
        <form onSubmit={handleVerify} className="space-y-4">
          <FormError message={error} />
          <Field
            label="Verification code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={setOtp}
            placeholder="000000"
            autoComplete="one-time-code" />
          
          <SubmitButton busy={busy}>Verify & continue</SubmitButton>
        </form>
      </AuthShell>);

  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Your list, rooms and recommendations are waiting."
      footer={
      <>
          New here?{' '}
          <Link to="/signup" className="text-rose-300 transition-colors duration-200 hover:text-rose-200">
            Create an account
          </Link>
        </>
      }>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <FormError message={error} />
        <Field
          label="Email"
          type="email"
          inputMode="email"
          value={email}
          onChange={setEmail}
          placeholder="you@gmail.com"
          autoComplete="email" />
        
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password" />
        
        <SubmitButton busy={busy}>Sign in</SubmitButton>
      </form>
    </AuthShell>);

}