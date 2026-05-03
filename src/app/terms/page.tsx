"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TermsContent() {
  const searchParams = useSearchParams();
  const showDraftBanner = searchParams.get("preview") === "admin";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/" className="text-sm text-slate-400 hover:text-white">&larr; Home</Link></div>
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-slate-400 text-xs mb-6">Last updated: April 30, 2026</p>

      {showDraftBanner && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8">
          <p className="text-amber-300 text-sm"><strong>Legal Review Required:</strong> These terms are a comprehensive draft. Rising Star Cricket League should have them reviewed by qualified legal counsel before relying on them.</p>
        </div>
      )}

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">

        {/* 1. Acceptance */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using CricVerse360 (&quot;the Platform&quot;), operated by <strong>Rising Star Cricket League</strong> (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, you may not use the Platform.</p>
          <p className="mt-2">These Terms constitute a legally binding agreement between you and Rising Star Cricket League.</p>
        </section>

        {/* 2. Description of Service */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. Description of Service</h2>
          <p>CricVerse360 provides AI-powered cricket video analysis for <strong>training guidance only</strong>. The Platform uses Google Gemini AI to analyze uploaded batting and bowling videos and generate technique reports, scores, improvement plans, and drills.</p>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mt-3">
            <p className="text-slate-300 text-sm"><strong>Important disclaimers:</strong></p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>AI analysis is for cricket training guidance only.</li>
              <li>It does <strong>not</strong> guarantee selection, scouting, professional performance outcomes, or medical advice.</li>
              <li>Results are based on visible technique in the uploaded video and may not capture all aspects of performance.</li>
              <li>Scores are AI-generated estimates and should not be treated as definitive assessments.</li>
              <li>The Platform does not provide medical, physiotherapy, or injury prevention advice.</li>
            </ul>
          </div>
        </section>

        {/* 3. Eligibility and Minors */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. Eligibility and Minor Users</h2>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">3.1 Age Requirements</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must be at least <strong>13 years old</strong> to create an account.</li>
            <li>If you are <strong>under 18</strong>, you must have the consent and supervision of a parent or legal guardian.</li>
            <li>If you are <strong>under 13</strong> (or under 16 in the EU/EEA), your parent or guardian must create the account on your behalf and provide verifiable consent. See our <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link> Section 9.</li>
          </ul>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">3.2 Parental/Guardian Responsibility</h3>
          <p>If you are a parent or guardian consenting to your child&apos;s use:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are responsible for monitoring your child&apos;s use of the Platform.</li>
            <li>You agree to these Terms on behalf of your child.</li>
            <li>You may review, delete, or restrict your child&apos;s account at any time by contacting <span className="text-emerald-400">info@cricverse360.com</span>.</li>
          </ul>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">3.3 Age Verification</h3>
          <p>During signup, users are asked to confirm their age. If a user indicates they are under 13 (or under 16 in the EU/EEA), the Platform will require parental consent before activating the account.</p>
        </section>

        {/* 4. User Accounts */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree to provide accurate and complete information.</li>
            <li>You agree to notify us immediately of any unauthorized use of your account.</li>
            <li>You may not share your account or create multiple accounts.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
          </ul>
        </section>

        {/* 5. User Content */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. User Content and License Grant</h2>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">5.1 Your Content</h3>
          <p>Any content you submit to the Platform (including videos, profile information, and feedback) remains <strong>your property</strong>.</p>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">5.2 License to Us</h3>
          <p>By uploading content, you grant Rising Star Cricket League a non-exclusive, worldwide, royalty-free license to use, display, process, and distribute your content <strong>solely for the purposes of:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Operating, providing, and improving the Platform</li>
            <li>Generating your AI analysis reports</li>
            <li>Displaying your profile on leaderboards and directories (only if you opt in)</li>
          </ul>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">5.3 Marketing Use Requires Separate Consent</h3>
          <p>This license does <strong>not</strong> permit us to use your content in advertising, marketing, or promotional materials without your <strong>separate, explicit, written consent</strong>. For minor users, parental/guardian consent is required.</p>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">5.4 Content Deletion</h3>
          <p>You may request deletion of your uploaded content at any time. Uploaded videos are automatically deleted after 90 days. See our <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link> Section 7 for full retention details.</p>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">5.5 Content Standards</h3>
          <p>You agree not to upload content that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You do not have the right to share</li>
            <li>Depicts individuals without their knowledge or consent</li>
            <li>Is illegal, harmful, threatening, abusive, defamatory, or objectionable</li>
            <li>Contains malware or malicious code</li>
            <li>Infringes any third party&apos;s intellectual property rights</li>
          </ul>
        </section>

        {/* 6. Intellectual Property */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. Intellectual Property</h2>
          <p>All content, features, functionality, design, source code, graphics, logos, and trademarks on the Platform are the exclusive property of Rising Star Cricket League (operating as CricVerse360) and are protected by international copyright, trademark, and other intellectual property laws.</p>
          <p className="mt-2">You may not copy, reproduce, distribute, transmit, display, sell, license, or otherwise exploit any Platform content without prior written consent.</p>
        </section>

        {/* 7. Prohibited Activities */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Copy, scrape, or harvest any content or data from the Platform</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
            <li>Use unauthorized automated tools to access the Platform (<strong>legitimate search engine crawlers such as Googlebot and Bingbot are expressly permitted</strong> — see our <Link href="/robots.txt" className="text-emerald-400 hover:underline">robots.txt</Link>)</li>
            <li>Attempt to gain unauthorized access to any systems, networks, or other user accounts</li>
            <li>Reproduce or clone the Platform or any of its features</li>
            <li>Remove or alter any proprietary notices or labels</li>
            <li>Use the Platform for any unlawful purpose</li>
            <li>Interfere with or disrupt the Platform or its servers</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </section>

        {/* 8. Payments */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">8. Payments, Subscriptions, and Refunds</h2>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">8.1 Pricing</h3>
          <p>CricVerse360 offers free and paid tiers. Current pricing is displayed on the <Link href="/pricing" className="text-emerald-400 hover:underline">Pricing</Link> page. Prices may change with 30 days&apos; notice.</p>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">8.2 Billing</h3>
          <p>All payments are processed through <strong>Stripe</strong>. By purchasing, you agree to Stripe&apos;s <a href="https://stripe.com/legal" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>.</p>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">8.3 Subscriptions</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Subscriptions renew automatically unless cancelled before the renewal date.</li>
            <li>You may cancel at any time from your account settings or by contacting us.</li>
            <li>Cancellation takes effect at the end of the current billing period.</li>
          </ul>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">8.4 Refund Policy</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>One-time purchases ($4.99):</strong> Refunds within 7 days if the analysis was not generated or was materially defective.</li>
            <li><strong>Subscriptions:</strong> Full refund within 7 days of first payment. After 7 days, remaining time is non-refundable, but you may cancel to prevent future charges.</li>
            <li><strong>Technical issues:</strong> If a technical error prevented your analysis, we will re-run it or issue a refund.</li>
          </ul>
          <p className="mt-2">To request a refund, email <span className="text-emerald-400">info@cricverse360.com</span>.</p>
        </section>

        {/* 9. DMCA */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">9. Intellectual Property Complaints (DMCA)</h2>
          <p>If you believe content on the Platform infringes your copyright, submit a takedown notice to:</p>
          <p className="mt-2"><strong>DMCA Agent</strong><br />Rising Star Cricket League<br />Email: <span className="text-emerald-400">info@cricverse360.com</span></p>
          <p className="mt-2">Your notice must include:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>A description of the copyrighted work you claim has been infringed</li>
            <li>The URL or location of the infringing material</li>
            <li>Your contact information</li>
            <li>A statement of good faith belief the use is not authorized</li>
            <li>A statement under penalty of perjury that the information is accurate</li>
            <li>Your physical or electronic signature</li>
          </ol>
          <p className="mt-2">We will respond to valid DMCA notices within 10 business days.</p>
        </section>

        {/* 10. Disclaimer */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">10. Disclaimer of Warranties</h2>
          <p className="uppercase text-xs text-slate-400">The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express, implied, or statutory. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, non-infringement, and accuracy of AI analysis results. We do not guarantee that the Platform will be uninterrupted, secure, or error-free.</p>
        </section>

        {/* 11. Limitation */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">11. Limitation of Liability</h2>
          <p className="uppercase text-xs text-slate-400">To the maximum extent permitted by law, Rising Star Cricket League shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including reliance on AI analysis results. Our total liability for all claims shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.</p>
        </section>

        {/* 12. Dispute Resolution */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">12. Dispute Resolution</h2>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">12.1 Informal Resolution</h3>
          <p>Before initiating any formal dispute, you agree to first contact us at <span className="text-emerald-400">info@cricverse360.com</span> and attempt to resolve the dispute informally for at least 30 days.</p>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">12.2 Governing Law</h3>
          <p>These Terms shall be governed by the laws of the United States and the State of Delaware, without regard to conflict of law provisions.</p>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">12.3 Jurisdiction</h3>
          <p>Any disputes not resolved informally shall be submitted to the exclusive jurisdiction of the state and federal courts located in Delaware.</p>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">12.4 Class Action Waiver</h3>
          <p>To the extent permitted by law, you agree to resolve disputes individually and waive any right to participate in class actions or class-wide arbitration.</p>
        </section>

        {/* 13. Termination */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">13. Termination</h2>
          <p>We reserve the right to terminate or suspend your access at any time for violation of these Terms. Upon termination, your right to use the Platform ceases immediately. You may request export or deletion of your data within 30 days by contacting <span className="text-emerald-400">info@cricverse360.com</span>.</p>
        </section>

        {/* 14. Indemnification */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">14. Indemnification</h2>
          <p>You agree to indemnify and hold harmless Rising Star Cricket League from any claims, damages, losses, or expenses arising from your use of the Platform, your violation of these Terms, your violation of any third party&apos;s rights, or content you upload.</p>
        </section>

        {/* 15. Changes */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">15. Changes to These Terms</h2>
          <p>We may update these Terms from time to time. We will notify you of material changes by posting updated Terms with a new date and, for significant changes, via email. Continued use after changes constitutes acceptance.</p>
        </section>

        {/* 16. Severability & Entire Agreement */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">16. General</h2>
          <p>If any provision of these Terms is found to be unenforceable, the remaining provisions continue in full force. These Terms, together with our <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>, constitute the entire agreement between you and Rising Star Cricket League regarding CricVerse360.</p>
        </section>

        {/* 17. Contact */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">17. Contact</h2>
          <p><strong>Rising Star Cricket League</strong> (operating as CricVerse360)</p>
          <p>Email: <span className="text-emerald-400">info@cricverse360.com</span></p>
        </section>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><p className="text-slate-400">Loading...</p></div>}>
      <TermsContent />
    </Suspense>
  );
}
