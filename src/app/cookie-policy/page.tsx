import LegalPage, { legalMeta } from '@/components/LegalPage';

export const metadata = legalMeta('cookies', '/cookie-policy');

export default function Page() {
  return <LegalPage doc="cookies" />;
}
