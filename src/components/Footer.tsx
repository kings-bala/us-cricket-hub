import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-2xl p-8 mb-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Get Your Cricket Score Free</h3>
          <p className="text-sm text-slate-300 mb-5">Upload your video and get instant AI feedback in seconds.</p>
          <Link href="/analyze" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg shadow-emerald-500/25">
            Upload Your Video Free
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
              AI-powered cricket video analysis. Upload your video, get your score, improve your game.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
            <div className="space-y-2">
              <Link href="/analyze" className="block text-sm hover:text-white transition-colors">AI Video Analysis</Link>
              <Link href="/sample-analysis" className="block text-sm hover:text-white transition-colors">Sample Analysis</Link>
              <Link href="/leaderboard" className="block text-sm hover:text-white transition-colors">Leaderboard</Link>
              <Link href="/pricing" className="block text-sm hover:text-white transition-colors">Pricing</Link>
              <Link href="/tournaments/jyct" className="block text-sm hover:text-white transition-colors text-amber-400">JYCT 2026</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/processors" className="block text-sm hover:text-white transition-colors">Data Processors</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:info@cricverse360.com" className="block text-sm hover:text-white transition-colors">info@cricverse360.com</a>
              <span className="block text-sm">Available Worldwide</span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm space-y-2">
          <p>&copy; {new Date().getFullYear()} CricVerse360. All rights reserved.</p>
          <div className="flex justify-center gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy#ccpa" className="hover:text-white transition-colors">Do Not Sell or Share My Personal Information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
