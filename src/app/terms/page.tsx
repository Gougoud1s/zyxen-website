import LegalPage, { legalMeta } from '@/components/LegalPage';

export const metadata = legalMeta('terms', '/terms');

export default function Page() {
  return <LegalPage doc="terms" />;
}
