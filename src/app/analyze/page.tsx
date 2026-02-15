"use client";

import { useState } from "react";
import Link from "next/link";

type AnalysisType = "batting" | "bowling" | "fielding" | "general";

interface AnalysisResult {
  category: string;
  score: number;
  comment: string;
  suggestion: string;
}

const mockResults: Record<AnalysisType, AnalysisResult[]> = {
  batting: [
    { category: "Stance & Setup", score: 78, comment: "Good base position with balanced weight distribution.", suggestion: "Widen stance slightly for better stability against pace." },
    { category: "Backlift", score: 72, comment: "Backlift is slightly angled towards gully region.", suggestion: "Try to bring the bat straighter to improve timing on drives." },
    { category: "Footwork", score: 65, comment: "Limited front foot movement detected.", suggestion: "Practice getting to the pitch of the ball with longer strides." },
    { category: "Follow Through", score: 81, comment: "Excellent follow-through on attacking shots.", suggestion: "Maintain this technique consistently across all shot types." },
    { category: "Shot Selection", score: 70, comment: "Good range of shots but tendency to play across the line.", suggestion: "Work on playing straighter to balls on off-stump." },
  ],
  bowling: [
    { category: "Run-up", score: 75, comment: "Consistent run-up rhythm detected.", suggestion: "Consider adding 2 steps for extra momentum." },
    { category: "Bowling Action", score: 82, comment: "Clean action with good arm speed.", suggestion: "Focus on maintaining front arm position longer for accuracy." },
    { category: "Release Point", score: 68, comment: "Release point varies slightly between deliveries.", suggestion: "Practice releasing at the same point to improve consistency." },
    { category: "Follow Through", score: 77, comment: "Good follow-through direction.", suggestion: "Ensure complete follow-through to prevent injury." },
    { category: "Seam Position", score: 71, comment: "Seam wobble detected on some deliveries.", suggestion: "Focus on wrist position at release for better seam presentation." },
  ],
  fielding: [
    { category: "Ground Fielding", score: 80, comment: "Quick pickup and clean collection.", suggestion: "Get lower to the ball for better handling on rough surfaces." },
    { category: "Throwing Accuracy", score: 73, comment: "Good arm strength but accuracy varies.", suggestion: "Practice target throws from different angles and distances." },
    { category: "Catching", score: 76, comment: "Soft hands technique detected.", suggestion: "Work on high catches with the sun in your eyes." },
    { category: "Agility", score: 69, comment: "Lateral movement could be improved.", suggestion: "Add ladder drills and cone exercises to training." },
  ],
  general: [
    { category: "Overall Technique", score: 74, comment: "Solid fundamentals across disciplines.", suggestion: "Focus on your strongest area to specialize further." },
    { category: "Fitness Level", score: 70, comment: "Good base fitness detected from movement patterns.", suggestion: "Increase cardio and core strength training." },
    { category: "Game Awareness", score: 72, comment: "Shows good decision-making in clips.", suggestion: "Study match situations to improve tactical awareness." },
  ],
};

export default function AnalyzePage() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>("batting");
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setResults(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(mockResults[analysisType]);
    }, 2000);
  };

  const handleUpload = () => {
    setUploaded(true);
    setResults(null);
  };

  const overallScore = results ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3"><Link href="/players?tab=profile" className="text-sm text-slate-400 hover:text-white">← Back to Players Home</Link></div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">AI Video Analysis</h1>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">AI-Powered</span>
        </div>
        <p className="text-slate-400">
          Upload your cricket videos and get instant AI-powered technique analysis with personalized feedback
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Upload Video</h2>
            <div
              onClick={handleUpload}
              className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              {uploaded ? (
                <div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium">Video uploaded</p>
                  <p className="text-xs text-slate-500 mt-1">cricket_practice.mp4 (24.5 MB)</p>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-300">Click to upload video</p>
                  <p className="text-xs text-slate-500 mt-1">MP4, MOV up to 500MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Analysis Type</h2>
            <div className="space-y-2">
              {([
                { value: "batting" as AnalysisType, label: "Batting Technique", icon: "🏏" },
                { value: "bowling" as AnalysisType, label: "Bowling Action", icon: "🎯" },
                { value: "fielding" as AnalysisType, label: "Fielding Skills", icon: "🧤" },
                { value: "general" as AnalysisType, label: "General Assessment", icon: "📊" },
              ]).map((type) => (
                <button
                  key={type.value}
                  onClick={() => { setAnalysisType(type.value); setResults(null); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    analysisType === type.value
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-sm text-white font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!uploaded || analyzing}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              uploaded && !analyzing
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            {analyzing ? "Analyzing..." : "Analyze Video"}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {analyzing && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">Analyzing your {analysisType} video...</p>
              <p className="text-sm text-slate-400 mt-1">Our AI is reviewing frame by frame</p>
            </div>
          )}

          {results && (
            <>
              <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Overall Score</h2>
                    <p className="text-sm text-slate-400">Based on AI analysis of your {analysisType} technique</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-4xl font-bold ${overallScore >= 75 ? "text-emerald-400" : overallScore >= 60 ? "text-amber-400" : "text-red-400"}`}>
                      {overallScore}
                    </p>
                    <p className="text-xs text-slate-400">/ 100</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((result, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">{result.category}</h3>
                      <span className={`text-sm font-bold ${result.score >= 75 ? "text-emerald-400" : result.score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                        {result.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full ${result.score >= 75 ? "bg-emerald-500" : result.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{result.comment}</p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-xs text-blue-400 font-medium mb-1">AI Suggestion</p>
                      <p className="text-sm text-slate-300">{result.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Next Steps</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <Link href="/coaches" className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 hover:border-emerald-500/40 transition-colors">
                    <p className="text-sm font-medium text-emerald-400">Find a Coach</p>
                    <p className="text-xs text-slate-400 mt-1">Connect with coaches who specialize in {analysisType}</p>
                  </Link>
                  <Link href="/players" className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-colors">
                    <p className="text-sm font-medium text-blue-400">Create Player Profile</p>
                    <p className="text-xs text-slate-400 mt-1">Add this analysis to your scouting profile</p>
                  </Link>
                </div>
              </div>
            </>
          )}

          {!analyzing && !results && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">Upload a video to get started</p>
              <p className="text-sm text-slate-500 mt-1">Our AI will analyze your cricket technique and provide detailed feedback</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Batting stance</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Bowling action</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Fielding skills</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Shot selection</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
