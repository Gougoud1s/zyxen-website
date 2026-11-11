import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = { title: 'Page not found | ZYXEN', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col justify-between gap-12 px-gutter pb-8 pt-[160px]">
      <div className="flex flex-col gap-7">
        <p className="label">(404)</p>
        <h1 className="display page-title m-0">Page not found.</h1>
        <p className="m-0 max-w-[460px] text-soft">The page you are looking for has moved or no longer exists.</p>
        <div className="flex flex-wrap gap-8 text-[15px]">
          <Link className="zx-link" href="/">Home</Link>
          <Link className="zx-link" href="/projects">Work</Link>
          <Link className="zx-link text-accent" href="/contact">Contact</Link>
        </div>
      </div>
      <Footer />
    </section>
  );
}
