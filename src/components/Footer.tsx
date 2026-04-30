import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-2xl p-8 mb-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Get Your Cricket Score Free</h3>
          <p className="text-sm text-slate-300 mb-5">Upload your video and get instant AI feedback in seconds.</p>
          <Link href="/analyze" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg shadow-emerald-500/25">
            Upload Your Video Now
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm text-white">
                CV
              </div>
              <span className="font-bold text-lg text-white">CricVerse360</span>
            </div>
            <p className="text-sm">
              The global cricket platform connecting talent with opportunity. AI-powered video analysis and coaching.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
            <div className="space-y-2">
              <Link href="/players" className="block text-sm hover:text-white transition-colors">Player Registry</Link>
              <Link href="/agents" className="block text-sm hover:text-white transition-colors">Agent Marketplace</Link>
              <Link href="/scouting" className="block text-sm hover:text-white transition-colors">Pro Scouting</Link>
              <Link href="/sponsors" className="block text-sm hover:text-white transition-colors">Sponsorships</Link>
              <Link href="/analyze" className="block text-sm hover:text-white transition-colors">AI Video Analysis</Link>
              <Link href="/coaches" className="block text-sm hover:text-white transition-colors">Coach Directory</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Resources</h4>
            <div className="space-y-2">
              <span className="block text-sm">Showcase Calendar</span>
              <span className="block text-sm">Verified Stats Guide</span>
              <span className="block text-sm">T20 League Info</span>
              <span className="block text-sm">Academy Directory</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
            <div className="space-y-2">
              <span className="block text-sm">info@cricverse360.com</span>
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
          <p>&copy; 2026 CricVerse360. All rights reserved. AI-powered cricket analysis platform.</p>
        </div>
      </div>
    </footer>
  );
}
