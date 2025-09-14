"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "fade";
  distance?: number;
}

export function AnimateOnScroll({
  children,
  delay = 0,
  duration = 600,
  className = "",
  direction = "up",
  distance = 20,
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [delay]);

  const getTransformStyles = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return `translateY(${distance}px)`;
        case "down":
          return `translateY(-${distance}px)`;
        case "left":
          return `translateX(${distance}px)`;
        case "right":
          return `translateX(-${distance}px)`;
        case "fade":
          return "translateY(0)";
        default:
          return `translateY(${distance}px)`;
      }
    }
    return "translateY(0) translateX(0)";
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransformStyles(),
        transitionDuration: `${duration}ms`,
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
}

// Convenience components for common animations
export function FadeInUp({
  children,
  delay = 0,
  className = "",
}: Omit<AnimateOnScrollProps, "direction">) {
  return (
    <AnimateOnScroll direction="up" delay={delay} className={className}>
      {children}
    </AnimateOnScroll>
  );
}

export function FadeInDown({
  children,
  delay = 0,
  className = "",
}: Omit<AnimateOnScrollProps, "direction">) {
  return (
    <AnimateOnScroll direction="down" delay={delay} className={className}>
      {children}
    </AnimateOnScroll>
  );
}

export function FadeInLeft({
  children,
  delay = 0,
  className = "",
}: Omit<AnimateOnScrollProps, "direction">) {
  return (
    <AnimateOnScroll direction="left" delay={delay} className={className}>
      {children}
    </AnimateOnScroll>
  );
}

export function FadeInRight({
  children,
  delay = 0,
  className = "",
}: Omit<AnimateOnScrollProps, "direction">) {
  return (
    <AnimateOnScroll direction="right" delay={delay} className={className}>
      {children}
    </AnimateOnScroll>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: Omit<AnimateOnScrollProps, "direction">) {
  return (
    <AnimateOnScroll direction="fade" delay={delay} className={className}>
      {children}
    </AnimateOnScroll>
  );
}
