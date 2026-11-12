import GreekLanding, { greekMeta } from '@/components/GreekLanding';

const path = '/kataskevi-efarmogon';

export const metadata = greekMeta(path);

export default function Page() {
  return <GreekLanding path={path} />;
}
