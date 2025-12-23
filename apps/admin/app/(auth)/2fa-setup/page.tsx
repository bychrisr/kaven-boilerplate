'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Logo } from '@/components/logo';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Copy, Check } from 'lucide-react';

export default function Setup2FAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  useEffect(() => {
    const setup2FA = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8000/api/auth/2fa/setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const data = await response.json();
          setQrCode(data.data.qrCodeUrl);
          setSecret(data.data.secret);
          setBackupCodes(data.data.backupCodes);
        } else {
          alert('Failed to setup 2FA');
          router.push('/settings');
        }
      } catch (error) {
        console.error('2FA setup error:', error);
        alert('Failed to setup 2FA');
        router.push('/settings');
      } finally {
        setLoading(false);
      }
    };

    setup2FA();
  }, [router]);

  const copyToClipboard = (text: string, type: 'secret' | 'codes') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: verificationCode,
        }),
      });

      if (response.ok) {
        setStep('complete');
      } else {
        alert('Invalid verification code');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      alert('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-center">
        <Logo size="large" className="justify-center" />
        <div className="h-16 w-16 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-600">Setting up 2FA...</p>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="space-y-6 text-center">
        <Logo size="large" className="justify-center" />

        <Alert severity="success" title="2FA Enabled!">
          Two-factor authentication has been successfully enabled for your account.
          <br />
          <br />
          Make sure to save your backup codes in a safe place.
        </Alert>

        <Button variant="contained" color="primary" onClick={() => router.push('/settings')} fullWidth size="lg">
          Go to Settings
        </Button>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="space-y-6">
        <Logo size="large" className="justify-center" />

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify 2FA Setup</h1>
          <p className="text-gray-600">Enter the 6-digit code from your authenticator app</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <TextField
            id="code"
            type="text"
            label="Verification Code"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            required
            fullWidth
            className="text-center text-2xl tracking-widest"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            loading={verifying}
            disabled={verificationCode.length !== 6}
            fullWidth
            size="lg"
          >
            Verify and Enable 2FA
          </Button>

          <Button variant="text" color="primary" onClick={() => setStep('setup')} fullWidth>
            Back to QR Code
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Logo size="large" className="justify-center" />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enable Two-Factor Authentication</h1>
        <p className="text-gray-600">Scan the QR code with your authenticator app</p>
      </div>

      <div className="space-y-6">
        {/* QR Code */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Step 1: Scan QR Code
          </h3>
          {qrCode && (
            <div className="flex justify-center mb-4">
              <Image src={qrCode} alt="2FA QR Code" width={256} height={256} />
            </div>
          )}
          <p className="text-sm text-gray-600 text-center mb-4">
            Use Google Authenticator, Authy, or any TOTP app
          </p>

          {/* Manual Entry */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-2 text-center">
              Can&apos;t scan? Enter this code manually:
            </p>
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-2">
              <code className="text-sm font-mono text-gray-900">{secret}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(secret, 'secret')}
                className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {copiedSecret ? (
                  <Check className="h-4 w-4 text-success-main" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Backup Codes */}
        <div className="bg-warning-lighter border-2 border-warning-main rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
            Step 2: Save Backup Codes
          </h3>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Store these codes in a safe place. Each code can only be used once.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded px-3 py-2 text-center"
              >
                <code className="text-sm font-mono text-gray-900">{code}</code>
              </div>
            ))}
          </div>

          <Button
            variant="outlined"
            onClick={() => copyToClipboard(backupCodes.join('\n'), 'codes')}
            fullWidth
            startIcon={copiedCodes ? <Check className="h-4 w-4 text-success-main" /> : <Copy className="h-4 w-4" />}
          >
            {copiedCodes ? 'Copied!' : 'Copy All Codes'}
          </Button>
        </div>

        {/* Continue Button */}
        <Button variant="contained" color="primary" onClick={() => setStep('verify')} fullWidth size="lg">
          Continue to Verification
        </Button>

        <Button variant="text" onClick={() => router.push('/settings')} fullWidth>
          Cancel
        </Button>
      </div>
    </div>
  );
}
