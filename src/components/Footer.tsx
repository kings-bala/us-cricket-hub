import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                CV
              </div>
              <span className="font-bold text-lg text-white">Cricket Verse</span>
            </div>
            <p className="text-sm">
              Connecting street cricket talent worldwide with T20 leagues. From gully cricket to global stardom.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Discover</h4>
            <div className="space-y-2">
              <Link href="/players" className="block text-sm hover:text-white transition-colors">Player Registry</Link>
              <Link href="/agents" className="block text-sm hover:text-white transition-colors">Agent Marketplace</Link>
              <Link href="/coaches" className="block text-sm hover:text-white transition-colors">Coach Directory</Link>
              <Link href="/sponsors" className="block text-sm hover:text-white transition-colors">Sponsorships</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">AI Intelligence</h4>
            <div className="space-y-2">
              <Link href="/rankings" className="block text-sm hover:text-white transition-colors">CPI Rankings</Link>
              <Link href="/form-meter" className="block text-sm hover:text-white transition-colors">AI Form Meter</Link>
              <Link href="/combine" className="block text-sm hover:text-white transition-colors">Combine Assessment</Link>
              <Link href="/performance-feed" className="block text-sm hover:text-white transition-colors">Performance Feed</Link>
            </div>
            <h4 className="text-white font-semibold mb-3 mt-5 text-sm">Tools</h4>
            <div className="space-y-2">
              <Link href="/squad-builder" className="block text-sm hover:text-white transition-colors">Squad Builder</Link>
              <Link href="/scouting" className="block text-sm hover:text-white transition-colors">Pro Scouting</Link>
              <Link href="/analyze" className="block text-sm hover:text-white transition-colors">AI Video Analysis</Link>
              <Link href="/dashboard" className="block text-sm hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
            <div className="space-y-2">
              <span className="block text-sm">info@crickethubglobal.com</span>
              <span className="block text-sm">Available Worldwide</span>
              <div className="flex gap-3 mt-3">
                <span className="text-xs bg-slate-800 px-2 py-1 rounded">Twitter</span>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded">Instagram</span>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded">YouTube</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 Cricket Verse. All rights reserved. Connecting cricket talent worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
