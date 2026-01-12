/**
 * Supported locales for the application
 */
export type Locale = 'pt' | 'en';

/**
 * Translation keys structure
 * This interface forces consistency across locale files
 */
export interface TranslationKeys {
  common: {
    greeting: string;
    footer: {
      copyright: string;
      rightsReserved: string;
      platformName: string;
    };
  };
  emails: {
    welcome: {
      subject: string;
      title: string;
      content: string;
      cta: string;
    };
    verification: {
      subject: string;
      title: string;
      content: string;
      cta: string;
      securityNote: string;
      orLink: string;
    };
    resetPassword: {
      subject: string;
      title: string;
      content: string;
      cta: string;
      securityNote: string;
    };
    invite: {
      subject: string;
      title: string;
      content: string;
      cta: string;
    };
    invoice: {
      subject: string;
      title: string;
      content: string;
      cta: string;
    };
    otp: {
      subject: string;
      title: string;
      content: string;
      validity: string;
    };
    security: {
      subject: string;
      title: string;
      content: string;
      alertDetails: string;
      cta: string;
    };
    paymentFailed: {
      subject: string;
      title: string;
      content: string;
      cta: string;
    };
  };
}
