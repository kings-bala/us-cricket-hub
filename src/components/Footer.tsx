import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#030712] text-slate-400 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-emerald-500/20">
                CV
              </div>
              <span className="font-bold text-lg text-white tracking-tight">CricVerse360</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">The global cricket platform connecting talent with opportunity.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Platform</h4>
            <div className="space-y-2.5">
              <Link href="/players?tab=profile" className="block text-sm text-slate-500 hover:text-white transition-colors">Player Profile</Link>
              <Link href="/analyze" className="block text-sm text-slate-500 hover:text-white transition-colors">AI Analysis</Link>
              <Link href="/scouting" className="block text-sm text-slate-500 hover:text-white transition-colors">Pro Scouting</Link>
              <Link href="/community" className="block text-sm text-slate-500 hover:text-white transition-colors">Community</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Company</h4>
            <div className="space-y-2.5">
              <Link href="/terms" className="block text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="block text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/developers" className="block text-sm text-slate-500 hover:text-white transition-colors">Developers</Link>
              <Link href="/pricing" className="block text-sm text-slate-500 hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Connect</h4>
            <div className="space-y-2.5">
              <a href="mailto:risingstarcricketleague@gmail.com" className="block text-sm text-slate-500 hover:text-white transition-colors">Email Us</a>
              <a href="https://www.instagram.com/risingstarscricket.nj" target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-500 hover:text-white transition-colors">Instagram</a>
              <a href="https://www.facebook.com/risingstarcricketleague" target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-500 hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>

        <div className="section-divider mt-12 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Rising Star Cricket League &amp; CricVerse360. All rights reserved.</p>
          <p className="text-xs text-slate-700 text-center md:text-right max-w-md">Proprietary platform protected under applicable copyright and intellectual property laws.</p>
        </div>
      </div>
    </footer>
  );
}
