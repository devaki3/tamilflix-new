import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell, Field, FormError, SubmitButton } from '../components/AuthShell';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function Signup() {
  const { signup, verifyOtp, resendOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'signup' | 'otp'>('signup');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      setError('Please use a valid @gmail.com address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    const result = await signup(name.trim(), email, password);
    setBusy(false);
    if (result.ok && result.demo) {
      toast('Account created (offline mode)', 'success');
      navigate('/', { replace: true });
      return;
    }
    if (result.ok) {
      setStage('otp');
      toast('We sent a verification code to your email', 'info');
      return;
    }
    setError(result.error || 'Could not create your account.');
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const result = await verifyOtp(email, otp.trim());
    setBusy(false);
    if (result.ok) {
      toast('Email verified — welcome to Tamilflix', 'success');
      navigate('/', { replace: true });
      return;
    }
    setError(result.error || 'That code did not work.');
  };

  if (stage === 'otp') {
    return (
      <AuthShell
        eyebrow="Almost there"
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
      eyebrow="Join the theatre"
      title="Create account"
      subtitle="Save films, get recommendations and host Watch Together rooms."
      footer={
      <>
          Already have an account?{' '}
          <Link to="/login" className="text-rose-300 transition-colors duration-200 hover:text-rose-200">
            Sign in
          </Link>
        </>
      }>
      
      <form onSubmit={handleSignup} className="space-y-4">
        <FormError message={error} />
        <Field
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Your name"
          autoComplete="name" />
        
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
          placeholder="At least 6 characters"
          autoComplete="new-password" />
        
        <SubmitButton busy={busy}>Create account</SubmitButton>
      </form>
    </AuthShell>);

}