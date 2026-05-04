"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PrivacyContent() {
  const searchParams = useSearchParams();
  const showDraftBanner = searchParams.get("preview") === "admin";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/" className="text-sm text-slate-400 hover:text-white">&larr; Home</Link></div>
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-slate-400 text-xs mb-6">Last updated: April 30, 2026</p>

      {showDraftBanner && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8">
          <p className="text-amber-300 text-sm"><strong>Legal Review Required:</strong> This policy is a comprehensive draft. Rising Star Cricket League should have it reviewed by qualified legal counsel before relying on it.</p>
        </div>
      )}

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">

        {/* 1. Who We Are */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Who We Are</h2>
          <p>CricVerse360 (&quot;the Platform&quot;) is operated by <strong>Rising Star Cricket League</strong> (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;), a company based in the United States. CricVerse360 provides AI-powered cricket video analysis for training guidance.</p>
          <p className="mt-2">Contact: <span className="text-emerald-400">info@cricverse360.com</span></p>
        </section>

        {/* 2. Information We Collect */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. Information We Collect</h2>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account information:</strong> Full name, email address, age, location, player profile details (role, batting/bowling style, academy affiliation), and bio.</li>
            <li><strong>Video data:</strong> Cricket batting and bowling videos you upload for AI analysis. This is the most sensitive data we collect — see Section 4.</li>
            <li><strong>Payment information:</strong> Processed securely through Stripe. We do not store your credit card numbers or CVV on our servers.</li>
            <li><strong>Profile content:</strong> Player cards, shared analysis results, leaderboard entries, and other content you make public.</li>
            <li><strong>Communications:</strong> Emails, support requests, and feedback you send us.</li>
          </ul>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">2.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Usage data:</strong> Pages viewed, features used, buttons clicked, analysis history, scores, and interaction patterns.</li>
            <li><strong>Device information:</strong> Browser type, operating system, screen resolution.</li>
            <li><strong>Log data:</strong> IP address, access times, referring URLs, and error logs.</li>
            <li><strong>Cookies &amp; local storage:</strong> We use secure HttpOnly cookies for authentication and browser localStorage for app preferences. See Section 8.</li>
          </ul>
          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">2.3 Information from Third Parties</h3>
          <p>We do not currently purchase or receive personal information from third-party data brokers.</p>
        </section>

        {/* 3. Legal Basis (GDPR) */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. Legal Basis for Processing (GDPR)</h2>
          <p>If you are in the EU/EEA or UK, we process your personal data under these legal bases:</p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="py-2 pr-4">Purpose</th><th className="py-2">Legal Basis</th>
              </tr></thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Providing the Platform and AI analysis</td><td>Performance of contract (Art. 6(1)(b))</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Processing payments</td><td>Performance of contract (Art. 6(1)(b))</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Service-related communications</td><td>Performance of contract (Art. 6(1)(b))</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Improving the Platform and analytics</td><td>Legitimate interest (Art. 6(1)(f))</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Promotional communications</td><td>Consent (Art. 6(1)(a)) — withdrawable</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Processing video data through AI</td><td>Consent (Art. 6(1)(a)) — given at upload</td></tr>
                <tr><td className="py-2 pr-4">Processing data of minors (under 16 EU)</td><td>Parental consent (Art. 8)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Video Data and AI Processing */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. Video Data and AI Processing</h2>
          <p>This section explains how we handle your video data, which we consider the most sensitive information we process.</p>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">4.1 On-Device Analysis (Browser-Based)</h3>
          <p>When you use our browser-based pose detection features (powered by MediaPipe), video is processed <strong>entirely on your device</strong>. No video data is sent to our servers or any third party. Pose landmarks remain in your browser&apos;s memory and are discarded when you leave the page.</p>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">4.2 Cloud Analysis (Server Upload)</h3>
          <p>When you upload a video for full AI analysis:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li><strong>Upload:</strong> Your video is transmitted over an encrypted connection (TLS) to our servers hosted on Amazon Web Services (AWS) in the United States.</li>
            <li><strong>AI Processing:</strong> The video is sent to <strong>Google Gemini AI</strong> for technique analysis. Google processes the video in accordance with their <a href="https://policies.google.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://ai.google.dev/terms" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">AI Terms</a>. Google does not use API-submitted data to train their general AI models.</li>
            <li><strong>Report Generation:</strong> The AI-generated analysis report (scores, feedback, drills, timestamps) is stored in our database linked to your account.</li>
            <li><strong>Video Retention:</strong> Uploaded videos are retained for <strong>90 days</strong> to allow re-analysis and support requests, then automatically and permanently deleted.</li>
            <li><strong>Deletion on Request:</strong> You may request immediate deletion of your uploaded videos at any time. We will process the request within 30 days.</li>
          </ol>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">4.3 Biometric Data Notice</h3>
          <p>Our on-device pose detection analyzes body positions and movements in your video to identify cricket technique patterns. In some jurisdictions (including Illinois under BIPA, Texas under CUBI, and Washington), this may be classified as biometric data processing.</p>
          <p className="mt-2"><strong>By uploading a video or enabling pose detection, you consent to this processing.</strong> We do not sell, lease, or trade biometric data. Biometric data from on-device processing is not transmitted to our servers. Biometric-related analysis from cloud processing (e.g., stance angles, footwork patterns) is stored only as part of your analysis report and is deleted when your account is deleted or upon request.</p>
          <p className="mt-2">Illinois residents may contact <span className="text-emerald-400">info@cricverse360.com</span> for more information about our biometric data practices.</p>
        </section>

        {/* 5. How We Use Your Information */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide AI-powered cricket video analysis using Google Gemini AI</li>
            <li>Generate performance scores, reports, improvement plans, and drills</li>
            <li>Display your profile on leaderboards and player directories (only if you opt in)</li>
            <li>Process payments and manage your subscription through Stripe</li>
            <li>Send service-related notifications (analysis complete, account changes)</li>
            <li>Send promotional communications (only with your consent — opt out any time)</li>
            <li>Monitor and analyze usage trends to improve the Platform</li>
            <li>Detect and prevent fraud, abuse, and security incidents</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        {/* 6. Third-Party Service Providers */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. Third-Party Service Providers</h2>
          <p>We share data with the following trusted service providers who process data on our behalf:</p>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="py-2 pr-4">Provider</th><th className="py-2 pr-4">Purpose</th><th className="py-2 pr-4">Data Shared</th><th className="py-2">Location</th>
              </tr></thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800"><td className="py-2 pr-4 font-medium">Google Gemini AI</td><td className="py-2 pr-4">Video analysis</td><td className="py-2 pr-4">Uploaded videos</td><td className="py-2">US</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4 font-medium">Amazon Web Services</td><td className="py-2 pr-4">Hosting, storage</td><td className="py-2 pr-4">All platform data</td><td className="py-2">US</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4 font-medium">Stripe</td><td className="py-2 pr-4">Payments</td><td className="py-2 pr-4">Name, email, payment</td><td className="py-2">US</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4 font-medium">Vercel</td><td className="py-2 pr-4">Web hosting, CDN</td><td className="py-2 pr-4">Browsing data, IP</td><td className="py-2">Global</td></tr>
                <tr><td className="py-2 pr-4 font-medium">Amazon Cognito</td><td className="py-2 pr-4">Authentication</td><td className="py-2 pr-4">Email, password (hashed)</td><td className="py-2">US</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">We do not sell your personal information. We do not share your data with advertisers or data brokers. A full list of sub-processors is available at <Link href="/processors" className="text-emerald-400 hover:underline">/processors</Link>.</p>
        </section>

        {/* 7. Data Retention */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Data Retention</h2>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="py-2 pr-4">Data Type</th><th className="py-2">Retention Period</th>
              </tr></thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Account information</td><td className="py-2">Until you delete your account</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Uploaded videos</td><td className="py-2">90 days, then auto-deleted</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Analysis reports &amp; scores</td><td className="py-2">Until you delete your account</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Payment records</td><td className="py-2">As required by law (typically 7 years)</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2 pr-4">Usage/analytics data</td><td className="py-2">24 months from collection</td></tr>
                <tr><td className="py-2 pr-4">Support communications</td><td className="py-2">3 years from last contact</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">When you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law.</p>
        </section>

        {/* 8. Cookies and Local Storage */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">8. Cookies and Local Storage</h2>
          <p>CricVerse360 uses <strong>secure HttpOnly cookies</strong> for authentication and <strong>browser localStorage</strong> for non-sensitive data:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>HttpOnly cookies: Session authentication (not accessible to JavaScript)</li>
            <li>App preferences and settings (localStorage)</li>
            <li>Cached analysis data for offline access (localStorage)</li>
          </ul>
          <p className="mt-2">We use <strong>first-party analytics only</strong> — we track events through our own API, not through third-party services like Google Analytics. We do not use advertising pixels, cross-site tracking, or third-party cookies.</p>
          <p className="mt-2">You can clear cookies and localStorage data at any time through your browser settings.</p>
        </section>

        {/* 9. Children and Young Players */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">9. Children and Young Players</h2>
          <p>CricVerse360 is designed for cricket players of all ages, including youth players in U13, U15, U17, and U19 categories. We take the privacy of minors seriously.</p>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">9.1 Users Under 13 (COPPA — US)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users under 13 <strong>must have verifiable parental or guardian consent</strong> before creating an account or uploading videos.</li>
            <li>During signup, users who indicate they are under 13 will be prompted to provide a parent/guardian email address.</li>
            <li>Parents/guardians may at any time: review their child&apos;s data, request deletion, or refuse further collection by emailing <span className="text-emerald-400">info@cricverse360.com</span>.</li>
            <li>If we learn we have collected data from a child under 13 without parental consent, we will delete it promptly.</li>
          </ul>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">9.2 Users Under 16 (GDPR-K — EU/EEA/UK)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users under 16 in the EU/EEA require parental or guardian consent under GDPR Article 8.</li>
            <li>We apply the same parental consent mechanism described in 9.1.</li>
            <li>We design our platform with minors in mind: no manipulative design patterns, minimal data collection, clear and age-appropriate information.</li>
          </ul>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">9.3 Users Aged 13–17</h3>
          <p>Users aged 13–17 should use the Platform with the knowledge and guidance of a parent or guardian. Parents/guardians may contact us at any time to review, delete, or restrict processing of their child&apos;s data.</p>
        </section>

        {/* 10. Your Privacy Rights */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">10. Your Privacy Rights</h2>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">10.1 All Users</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access</strong> the personal data we hold about you</li>
            <li><strong>Correct</strong> inaccurate personal data</li>
            <li><strong>Delete</strong> your personal data and uploaded videos</li>
            <li><strong>Export</strong> your data in a portable format</li>
            <li><strong>Opt out</strong> of promotional communications</li>
            <li><strong>Disable</strong> your public profile at any time</li>
          </ul>
          <p className="mt-2">To exercise these rights, email <span className="text-emerald-400">info@cricverse360.com</span>. We will respond within 30 days.</p>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">10.2 EU/EEA/UK Residents (GDPR)</h3>
          <p>In addition to the above, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Restrict processing</strong> of your personal data</li>
            <li><strong>Object to processing</strong> based on legitimate interest</li>
            <li><strong>Data portability</strong> — receive your data in a structured, machine-readable format</li>
            <li><strong>Withdraw consent</strong> at any time (without affecting prior lawful processing)</li>
            <li><strong>Lodge a complaint</strong> with your local data protection authority</li>
          </ul>

          <h3 id="ccpa" className="text-sm font-semibold text-slate-200 mt-4 mb-1">10.3 California Residents (CCPA/CPRA)</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Know</strong> what personal information we collect, use, and disclose</li>
            <li><strong>Delete</strong> your personal information</li>
            <li><strong>Opt out of the sale or sharing</strong> of personal information</li>
            <li><strong>Non-discrimination</strong> — we will not treat you differently for exercising your rights</li>
          </ul>
          <p className="mt-2"><strong>We do not sell personal information</strong> as defined under CCPA/CPRA. We do not use third-party advertising pixels or cross-site tracking. To submit a CCPA request, email <span className="text-emerald-400">info@cricverse360.com</span> or use the &quot;Do Not Sell or Share My Personal Information&quot; link in the footer.</p>

          <h3 className="text-sm font-semibold text-slate-200 mt-4 mb-1">10.4 Other Jurisdictions</h3>
          <p>If you are in Australia (Privacy Act 1988), Canada (PIPEDA), or other jurisdictions with data protection laws, you may have additional rights. Contact us and we will accommodate your request to the extent required by applicable law.</p>
        </section>

        {/* 11. International Data Transfers */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">11. International Data Transfers</h2>
          <p>CricVerse360 is hosted in the United States. If you access the Platform from outside the US, your data will be transferred to and processed in the United States.</p>
          <p className="mt-2">For transfers from the EU/EEA/UK, we rely on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The EU-US Data Privacy Framework (where applicable)</li>
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>Your explicit consent (provided when you create an account and upload videos)</li>
          </ul>
        </section>

        {/* 12. Data Security */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">12. Data Security</h2>
          <p>We implement industry-standard security measures including encryption in transit (TLS/SSL), encryption at rest, access controls, and regular security reviews. However, no method of transmission over the Internet is 100% secure and we cannot guarantee absolute security.</p>
          <p className="mt-2">If we become aware of a data breach affecting your personal information, we will notify you and the relevant authorities as required by applicable law.</p>
        </section>

        {/* 13. Changes */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">13. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy with a new date and, where appropriate, via email. Continued use of the Platform after changes constitutes acceptance.</p>
        </section>

        {/* 14. Contact */}
        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">14. Contact</h2>
          <p><strong>Rising Star Cricket League</strong> (operating as CricVerse360)</p>
          <p>Email: <span className="text-emerald-400">info@cricverse360.com</span></p>
          <p className="mt-2 text-xs text-slate-500">For EU/EEA residents: If you are unsatisfied with our response, you have the right to lodge a complaint with your local supervisory authority.</p>
        </section>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><p className="text-slate-400">Loading...</p></div>}>
      <PrivacyContent />
    </Suspense>
  );
}
