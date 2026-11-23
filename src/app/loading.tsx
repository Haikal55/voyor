import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-[#080808]/90 backdrop-blur-md select-none transition-all">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(167,192,128,0.08)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 animate-evergreen-breathe">
          <Image
            src="/brand/medallion-evergreen.svg"
            alt="VOYOR Medallion Loading"
            width={96}
            height={96}
            className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(167,192,128,0.35)]"
            priority
          />
        </div>

        <div className="mt-5 flex flex-col items-center space-y-1">
          <span className="font-radiant text-sm tracking-[0.3em] text-[#d3c6aa] uppercase">
            VOYOR
          </span>
          <span className="text-[9px] tracking-[0.25em] text-[#a7c080]/70 uppercase">
            Caricamento...
          </span>
        </div>

        <div className="mt-4 w-20 h-[1px] bg-neutral-900 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a7c080] to-transparent animate-luxury-shimmer" />
        </div>
      </div>
    </div>
  );
}
