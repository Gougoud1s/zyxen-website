import LegalPage, { legalMeta } from '@/components/LegalPage';

export const metadata = legalMeta('privacy', '/privacy-policy');

export default function Page() {
  return <LegalPage doc="privacy" />;
}
