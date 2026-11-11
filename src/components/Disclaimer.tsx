/** Contribution disclaimer, kept on /projects and every case study (not on the homepage). */
export default function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <p className={`m-0 max-w-[640px] text-[13px] text-muted ${className}`}>
      References are presented exclusively for experience and technical contribution. Unless stated otherwise, these are
      contribution-based projects and do not imply full ownership.
    </p>
  );
}
