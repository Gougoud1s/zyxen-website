import Link from 'next/link';
import Footer from './Footer';

/** Giant "Next → page" link plus the footer that closes every inner page. */
export default function PageEnd({ href, label }: { href: string; label: string }) {
  return (
    <section className="mt-20 flex flex-col gap-20 border-t border-line px-gutter pb-8 pt-28 sm:pt-36">
      <div className="flex flex-col gap-3.5">
        <p className="label">Next</p>
        <Link href={href} className="zx-big display text-[clamp(56px,11vw,180px)] leading-[0.86] tracking-[-0.065em]">
          {label} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <Footer />
    </section>
  );
}
