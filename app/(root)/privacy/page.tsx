import WelcomeHeader from "@/components/welcome/Header";
import WelcomeFooter from "@/components/welcome/Footer";
import { FadeInUp, FadeIn } from "@/components/ui/animate-on-scroll";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function PrivacyPolicyPage() {
  return (
    <>
      <WelcomeHeader />
      <FadeInUp delay={200} duration={1000}>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 dark:from-gray-900 via-white dark:via-gray-950 to-sky-50 dark:to-gray-900">
          <div className="w-full px-4 py-16 mx-auto max-w-4xl">
            {/* Go Back Button */}
            <div className="mb-8 mt-10">
              <Link href="/welcome">
                <Button
                  variant="outline"
                  className="group hover:bg-sky-50 dark:hover:bg-sky-900/20 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  Go Back
                </Button>
              </Link>
            </div>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Your privacy is important to us. This policy explains how we
                collect, use, and protect your information.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Last updated: January 14, 2025
              </p>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Introduction
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Finova (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
                  committed to protecting your privacy and ensuring the security
                  of your personal and financial information. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard
                  your information when you use our financial management
                  application and services.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  By using our services, you agree to the collection and use of
                  information in accordance with this policy. We will not use or
                  share your information with anyone except as described in this
                  Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Information We Collect
                </h2>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Personal Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  When you create an account, we collect the following personal
                  information:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                  <li>Email address (required for account creation)</li>
                  <li>Username (required for account identification)</li>
                  <li>First and last name (optional)</li>
                  <li>
                    Profile photo (optional, provided by authentication service)
                  </li>
                  <li>
                    Unique user identifier from our authentication provider
                    (Clerk)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Financial Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  To provide our financial management services, we collect and
                  store the following financial data that you voluntarily input:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                  <li>
                    <strong>Transactions:</strong> Date, amount, type
                    (income/expense/transfer), category, description, merchant,
                    account information, recurring status, tags, and notes
                  </li>
                  <li>
                    <strong>Assets:</strong> Asset name, category, current
                    value, change amounts and percentages, descriptions
                  </li>
                  <li>
                    <strong>Liabilities:</strong> Liability name, amount, due
                    dates, categories, recurring status, account information,
                    notes
                  </li>
                  <li>
                    <strong>Budgets:</strong> Category budgets, amounts,
                    spending limits, periods (monthly/quarterly/yearly), active
                    status
                  </li>
                  <li>
                    <strong>Bills:</strong> Bill names, amounts, due dates,
                    categories, payment status, recurring frequency, account
                    information, notes
                  </li>
                  <li>
                    <strong>Financial Goals:</strong> Goal descriptions, target
                    amounts, timelines, progress tracking
                  </li>
                  <li>
                    <strong>Reports:</strong> Generated financial summaries,
                    insights, recommendations, and analysis metadata
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Technical Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We automatically collect certain technical information when
                  you use our services:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Device information and browser type</li>
                  <li>IP address and general location data</li>
                  <li>Usage patterns and feature interactions</li>
                  <li>Performance metrics and error logs</li>
                  <li>Session data and authentication tokens</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                  <li>
                    <strong>Service Provision:</strong> To provide, maintain,
                    and improve our financial management services
                  </li>
                  <li>
                    <strong>Account Management:</strong> To create and manage
                    your user account, authenticate your identity, and provide
                    customer support
                  </li>
                  <li>
                    <strong>Financial Analysis:</strong> To generate reports,
                    insights, and recommendations based on your financial data
                  </li>
                  <li>
                    <strong>Data Processing:</strong> To categorize
                    transactions, calculate budgets, track goals, and provide
                    financial summaries
                  </li>
                  <li>
                    <strong>Security:</strong> To protect against fraud,
                    unauthorized access, and other security threats
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> To comply with applicable
                    laws, regulations, and legal processes
                  </li>
                  <li>
                    <strong>Service Improvement:</strong> To analyze usage
                    patterns and improve our application&apos;s functionality
                    and user experience
                  </li>
                </ul>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Important: We Do NOT Use Your Data For:
                  </h4>
                  <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>
                      Training artificial intelligence models or machine
                      learning algorithms
                    </li>
                    <li>
                      Data brokering or selling your information to third
                      parties
                    </li>
                    <li>
                      Marketing purposes beyond our own service communications
                    </li>
                    <li>
                      Creating user profiles for advertising or commercial
                      purposes
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Information Sharing and Disclosure
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We do not sell, trade, or rent your personal or financial
                  information to third parties. We may share your information
                  only in the following limited circumstances:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Legal Requirements and Law Enforcement
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                    Criminal Activity and Legal Compliance
                  </p>
                  <p className="text-red-700 dark:text-red-300 mb-2">
                    We reserve the right to access, review, and disclose your
                    information to law enforcement authorities, regulatory
                    bodies, or other legal entities when:
                  </p>
                  <ul className="list-disc list-inside text-red-700 dark:text-red-300 space-y-1">
                    <li>Required by law, court order, or legal process</li>
                    <li>
                      We have reasonable grounds to believe you are engaged in
                      criminal activity
                    </li>
                    <li>
                      We suspect fraudulent, illegal, or harmful activities
                    </li>
                    <li>
                      We need to protect our rights, property, or safety, or
                      that of our users
                    </li>
                  </ul>
                  <p className="text-red-700 dark:text-red-300 mt-2 font-semibold">
                    You will be immediately notified if any of your data is
                    accessed or disclosed for legal purposes, unless prohibited
                    by law or court order.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Service Providers
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We may share information with trusted third-party service
                  providers who assist us in operating our application:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>
                    <strong>Clerk:</strong> For user authentication and account
                    management
                  </li>
                  <li>
                    <strong>MongoDB Atlas:</strong> For secure data storage and
                    database services
                  </li>
                  <li>
                    <strong>Vercel:</strong> For application hosting, analytics,
                    and performance monitoring
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Data Security
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We implement industry-standard security measures to protect
                  your information:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                  <li>
                    <strong>Encryption:</strong> All data is encrypted in
                    transit using TLS/SSL protocols and at rest using AES-256
                    encryption
                  </li>
                  <li>
                    <strong>Authentication:</strong> Multi-factor authentication
                    and secure session management through Clerk
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Strict access controls and
                    user authentication for all data access
                  </li>
                  <li>
                    <strong>Database Security:</strong> Secure MongoDB Atlas
                    hosting with network isolation and access controls
                  </li>
                  <li>
                    <strong>Regular Updates:</strong> Continuous security
                    updates and vulnerability assessments
                  </li>
                  <li>
                    <strong>Data Isolation:</strong> User data is strictly
                    isolated and can only be accessed by the authenticated user
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Data Retention
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We retain your information for as long as your account is
                  active and as needed to provide our services. Specifically:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>
                    Account data is retained until you delete your account
                  </li>
                  <li>
                    Financial data is retained to provide historical analysis
                    and reporting
                  </li>
                  <li>
                    Technical logs are retained for security and debugging
                    purposes (typically 12 months)
                  </li>
                  <li>
                    You may request deletion of your data at any time by
                    contacting us
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Your Rights and Choices
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You have the following rights regarding your personal
                  information:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                  <li>
                    <strong>Access:</strong> Request access to your personal and
                    financial data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account
                    and associated data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your data in a
                    machine-readable format
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request restriction of
                    processing in certain circumstances
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your
                    data for certain purposes
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  To exercise these rights, please contact us using the
                  information provided in the &quot;Contact Us&quot; section
                  below.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Third-Party Services
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our application integrates with the following third-party
                  services:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>
                    <strong>Clerk:</strong> User authentication and account
                    management (subject to Clerk&apos;s privacy policy)
                  </li>
                  <li>
                    <strong>Vercel Analytics:</strong> Anonymous usage analytics
                    and performance monitoring
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  These services have their own privacy policies, and we
                  encourage you to review them. We are not responsible for the
                  privacy practices of these third-party services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  International Data Transfers
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure that such transfers
                  comply with applicable data protection laws and implement
                  appropriate safeguards to protect your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Children&apos;s Privacy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our services are not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If we become aware that we have collected
                  personal information from a child under 13, we will take steps
                  to delete such information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Changes to This Privacy Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last updated&quot; date. We
                  encourage you to review this Privacy Policy periodically for
                  any changes.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Your continued use of our services after any modifications to
                  this Privacy Policy constitutes your acceptance of the updated
                  policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Effective Date
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  This Privacy Policy is effective as of September 15, 2025.
                </p>
              </section>
            </div>
          </div>
        </div>
      </FadeInUp>
      <FadeIn delay={0} duration={600}>
        <WelcomeFooter />
      </FadeIn>

      {/* Additional Shielded script for privacy page */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              window.onload = function(){
                // Check if the welcome footer shielded logo exists and initialize it
                var welcomeShielded = document.getElementById('shielded-logo-welcome');
                if (welcomeShielded && typeof ds07o6pcmkorn !== 'undefined') {
                  var frameName = new ds07o6pcmkorn({
                    openElementId: "#shielded-logo-welcome",
                    modalID: "modal-privacy",
                  });
                  frameName.init();
                }
              }
            })();
          `,
        }}
      />
    </>
  );
}

export default PrivacyPolicyPage;
