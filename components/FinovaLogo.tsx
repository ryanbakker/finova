import Image from "next/image";
import { Jura } from "next/font/google";

const jura = Jura({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jura",
  display: "swap",
});

function FinovaLogo() {
  return (
    <div className="flex items-center gap-1">
      <Image src="/finova-icon.svg" alt="Finova" width={30} height={30} />
      <span
        className={`${jura.className} text-[20px] font-bold pt-1 bg-gradient-to-tr from-neutral-600 to-neutral-700 dark:from-sky-50 dark:to-neutral-100 bg-clip-text text-transparent tracking-tighter`}
      >
        inova
      </span>
    </div>
  );
}

export default FinovaLogo;
