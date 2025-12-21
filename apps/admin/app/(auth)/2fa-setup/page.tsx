'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Logo } from '@/components/logo';
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
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({})
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: verificationCode
        })
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
        
        <div className="bg-success-lighter border border-success-main rounded-lg p-6">
          <div className="h-16 w-16 bg-success-main rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">2FA Enabled!</h2>
          <p className="text-gray-600 mb-4">
            Two-factor authentication has been successfully enabled for your account.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure to save your backup codes in a safe place.
          </p>
          <button
            onClick={() => router.push('/settings')}
            className="bg-primary-main text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="space-y-6">
        <Logo size="large" className="justify-center" />

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify 2FA Setup
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              maxLength={6}
              pattern="[0-9]{6}"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={verifying || verificationCode.length !== 6}
            className="w-full bg-primary-main text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifying ? 'Verifying...' : 'Verify and Enable 2FA'}
          </button>

          <button
            type="button"
            onClick={() => setStep('setup')}
            className="w-full text-sm text-primary-main hover:text-primary-dark"
          >
            Back to QR Code
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Logo size="large" className="justify-center" />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enable Two-Factor Authentication
        </h1>
        <p className="text-gray-600">
          Scan the QR code with your authenticator app
        </p>
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

          <button
            type="button"
            onClick={() => copyToClipboard(backupCodes.join('\n'), 'codes')}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            {copiedCodes ? (
              <>
                <Check className="h-4 w-4 text-success-main" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy All Codes
              </>
            )}
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setStep('verify')}
          className="w-full bg-primary-main text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Continue to Verification
        </button>

        <button
          onClick={() => router.push('/settings')}
          className="w-full text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
