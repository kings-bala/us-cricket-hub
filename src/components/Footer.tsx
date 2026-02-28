import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm text-white">
              CV
            </div>
            <span className="font-bold text-lg text-white">CricVerse360</span>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-white font-semibold mb-2 text-sm">Contact</h4>
            <a href="mailto:risingstarcricketleague@gmail.com" className="block text-sm hover:text-white transition-colors">risingstarcricketleague@gmail.com</a>
            <span className="block text-sm">Available Worldwide</span>
            <div className="flex gap-3 mt-3 justify-center md:justify-end">
              <a href="https://www.instagram.com/risingstarscricket.nj" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-800 px-2 py-1 rounded hover:text-white transition-colors">Instagram</a>
              <a href="https://www.facebook.com/risingstarcricketleague" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-800 px-2 py-1 rounded hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Rising Star Cricket League &amp; CricVerse360. All rights reserved.</p>
          <p className="mt-1 text-xs text-slate-600">This platform, its design, code, and content are proprietary and protected under applicable copyright and intellectual property laws. Unauthorized reproduction, distribution, or use is strictly prohibited.</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-slate-700">|</span>
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
