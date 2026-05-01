import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-3xl font-bold text-white mb-3">Coming Soon</h1>
        <p className="text-slate-400 mb-8">
          This feature is under development. We&apos;re working hard to bring it to you soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/analyze"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Try AI Analysis
          </Link>
          <Link
            href="/"
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-semibold border border-slate-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
