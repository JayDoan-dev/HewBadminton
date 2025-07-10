import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"] });

export default function SaleBanner() {
  return (
<div className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 py-8">
      <div className="absolute inset-0 flex items-center">
        <div
          className={`animate-marquee whitespace-nowrap text-5xl uppercase text-transparent stroke-text tracking-widest ${bebas.className}`}
        >
          <span className="mx-12">
            Sale • Up to 50% Off • Limited Time • Don’t Miss Out •
          </span>
          <span className="mx-12">
            Sale • Up to 50% Off • Limited Time • Don’t Miss Out •
          </span>
          <span className="mx-12">
            Sale • Up to 50% Off • Limited Time • Don’t Miss Out •
          </span>
        </div>
      </div>
    </div>
  );
}
