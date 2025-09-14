"use client";

import { Star, Check } from "lucide-react";
import { Button } from "../ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { pricingPlans, pricingSection } from "../../constants";
import { FadeInUp } from "../ui/animate-on-scroll";
import { useState } from "react";

function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="welcome-pricing"
      className="py-20 bg-gradient-to-br from-sky-100 dark:from-black via-white dark:via-gray-950 to-sky-100 dark:to-black/90"
    >
      <div className="w-full px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <FadeInUp delay={0} duration={800}>
          <div className="mb-16 text-center">
            <h2 className="text-4xl tracking-tight uppercase md:text-5xl font-bold text-gray-900 dark:text-white mb-3 max-w-[90vw]">
              {pricingSection.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {pricingSection.subtitle}
            </p>
          </div>
        </FadeInUp>

        {/* Pricing Toggle */}
        <FadeInUp delay={200} duration={800}>
          <div className="flex flex-col items-center mb-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex mb-4">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  !isAnnual
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isAnnual
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Annual
              </button>
            </div>
            {isAnnual && (
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Save 17% with Annual Billing
                </span>
              </div>
            )}
          </div>
        </FadeInUp>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <FadeInUp key={index} delay={400 + index * 150} duration={800}>
              <SignUpButton mode="modal">
                <div className="relative cursor-pointer group origin-center">
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-300 origin-center group-hover:scale-110 group-hover:-translate-y-1">
                      <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg group-hover:shadow-xl">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`relative p-8 rounded-3xl shadow-2xl border-2 transition-all duration-300 origin-center group-hover:shadow-3xl group-hover:-translate-y-1 ${
                      plan.isPopular
                        ? `bg-gradient-to-br ${plan.gradient} text-white ${plan.borderColor} group-hover:shadow-amber-200/50`
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white group-hover:border-sky-300 dark:group-hover:border-sky-600 group-hover:shadow-sky-500/30"
                    }`}
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold">
                            {plan.isTrial
                              ? "14"
                              : plan.price[isAnnual ? "annual" : "monthly"]}
                          </span>
                          <span
                            className={
                              plan.isPopular
                                ? "text-sky-100"
                                : "text-gray-600 dark:text-gray-400"
                            }
                          >
                            {plan.isTrial
                              ? "days"
                              : plan.period[isAnnual ? "annual" : "monthly"]}
                          </span>
                        </div>
                      </div>
                      <p
                        className={`mb-6 text-sm max-w-[300px] mx-auto ${
                          plan.isPopular
                            ? "text-sky-100"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {plan.description}
                      </p>

                      {/* Features List */}
                      <div className="mb-8 text-left">
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center gap-3"
                            >
                              <Check
                                className={`w-5 h-5 flex-shrink-0 ${
                                  plan.isPopular
                                    ? "text-green-300"
                                    : "text-green-500 dark:text-green-400"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  plan.isPopular
                                    ? "text-sky-100"
                                    : "text-gray-600 dark:text-gray-300"
                                }`}
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        className={`w-full font-semibold transition-all duration-300 ${
                          plan.isPopular
                            ? "bg-white text-sky-600 hover:bg-sky-50 hover:scale-105 hover:shadow-lg"
                            : "bg-sky-600 text-white hover:bg-sky-700 hover:scale-105 hover:shadow-lg"
                        }`}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </SignUpButton>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={100} duration={800}>
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm max-w-[70vw] mx-auto">
              <strong>Note:</strong> {pricingSection.betaNotice}
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export default Pricing;
