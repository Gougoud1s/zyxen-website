import GreekLanding, { greekMeta } from '@/components/GreekLanding';

const path = '/kataskevi-eshop';

export const metadata = greekMeta(path);

export default function Page() {
  return <GreekLanding path={path} />;
}
