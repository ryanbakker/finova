"use client";

import { Bug, Lightbulb, Github } from "lucide-react";
import { Button } from "../ui/button";
import { FadeInUp } from "../ui/animate-on-scroll";

function Contact() {
  return (
    <section
      id="welcome-contact"
      className="py-20 bg-gradient-to-tl from-sky-900 dark:from-gray-900 via-sky-800 dark:via-gray-800 to-blue-900 dark:to-blue-950/20 relative overflow-hidden"
    >
      {/* Additional accent elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sky-400/30 to-blue-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl"></div>

      <div className="w-full px-4 mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <FadeInUp delay={0} duration={800}>
          <div className="mb-16 text-center">
            <h2 className="text-4xl uppercase md:text-5xl font-bold text-white mb-3">
              Get In Touch
            </h2>
            <p className="text-lg text-sky-100 max-w-3xl mx-auto">
              Have questions, found a bug, or want to suggest a feature?
              We&apos;d love to hear from you!
            </p>
          </div>
        </FadeInUp>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Report Problems */}
          <FadeInUp delay={400} duration={800}>
            <div className="group">
              <div className="relative p-8 rounded-3xl shadow-2xl border-2 border-red-300/30 bg-white/95 dark:bg-gray-800/95 hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Bug className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    Report Issues
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Found a bug or experiencing issues? Help us improve by
                    reporting them.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    style={{
                      transition: "all 0.3s ease, background 0.3s ease",
                    }}
                    size="lg"
                    onClick={() =>
                      window.open(
                        "https://github.com/ryanbakker/finova/issues/new",
                        "_blank"
                      )
                    }
                  >
                    <Bug className="w-4 h-4" />
                    Report Bug
                  </Button>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Feature Suggestions */}
          <FadeInUp delay={600} duration={800}>
            <div className="group">
              <div className="relative p-8 rounded-3xl shadow-2xl border-2 border-emerald-300/30 bg-white/95 dark:bg-gray-800/95 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    Suggest Features
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Have an idea for a new feature? We&apos;d love to hear your
                    suggestions!
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    style={{
                      transition: "all 0.3s ease, background 0.3s ease",
                    }}
                    size="lg"
                    onClick={() =>
                      window.open(
                        "https://github.com/ryanbakker/finova/issues/new",
                        "_blank"
                      )
                    }
                  >
                    <Lightbulb className="w-4 h-4" />
                    Suggest Feature
                  </Button>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* GitHub Repository */}
          <FadeInUp delay={800} duration={800}>
            <div className="group">
              <div className="relative p-8 rounded-3xl shadow-2xl border-2 border-slate-300/30 bg-white/95 dark:bg-gray-800/95 hover:shadow-xl hover:shadow-slate-500/25 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Github className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    View Repository
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Explore the open source code, contribute to the project, and
                    be part of our community.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-slate-700 to-gray-900 hover:from-slate-800 hover:to-gray-950 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    style={{
                      transition: "all 0.3s ease, background 0.3s ease",
                    }}
                    size="lg"
                    onClick={() =>
                      window.open(
                        "https://github.com/ryanbakker/finova",
                        "_blank"
                      )
                    }
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </Button>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}

export default Contact;
