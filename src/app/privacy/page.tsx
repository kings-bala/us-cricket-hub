"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">&larr; Dashboard</Link></div>
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
        <p className="text-slate-400 text-xs">Last updated: February 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as your name, email address, profile details, and cricket performance data when you create an account or use our services.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve the Platform</li>
            <li>Personalize your experience and deliver relevant content</li>
            <li>Process transactions and send related information</li>
            <li>Send notifications, updates, and promotional communications</li>
            <li>Monitor and analyze usage trends to improve our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with trusted service providers who assist in operating the Platform, subject to confidentiality obligations.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. Cookies</h2>
          <p>We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can manage cookie preferences through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You may also request a copy of the data we hold about you by contacting us.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Children&apos;s Privacy</h2>
          <p>The Platform is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated revision date.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">9. Contact</h2>
          <p>For questions about this Privacy Policy, contact us at <span className="text-emerald-400">info@crickethubglobal.com</span>.</p>
        </section>
      </div>
    </div>
  );
}
