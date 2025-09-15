"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { features } from "../../constants";
import { FadeInUp } from "../ui/animate-on-scroll";

// Custom fade-in animation component for click-triggered animations
function FadeInOnClick({
  children,
  isVisible,
  delay = 0,
  duration = 1000,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  delay?: number;
  duration?: number;
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Immediately hide when not visible
      setIsAnimating(false);
      setShouldRender(false);
    }
  }, [isVisible, delay, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className="transition-all ease-out"
      style={{
        opacity: isAnimating ? 1 : 0,
        transform: isAnimating ? "translateX(0)" : "translateX(20px)",
        transitionDuration: `${duration}ms`,
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}

function Features() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imagesVisible, setImagesVisible] = useState(true);
  const { theme } = useTheme();

  const handleFeatureClick = (index: number) => {
    if (index !== selectedIndex) {
      // Immediately hide current images and update selection
      setImagesVisible(false);
      setSelectedIndex(index);
      // Fade in new images after a brief delay
      setTimeout(() => {
        setImagesVisible(true);
      }, 50);
    }
  };

  return (
    <section id="welcome-features" className="py-20 bg-white dark:bg-gray-900">
      <div className="w-full px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <FadeInUp delay={0} duration={800}>
          <div className="mb-8 lg:mb-16">
            <h2 className="text-4xl lg:text-5xl uppercase font-extrabold lg:font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              <span className="hidden lg:inline">Powerful</span> Features for{" "}
              <br className="hidden lg:block" /> Your Financial Success
            </h2>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-left">
              Everything you need to take control of your finances,{" "}
              <br className="hidden lg:block" /> all in one secure platform.
            </p>
          </div>
        </FadeInUp>

        {/* Mobile/Tablet Layout - 2 columns, no images */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-gradient-to-br hover:from-sky-50 hover:to-blue-50 dark:hover:from-sky-950/20 dark:hover:to-blue-950/20 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-lg hover:shadow-sky-100/50 dark:hover:shadow-sky-900/20 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex flex-row items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/50 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors duration-300" />
                  </div>
                  <h5 className="font-bold text-sky-950 dark:text-sky-100 group-hover:text-sky-800 dark:group-hover:text-sky-50 transition-colors duration-300">
                    {feature.title}
                  </h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Sidebar with images */}
        <div className="hidden lg:flex flex-row justify-between">
          <aside>
            <ul className="flex flex-col gap-1">
              {features.map((feature, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li key={feature.title}>
                    <button
                      type="button"
                      onClick={() => handleFeatureClick(index)}
                      aria-pressed={isSelected}
                      className={`p-6 flex flex-col items-start cursor-pointer min-w-full transition-all duration-300 rounded-lg ${
                        isSelected
                          ? "dark:bg-gray-950/30 bg-gray-100 border-2 border-sky-400 dark:border-sky-500 shadow-xl shadow-sky-200/50 dark:shadow-sky-900/30 ring-2 ring-sky-200/50 dark:ring-sky-800/50"
                          : "bg-transparent border-2 border-transparent  hover:bg-sky-50/30 dark:hover:bg-sky-950/20"
                      }`}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <feature.icon className="w-6 h-6 text-sky-950 dark:text-sky-100" />
                        <h5 className="font-bold text-sky-950 dark:text-sky-100">
                          {feature.title}
                        </h5>
                      </div>
                      <p className="text-sm max-w-[400px] text-left pt-3 dark:text-gray-400 text-gray-900">
                        {feature.description}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
          <div className="relative flex-1 w-full min-h-[700px]">
            <div className="absolute bottom-[100px] right-0 w-full">
              <div className="relative">
                <FadeInOnClick
                  isVisible={imagesVisible}
                  delay={100}
                  duration={900}
                >
                  <Image
                    src={
                      theme === "dark"
                        ? features[selectedIndex].images.dark.desktop
                        : features[selectedIndex].images.light.desktop
                    }
                    alt={`${features[selectedIndex].title} Desktop View`}
                    width={900}
                    height={700}
                    className="absolute rounded-lg shadow-xl scale-115 bottom-[80px] -right-[280px] z-0"
                  />
                </FadeInOnClick>
                <FadeInOnClick
                  isVisible={imagesVisible}
                  delay={300}
                  duration={900}
                >
                  <Image
                    src={
                      theme === "dark"
                        ? features[selectedIndex].images.dark.mobile
                        : features[selectedIndex].images.light.mobile
                    }
                    alt={`${features[selectedIndex].title} Mobile View`}
                    width={200}
                    height={300}
                    className="absolute rounded-lg shadow-xl bottom-[49px] left-[130px] z-20"
                  />
                </FadeInOnClick>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
