"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/" className="text-sm text-slate-400 hover:text-white">&larr; Home</Link></div>
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
        <p className="text-slate-400 text-xs">Last updated: April 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using CricVerse360 (&quot;the Platform&quot;), operated by CricVerse360, you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. Description of Service</h2>
          <p>CricVerse360 provides AI-powered cricket video analysis for training guidance. The Platform uses Google Gemini AI to analyze uploaded batting and bowling videos and generate technique reports, scores, and improvement plans.</p>
          <p className="mt-2"><strong>Important:</strong> AI analysis is for cricket training guidance only. It does not guarantee selection, scouting, professional performance outcomes, or medical advice. Results are based on visible technique in the uploaded video and may not capture all aspects of performance.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. Intellectual Property</h2>
          <p>All content, features, functionality, design, source code, graphics, logos, and trademarks on this Platform are the exclusive property of CricVerse360 and are protected by international copyright, trademark, and other intellectual property laws.</p>
          <p>You may not copy, reproduce, distribute, transmit, display, sell, license, or otherwise exploit any content from this Platform without prior written consent.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Copy, scrape, or harvest any content or data from the Platform</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
            <li>Use unauthorized automated tools to access the Platform (legitimate search engine crawlers are permitted)</li>
            <li>Attempt to gain unauthorized access to any systems or networks</li>
            <li>Reproduce or clone the Platform or any of its features</li>
            <li>Remove or alter any proprietary notices or labels on the Platform</li>
            <li>Use the Platform for any unlawful purpose</li>
            <li>Upload content that you do not have the right to share, or content depicting individuals without their consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Users under 18 must have parental or guardian consent to create an account.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. User Content</h2>
          <p>Any content you submit to the Platform (including videos, profile information, and feedback) remains yours. By uploading content, you grant CricVerse360 a non-exclusive, worldwide, royalty-free license to use, display, process, and distribute it <strong>solely for the purposes of operating, providing, and improving the Platform</strong>.</p>
          <p className="mt-2">This license does not permit CricVerse360 to use your content in advertising or marketing materials without your separate, explicit consent. You may request deletion of your uploaded content at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Payments and Subscriptions</h2>
          <p>Paid features are billed through Stripe. Subscriptions renew automatically unless cancelled before the renewal date. You may cancel your subscription at any time from your account settings or by contacting us. Refunds are handled in accordance with our refund policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">8. Disclaimer of Warranties</h2>
          <p>The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee that the Platform will be uninterrupted, secure, or error-free. AI analysis results are automated and may contain inaccuracies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">9. Limitation of Liability</h2>
          <p>In no event shall CricVerse360 or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to reliance on AI analysis results for training, selection, or performance decisions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">10. Termination</h2>
          <p>We reserve the right to terminate or suspend your access to the Platform at any time, without notice, for any violation of these Terms. Upon termination, your right to use the Platform ceases immediately, but you may request export or deletion of your data.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">11. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">12. Contact</h2>
          <p>For questions about these Terms, contact us at <span className="text-emerald-400">info@cricverse360.com</span>.</p>
        </section>
      </div>
    </div>
  );
}
