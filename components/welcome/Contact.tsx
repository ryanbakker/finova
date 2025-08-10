"use client";

import { Mail, Bug, Lightbulb, Github, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

function Contact() {
  return (
    <section className="py-20 bg-gradient-to-tl from-sky-900 dark:from-gray-900 via-sky-800 dark:via-gray-800 to-blue-900 dark:to-blue-950/20 relative overflow-hidden">
      {/* Additional accent elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sky-400/30 to-blue-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl"></div>

      <div className="w-full px-4 mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl uppercase md:text-5xl font-bold text-white mb-3">
            Get In Touch
          </h2>
          <p className="text-lg text-sky-100 max-w-3xl mx-auto">
            Have questions, found a bug, or want to suggest a feature? We'd love
            to hear from you!
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Email Contact */}
          <div className="group">
            <div className="relative p-8 rounded-3xl shadow-2xl border-2 border-sky-300/30 bg-white/95 dark:bg-gray-800/95 hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Email Us
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Send us a direct message and we'll get back to you within 24
                  hours.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  onClick={() =>
                    (window.location.href = "mailto:contact@finova.com")
                  }
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>

          {/* Report Problems */}
          <div className="group">
            <div className="relative p-8 rounded-3xl shadow-2xl border-2 border-red-300/30 bg-white/95 dark:bg-gray-800/95 hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
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
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://github.com/yourusername/finova/issues",
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

          {/* Feature Suggestions */}
          <div className="group">
            <div className="relative p-8 rounded-3xl shadow-2xl border-2 border-emerald-300/30 bg-white/95 dark:bg-gray-800/95 hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Suggest Features
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Have an idea for a new feature? We'd love to hear your
                  suggestions!
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://github.com/yourusername/finova/discussions",
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
        </div>

        {/* GitHub Repository Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center p-8 rounded-3xl bg-white/95 dark:bg-gray-800/95 border-2 border-sky-300/30 shadow-xl backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl shadow-lg">
              <Github className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Open Source & Community Driven
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Finova is built in the open. Contribute to the project, track
              development progress, and be part of our growing community of
              financial technology enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
                onClick={() =>
                  window.open(
                    "https://github.com/yourusername/finova",
                    "_blank"
                  )
                }
              >
                <Github className="w-4 h-4" />
                View Repository
              </Button>
              <Button
                variant="outline"
                className="border-sky-300 dark:border-sky-600 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 font-semibold transition-all duration-300"
                size="lg"
                onClick={() =>
                  window.open(
                    "https://github.com/yourusername/finova/discussions",
                    "_blank"
                  )
                }
              >
                <MessageCircle className="w-4 h-4" />
                Join Discussion
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
