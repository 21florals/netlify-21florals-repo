import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/Header'

export function Seal({ className = '' }: { className?: string }) {
  return (
    <div className={`relative size-32 md:size-36 ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="seal-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current font-mono uppercase" style={{ fontSize: 15, letterSpacing: 5.2 }}>
          <textPath href="#seal-circle">Forever in bloom · Los Angeles · Est. 2021 ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-4xl md:text-5xl">
        21
      </span>
    </div>
  )
}

export function Marquee({
  items,
  className = '',
}: {
  items: Array<string>
  className?: string
}) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-flex animate-marquee">
        {row.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8 pr-8">
            <span>{item}</span>
            <svg viewBox="0 0 24 24" className="size-5 fill-current opacity-80" aria-hidden>
              <path d="M12 0c1 6 5 11 12 12-7 1-11 6-12 12-1-6-5-11-12-12 7-1 11-6 12-12z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink text-bone mt-24">
      <Marquee
        className="py-5 border-b border-bone/10 font-display italic text-3xl md:text-4xl text-blush"
        items={[
          'Never wilts',
          'Hand-arranged in Los Angeles',
          'Real-touch silk',
          'Same-day LA courier',
          'Made to last decades',
        ]}
      />
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="text-4xl">
            <Logo className="[&>span:first-child]:text-blush" />
          </Link>
          <p className="mt-5 max-w-xs text-sm text-bone/70 leading-relaxed">
            A silk floral atelier in the Los Angeles Arts District, making arrangements that look
            picked this morning and stay that way.
          </p>
        </div>
        <div className="text-sm space-y-2.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 mb-4">Shop</p>
          <Link to="/shop" className="block hover:text-blush">All florals</Link>
          <Link to="/shop" search={{ category: 'Arrangements' }} className="block hover:text-blush">Arrangements</Link>
          <Link to="/shop" search={{ category: 'Stems & Bunches' }} className="block hover:text-blush">Stems & bunches</Link>
          <Link to="/shop" search={{ category: 'Bridal' }} className="block hover:text-blush">Bridal</Link>
        </div>
        <div className="text-sm space-y-2.5 text-bone/80">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 mb-4">Studio</p>
          <p>18543 Devonshire Street, Unit 1008</p>
          <p>Northridge, CA 91324</p>
          <p>Tue–Sat · 10a–6p</p>
          <p>(818) 856-0033</p>
        </div>
        <div className="text-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 mb-4">Care</p>
          <p className="text-bone/80 leading-relaxed">
            Dust monthly with a soft brush or a cool hairdryer. Keep out of harsh direct sun. That's
            it, forever.
          </p>
        </div>
      </div>
      <div className="border-t border-bone/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-6 flex flex-col sm:flex-row gap-2 justify-between text-xs text-bone/50 font-mono">
          <span>© {new Date().getFullYear()} 21 Florals, Los Angeles</span>
          <span>Silk, not cut. Love, not landfill.</span>
        </div>
      </div>
    </footer>
  )
}
