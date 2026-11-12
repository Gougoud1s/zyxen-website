import GreekLanding, { greekMeta } from '@/components/GreekLanding';

const path = '/kataskevi-istoselidon';

export const metadata = greekMeta(path);

export default function Page() {
  return <GreekLanding path={path} />;
}
