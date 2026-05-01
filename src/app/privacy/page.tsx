"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/" className="text-sm text-slate-400 hover:text-white">&larr; Home</Link></div>
      <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
        <p className="text-slate-400 text-xs">Last updated: April 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account information:</strong> name, email address, age, location, player profile details, and cricket role/style when you create an account.</li>
            <li><strong>Video data:</strong> cricket batting and bowling videos you upload for AI analysis. Videos are processed on our servers and through Google Gemini AI to generate your analysis report.</li>
            <li><strong>Payment information:</strong> processed securely through Stripe. We do not store your credit card details directly.</li>
            <li><strong>Usage data:</strong> pages viewed, features used, analysis history, scores, and interaction patterns to improve the Platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide AI-powered cricket video analysis using Google Gemini AI</li>
            <li>Generate your performance scores, reports, and improvement plans</li>
            <li>Display your profile on leaderboards and player directories (if you opt in to public profile)</li>
            <li>Process payments and manage your subscription</li>
            <li>Send notifications, updates, and promotional communications</li>
            <li>Monitor and analyze usage trends to improve our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">3. Video Data and AI Processing</h2>
          <p>When you upload a cricket video for analysis:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your video is uploaded to our servers hosted on Amazon Web Services (AWS).</li>
            <li>The video is sent to Google Gemini AI for technique analysis. Google processes the video in accordance with their <a href="https://policies.google.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</li>
            <li>The AI-generated analysis report (scores, feedback, drills) is stored in our database linked to your account.</li>
            <li>On-device analysis (browser-based pose detection) runs locally and does not send video to any server.</li>
          </ul>
          <p className="mt-2"><strong>Video retention:</strong> Uploaded videos are retained for up to 90 days to allow re-analysis and support requests, after which they are automatically deleted. Analysis reports and scores are retained as long as your account is active.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">4. Third-Party Service Providers</h2>
          <p>We share data with the following trusted service providers:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google Gemini AI:</strong> processes uploaded videos to generate analysis reports.</li>
            <li><strong>Amazon Web Services (AWS):</strong> hosts our servers, databases, and video storage.</li>
            <li><strong>Stripe:</strong> processes all payment transactions securely.</li>
            <li><strong>Vercel:</strong> hosts our web application.</li>
          </ul>
          <p className="mt-2">We do not sell your personal information. We do not share your data with advertisers or data brokers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">5. Data Security</h2>
          <p>We implement industry-standard security measures including encryption in transit (TLS/SSL), encrypted storage, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">6. Cookies and Analytics</h2>
          <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and track conversion events (e.g., page views, uploads, purchases). We use first-party analytics only. You can manage cookie preferences through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, correct, or delete your personal data</li>
            <li>Request a copy of the data we hold about you</li>
            <li>Request deletion of your uploaded videos</li>
            <li>Opt out of promotional communications</li>
            <li>Disable your public profile at any time</li>
          </ul>
          <p className="mt-2">To exercise these rights, contact us at <span className="text-emerald-400">info@cricverse360.com</span>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">8. Children and Young Players</h2>
          <p>CricVerse360 is designed for cricket players of all ages. However:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Users under 13 years old must have verifiable parental or guardian consent before creating an account or uploading videos.</li>
            <li>Users aged 13–17 should use the Platform with the knowledge and consent of a parent or guardian.</li>
            <li>Parents/guardians may contact us at any time to review, delete, or restrict processing of their child&apos;s data.</li>
          </ul>
          <p className="mt-2">If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information promptly.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">9. International Data Transfers</h2>
          <p>CricVerse360 is hosted in the United States. If you access the Platform from outside the US (including the EU/EEA, UK, or Australia), your data will be transferred to and processed in the US. By using the Platform, you consent to this transfer. We take reasonable steps to ensure your data is treated securely and in accordance with this Privacy Policy regardless of where it is processed.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">10. California Privacy Rights (CCPA/CPRA)</h2>
          <p>If you are a California resident, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Know what personal information we collect and how it is used</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of the sale or sharing of personal information</li>
          </ul>
          <p className="mt-2">We do not sell personal information as defined under the CCPA/CPRA. We do not use third-party advertising pixels or cross-site tracking. To submit a request, contact us at <span className="text-emerald-400">info@cricverse360.com</span>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page with an updated revision date and, where appropriate, via email notification.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">12. Contact</h2>
          <p>For questions about this Privacy Policy, contact us at <span className="text-emerald-400">info@cricverse360.com</span>.</p>
        </section>
      </div>
    </div>
  );
}
