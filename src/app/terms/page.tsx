"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">&larr; Dashboard</Link></div>
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
        <p className="text-slate-400 text-xs">Last updated: February 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using CricVerse360 (&quot;the Platform&quot;), operated by Rising Star Cricket League, you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. Intellectual Property</h2>
          <p>All content, features, functionality, design, source code, graphics, logos, and trademarks on this Platform are the exclusive property of Rising Star Cricket League and CricVerse360 and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          <p>You may not copy, reproduce, distribute, transmit, display, sell, license, or otherwise exploit any content from this Platform without prior written consent.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Copy, scrape, or harvest any content or data from the Platform</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
            <li>Use automated tools (bots, crawlers, scrapers) to access the Platform</li>
            <li>Attempt to gain unauthorized access to any systems or networks</li>
            <li>Reproduce or clone the Platform or any of its features</li>
            <li>Remove or alter any proprietary notices or labels on the Platform</li>
            <li>Use the Platform for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. User Content</h2>
          <p>Any content you submit to the Platform remains yours, but you grant Rising Star Cricket League a non-exclusive, worldwide, royalty-free license to use, display, and distribute it in connection with the Platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. Disclaimer of Warranties</h2>
          <p>The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee that the Platform will be uninterrupted, secure, or error-free.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Limitation of Liability</h2>
          <p>In no event shall Rising Star Cricket League, CricVerse360, or their affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">8. Termination</h2>
          <p>We reserve the right to terminate or suspend your access to the Platform at any time, without notice, for any violation of these Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">9. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">10. Contact</h2>
          <p>For questions about these Terms, contact us at <span className="text-emerald-400">info@crickethubglobal.com</span>.</p>
        </section>
      </div>
    </div>
  );
}
