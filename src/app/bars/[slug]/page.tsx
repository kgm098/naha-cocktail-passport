import { getBar } from "@/lib/bars";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Clock, Instagram, Globe } from "lucide-react";
import { BAR_SLUGS } from "@/lib/bars";

const BAR_IMAGES: Partial<Record<string, string>> = {
  daisy: "/images/bars/daisy.jpg",
  fortuna: "/images/bars/fortuna.jpg",
};

export function generateStaticParams() {
  return BAR_SLUGS.map((slug) => ({ slug }));
}

export default async function BarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bar = getBar(slug);
  if (!bar) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0a] max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-10 px-4 py-4 flex items-center gap-4 border-b border-[#161616]">
        <Link href="/bars" className="text-[#555] hover:text-gold-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="text-[9px] tracking-[0.3em] text-gold-700 uppercase">BAR</div>
          <h1 className="text-sm font-serif text-[#d0c8bc]">{bar.name}</h1>
        </div>
      </div>

      {/* Hero image */}
      <div className="h-52 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center relative overflow-hidden">
        {BAR_IMAGES[bar.slug] ? (
          <Image
            src={BAR_IMAGES[bar.slug]!}
            alt={bar.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 448px) 100vw, 448px"
            priority
          />
        ) : (
          <div className="text-[80px] font-serif font-bold text-[#1e1e1e] select-none">
            {bar.shortName[0]}
          </div>
        )}
        <div className="absolute bottom-4 left-5 z-10">
          <div className="text-[9px] tracking-[0.3em] text-gold-700 uppercase mb-1">BAR</div>
          <div className="text-xl font-serif font-bold text-[#e8e0d4] drop-shadow-lg">{bar.name}</div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        {/* Description */}
        <section>
          <p className="text-sm text-[#888] leading-relaxed">{bar.description}</p>
        </section>

        <div className="gold-divider" />

        {/* Cocktails */}
        <section>
          <h2 className="text-[10px] tracking-[0.4em] text-gold-700 uppercase mb-4">
            SIGNATURE COCKTAILS
          </h2>
          <div className="space-y-4">
            {bar.cocktails.map((cocktail, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-16 bg-[#111] rounded-lg border border-[#1e1e1e] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍸</span>
                </div>
                <div>
                  <div className="text-sm font-serif text-[#d0c8bc] mb-1">{cocktail.name}</div>
                  <div className="text-xs text-[#666] leading-relaxed">{cocktail.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="gold-divider" />

        {/* Info */}
        <section>
          <h2 className="text-[10px] tracking-[0.4em] text-gold-700 uppercase mb-4">
            INFORMATION
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock size={14} className="text-[#555] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-[#888]">{bar.hours}</div>
                <div className="text-xs text-[#555]">定休日: {bar.closedDays}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={14} className="text-[#555] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-[#888]">{bar.address}</div>
            </div>
            {bar.instagram && (
              <a
                href={bar.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gold-700 hover:text-gold-500 transition-colors"
              >
                <Instagram size={14} className="flex-shrink-0" />
                <span className="text-xs">Instagram</span>
              </a>
            )}
            {bar.website && (
              <a
                href={bar.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gold-700 hover:text-gold-500 transition-colors"
              >
                <Globe size={14} className="flex-shrink-0" />
                <span className="text-xs">公式サイト</span>
              </a>
            )}
          </div>
        </section>

        {/* Google Map link */}
        <a
          href={bar.googleMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 rounded-xl border border-[#222] bg-[#111] text-center text-sm text-[#888] hover:border-gold-800 transition-colors"
        >
          Google Map で開く →
        </a>
      </div>

      <div className="pb-16" />
    </main>
  );
}
