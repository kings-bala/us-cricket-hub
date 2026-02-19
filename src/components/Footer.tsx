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
            <span className="block text-sm">info@crickethubglobal.com</span>
            <span className="block text-sm">Available Worldwide</span>
            <div className="flex gap-3 mt-3 justify-center md:justify-end">
              <span className="text-xs bg-slate-800 px-2 py-1 rounded">Twitter</span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded">Instagram</span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded">YouTube</span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 CricVerse360. All rights reserved. Connecting cricket talent worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
