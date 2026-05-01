"use client";

import Link from "next/link";

export default function ProcessorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/privacy" className="text-sm text-slate-400 hover:text-white">&larr; Privacy Policy</Link></div>
      <h1 className="text-3xl font-bold text-white mb-2">Third-Party Data Processors</h1>
      <p className="text-slate-400 text-xs mb-6">Last updated: April 30, 2026</p>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 text-sm leading-relaxed">
        <p>CricVerse360 (operated by Rising Star Cricket League) uses the following third-party service providers to process data on our behalf. Each provider is contractually bound to process data only as instructed by us and to maintain appropriate security measures.</p>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="py-3 pr-4">Provider</th>
                <th className="py-3 pr-4">Purpose</th>
                <th className="py-3 pr-4">Data Processed</th>
                <th className="py-3 pr-4">Location</th>
                <th className="py-3">Privacy Policy</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800">
                <td className="py-3 pr-4 font-medium text-white">Google Gemini AI</td>
                <td className="py-3 pr-4">AI video analysis and report generation</td>
                <td className="py-3 pr-4">Uploaded cricket videos, analysis prompts</td>
                <td className="py-3 pr-4">United States</td>
                <td className="py-3"><a href="https://policies.google.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Link</a></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 pr-4 font-medium text-white">Amazon Web Services (AWS)</td>
                <td className="py-3 pr-4">Server hosting, database, video storage, Lambda functions</td>
                <td className="py-3 pr-4">All platform data including videos, user accounts, analysis reports</td>
                <td className="py-3 pr-4">United States</td>
                <td className="py-3"><a href="https://aws.amazon.com/privacy/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Link</a></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 pr-4 font-medium text-white">Amazon Cognito</td>
                <td className="py-3 pr-4">User authentication and identity management</td>
                <td className="py-3 pr-4">Email address, password (hashed), authentication tokens</td>
                <td className="py-3 pr-4">United States</td>
                <td className="py-3"><a href="https://aws.amazon.com/privacy/" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Link</a></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-3 pr-4 font-medium text-white">Stripe</td>
                <td className="py-3 pr-4">Payment processing and subscription management</td>
                <td className="py-3 pr-4">Name, email, payment method details</td>
                <td className="py-3 pr-4">United States</td>
                <td className="py-3"><a href="https://stripe.com/privacy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Link</a></td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-white">Vercel</td>
                <td className="py-3 pr-4">Web application hosting, CDN, edge functions</td>
                <td className="py-3 pr-4">Browsing data, IP address, request metadata</td>
                <td className="py-3 pr-4">Global (US-based)</td>
                <td className="py-3"><a href="https://vercel.com/legal/privacy-policy" className="text-emerald-400 hover:underline" target="_blank" rel="noopener noreferrer">Link</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">What We Do NOT Use</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>No third-party analytics services (Google Analytics, Mixpanel, etc.)</li>
            <li>No advertising pixels (Meta Pixel, Google Ads, etc.)</li>
            <li>No cross-site tracking or data brokers</li>
            <li>No third-party email marketing services (all communications through our own systems)</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">Changes to This List</h2>
          <p>We will update this page when we add or remove sub-processors. Material changes will be communicated via our <Link href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link> update process.</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-white mt-6 mb-2">Contact</h2>
          <p>For questions about our data processors, contact <span className="text-emerald-400">info@cricverse360.com</span>.</p>
        </section>
      </div>
    </div>
  );
}
