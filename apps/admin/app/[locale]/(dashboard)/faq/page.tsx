
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FAQ' });

  return {
    title: t('title'),
  };
}

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I create a new user?',
      answer:
        'Navigate to Users > Create User, fill in the required information, and click Create User.',
    },
    {
      question: 'How do I reset my password?',
      answer:
        'Click on "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.',
    },
    {
      question: 'What are the different user roles?',
      answer:
        'There are three roles: Super Admin (full access), Tenant Admin (tenant-scoped access), and User (limited access).',
    },
    {
      question: 'How do I enable 2FA?',
      answer:
        'Go to Settings > Security, click "Enable 2FA", scan the QR code with your authenticator app, and enter the verification code.',
    },
    {
      question: 'Can I export data?',
      answer:
        'Yes, most tables have an export button that allows you to download data in CSV or PDF format.',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-8">Find answers to common questions</p>

      <div className="max-w-3xl space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <summary className="font-medium text-gray-900 cursor-pointer hover:text-primary-main">
              {faq.question}
            </summary>
            <p className="mt-4 text-gray-600">{faq.answer}</p>
          </details>
        ))}
      </div>

      <div className="mt-8 bg-primary-light p-6 rounded-lg border border-primary-main">
        <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          Can&apos;t find the answer you&apos;re looking for? Contact our support team.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-primary-main text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
