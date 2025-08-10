import { Star, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { pricingPlans, betaFeatures, pricingSection } from "../../constants";

function Pricing() {
  return (
    <section className="py-20 bg-gradient-to-br from-sky-100 dark:from-gray-900 via-white dark:via-gray-800 to-sky-100 dark:to-sky-950/20">
      <div className="w-full px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl uppercase md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            {pricingSection.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {pricingSection.subtitle}
          </p>
        </div>

        {/* Beta Badge */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full shadow-lg">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">{pricingSection.betaBadge}</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="relative">
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`relative p-8 rounded-3xl shadow-2xl border-2 transition-all duration-300 ${
                  plan.isActive
                    ? `bg-gradient-to-br ${plan.gradient} text-white ${plan.borderColor} transform hover:scale-103`
                    : `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl`
                }`}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span
                      className={
                        plan.isActive
                          ? "text-sky-100"
                          : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={`mb-6 ${
                      plan.isActive
                        ? "text-sky-100"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {plan.buttonAction === "signup" ? (
                    <SignUpButton mode="modal">
                      <Button
                        className="w-full bg-white text-sky-600 hover:bg-sky-50 font-semibold"
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </SignUpButton>
                  ) : (
                    <Button
                      className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      size="lg"
                      disabled
                    >
                      {plan.buttonText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Beta Features List */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {pricingSection.betaFeaturesTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            {betaFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 max-w-xs">
                <feature.icon className="w-6 h-6 text-sky-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beta Notice */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-[70vw] mx-auto">
            <strong>Note:</strong> {pricingSection.betaNotice}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
