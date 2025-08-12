import { features } from "../../constants";

function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="w-full px-4 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl uppercase md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Powerful Features for <br /> Your Financial Success
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-left">
            Everything you need to take control of your finances, <br /> all in
            one secure platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 md:p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-sky-100 dark:bg-sky-900/30 rounded-xl mb-4 md:mb-6 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/50 transition-colors duration-300">
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-sky-600 dark:text-sky-400" />
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
                {feature.title}
              </h3>

              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
