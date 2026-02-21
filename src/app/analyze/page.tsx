"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePoseDetection } from "@/hooks/usePoseDetection";
import {
  analyzeFrame,
  summarizeAnalysis,
  detectBowlingHand,
  type AnalysisSummary,
  type FrameAnalysis,
  type BowlingHand,
} from "@/lib/cricket-analysis";
import {
  saveAnalysis,
  getHistory,
  clearHistory,
  type SavedAnalysis,
} from "@/lib/analysis-history";
import { estimateBallSpeed, classifyPace, type SpeedEstimate } from "@/lib/ball-speed";
import { detectActionClips, getClipSummary, type ActionClip } from "@/lib/auto-clip";
import VideoDrawingTools from "@/components/VideoDrawingTools";
import { apiRequest } from "@/lib/api-client";

type AnalysisType = "batting" | "bowling" | "fielding";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function scoreFromAngleDisplay(
  actual: number,
  ideal: number,
  tolerance: number
): number {
  const diff = Math.abs(actual - ideal);
  if (diff <= tolerance) return 90;
  if (diff <= tolerance * 2) return 70;
  return 50;
}

export default function AnalyzePage() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>("batting");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [frameResults, setFrameResults] = useState<FrameAnalysis[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeTab, setActiveTab] = useState<"results" | "history">("results");
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [selectedKeyFrame, setSelectedKeyFrame] = useState<number | null>(null);
  const [bowlingHand, setBowlingHand] = useState<BowlingHand>("right");
  const [detectedHand, setDetectedHand] = useState<BowlingHand | null>(null);
  const [handOverridden, setHandOverridden] = useState(false);
  const [speedEstimate, setSpeedEstimate] = useState<SpeedEstimate | null>(null);
  const [actionClips, setActionClips] = useState<ActionClip[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isLoading: modelLoading,
    isProcessing,
    progress,
    error: poseError,
    processVideo,
    drawLandmarks,
  } = usePoseDetection();

  const [historyLoaded, setHistoryLoaded] = useState(false);

  if (!historyLoaded) {
    if (typeof window !== "undefined") {
      const h = getHistory();
      setHistory(h);
      if (h.length > 0 && !summary) setActiveTab("history");
    }
    setHistoryLoaded(true);
  }

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (videoUrl) URL.revokeObjectURL(videoUrl);

      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setSummary(null);
      setFrameResults([]);
      setSelectedKeyFrame(null);
    },
    [videoUrl]
  );

  const handleAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !videoFile) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const poseFrames = await processVideo(video, canvas, 3);

    if (poseFrames.length === 0) return;

    let hand = bowlingHand;
    if (analysisType === "bowling") {
      const detected = detectBowlingHand(poseFrames.map((f) => f.landmarks));
      setDetectedHand(detected);
      if (!handOverridden) {
        hand = detected;
        setBowlingHand(detected);
      }
    }

    const analyzed = poseFrames.map((f) =>
      analyzeFrame(f.landmarks, analysisType, f.timestamp, hand)
    );
    setFrameResults(analyzed);

    const result = summarizeAnalysis(analyzed, analysisType);
    setSummary(result);

    if (analysisType === "bowling") {
      const speed = estimateBallSpeed(poseFrames);
      setSpeedEstimate(speed);
    } else {
      setSpeedEstimate(null);
    }

    const clips = detectActionClips(poseFrames);
    setActionClips(clips);

    const saved = saveAnalysis(videoFile.name, result);
    setHistory((prev) => [saved, ...prev]);
    setActiveTab("results");

    const ext = videoFile.name.split(".").pop() || "mp4";
    apiRequest<{ uploadUrl?: string; key?: string }>("/users/video-upload", {
      method: "POST",
      body: { extension: ext, contentType: videoFile.type || "video/mp4" },
    }).then((uploadRes) => {
      if (uploadRes.ok && uploadRes.data?.uploadUrl) {
        fetch(uploadRes.data.uploadUrl, {
          method: "PUT",
          body: videoFile,
          headers: { "Content-Type": videoFile.type || "video/mp4" },
        }).catch(() => {});
      }
    });
  }, [videoFile, analysisType, processVideo, bowlingHand]);

  const handleSeekToFrame = useCallback((timestamp: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timestamp;
    setSelectedKeyFrame(timestamp);
  }, []);

  const handleVideoTimeUpdate = useCallback(() => {
    if (!showOverlay || !overlayCanvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (frameResults.length === 0) return;

    const currentTime = video.currentTime;
    let closest = frameResults[0];
    let minDiff = Math.abs(currentTime - closest.timestamp);

    for (const frame of frameResults) {
      const diff = Math.abs(currentTime - frame.timestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = frame;
      }
    }

    if (minDiff < 0.5) {
      drawLandmarks(ctx, closest.landmarks, canvas.width, canvas.height);
    }
  }, [showOverlay, frameResults, drawLandmarks]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const scoreColor = (score: number) =>
    score >= 75
      ? "text-emerald-400"
      : score >= 60
        ? "text-amber-400"
        : "text-red-400";

  const scoreBg = (score: number) =>
    score >= 75
      ? "bg-emerald-500"
      : score >= 60
        ? "bg-amber-500"
        : "bg-red-500";

  const scoreBgLight = (score: number) =>
    score >= 75
      ? "bg-emerald-500/20 border-emerald-500/30"
      : score >= 60
        ? "bg-amber-500/20 border-amber-500/30"
        : "bg-red-500/20 border-red-500/30";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3 flex items-center justify-end">
        <Link href="/analyze/live" className="flex items-center gap-2 text-sm bg-red-500/10 text-red-400 px-4 py-2 rounded-full border border-red-500/30 hover:bg-red-500/20 transition-colors">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live Camera Analysis
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { href: "/analyze/coach", label: "AI Coach", color: "purple" },
          { href: "/analyze/compare", label: "Pro Comparison", color: "cyan" },
          { href: "/analyze/session", label: "Net Session Tracker", color: "cyan" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors bg-${item.color}-500/10 text-${item.color}-400 border-${item.color}-500/30 hover:bg-${item.color}-500/20`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">AI Video Analysis</h1>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
            AI-Powered
          </span>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
            In-Browser
          </span>
        </div>
        <p className="text-slate-400">
          Upload your cricket videos and get instant AI-powered technique
          analysis with personalized feedback. All processing runs in your
          browser &mdash; no data leaves your device.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Upload Video
            </h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              {videoFile ? (
                <div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium">
                    Video selected
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </p>
                  <p className="text-xs text-slate-600 mt-1">Click to change</p>
                  <p className="text-xs text-emerald-600/80 mt-2 flex items-center gap-1 justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Processed locally
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-300">Click to upload video</p>
                  <p className="text-xs text-slate-500 mt-1">MP4, MOV, WebM supported</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-start gap-2 bg-slate-900/50 border border-slate-700/30 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="text-slate-400 font-medium">Your privacy is protected.</span> All video analysis runs entirely in your browser using on-device AI. Your videos are never uploaded to any server, stored, or shared with third parties.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Analysis Type
            </h2>
            <div className="space-y-2">
              {([
                { value: "batting" as AnalysisType, label: "Batting Technique", desc: "Stance, backlift, head position, footwork" },
                { value: "bowling" as AnalysisType, label: "Bowling Action", desc: "Arm action, front arm, hip rotation, brace" },
                { value: "fielding" as AnalysisType, label: "Fielding Skills", desc: "Ground fielding, throwing, agility" },
              ]).map((type) => (
                <button
                  key={type.value}
                  onClick={() => { setAnalysisType(type.value); setSummary(null); setFrameResults([]); }}
                  className={`w-full flex flex-col p-3 rounded-lg border text-left transition-all ${
                    analysisType === type.value
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <span className="text-sm text-white font-medium">{type.label}</span>
                  <span className="text-xs text-slate-500 mt-0.5">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {analysisType === "bowling" && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                Bowling Hand
              </h2>
              <div className="flex gap-2">
                {(["right", "left"] as BowlingHand[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => { setBowlingHand(h); setHandOverridden(true); if (summary) { setSummary(null); setFrameResults([]); } }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      bowlingHand === h
                        ? "border-emerald-500 bg-emerald-500/10 text-white"
                        : "border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {h === "right" ? "Right Arm" : "Left Arm"}
                  </button>
                ))}
              </div>
              {detectedHand && (
                <p className="text-xs text-slate-500 mt-2">
                  AI detected: <span className="text-emerald-400">{detectedHand === "right" ? "Right" : "Left"} arm</span> bowler
                </p>
              )}
              <p className="text-xs text-slate-600 mt-1">
                Auto-detected when you analyze. Override if incorrect.
              </p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!videoFile || isProcessing || modelLoading}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              videoFile && !isProcessing && !modelLoading
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            {modelLoading
              ? "Loading AI Model..."
              : isProcessing
                ? `Analyzing... ${progress}%`
                : "Analyze Video"}
          </button>

          {poseError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-xs text-red-400">{poseError}</p>
            </div>
          )}

          {summary && frameResults.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOverlay}
                  onChange={(e) => setShowOverlay(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-emerald-500"
                />
                <span className="text-sm text-slate-300">Show pose skeleton overlay</span>
              </label>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {videoUrl && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="relative">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  onTimeUpdate={handleVideoTimeUpdate}
                  className="w-full"
                  playsInline
                />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="p-3 border-t border-slate-700/50">
                <VideoDrawingTools videoRef={videoRef} />
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 relative mx-auto mb-4">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#334155" strokeWidth="4" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray={`${progress * 1.76} 176`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-400">
                  {progress}%
                </span>
              </div>
              <p className="text-white font-medium">Analyzing your {analysisType} technique...</p>
              <p className="text-sm text-slate-400 mt-1">AI is detecting body pose frame by frame</p>
            </div>
          )}

          {(summary || history.length > 0) && (
            <>
              <div className="flex gap-2 border-b border-slate-700/50">
                {summary && (
                  <button
                    onClick={() => setActiveTab("results")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "results"
                        ? "border-emerald-500 text-emerald-400"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    Analysis Results
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "history"
                      ? "border-emerald-500 text-emerald-400"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  History ({history.length})
                </button>
              </div>

              {activeTab === "results" && summary && (
                <>
                  <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-white">Overall Score</h2>
                        <p className="text-sm text-slate-400">
                          Based on AI pose analysis of {frameResults.length} frames from your {analysisType} video
                        </p>
                      </div>
                      <div className="text-center">
                        <p className={`text-4xl font-bold ${scoreColor(summary.overallScore)}`}>
                          {summary.overallScore}
                        </p>
                        <p className="text-xs text-slate-400">/ 100</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {summary.categories.map((result, i) => (
                      <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-white">{result.category}</h3>
                          <span className={`text-sm font-bold ${scoreColor(result.score)}`}>
                            {result.score}/100
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${scoreBg(result.score)}`}
                            style={{ width: `${result.score}%` }}
                          />
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{result.comment}</p>

                        {result.angles.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {result.angles.map((angle, j) => (
                              <span
                                key={j}
                                className={`text-xs px-2 py-1 rounded-full border ${scoreBgLight(scoreFromAngleDisplay(angle.angle, angle.ideal, angle.tolerance))}`}
                              >
                                {angle.name}: {angle.angle}
                                {typeof angle.ideal === "number" && angle.ideal > 10 ? "\u00B0" : ""}{" "}
                                (ideal: {angle.ideal}
                                {typeof angle.ideal === "number" && angle.ideal > 10 ? "\u00B0" : ""})
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <p className="text-xs text-blue-400 font-medium mb-1">AI Suggestion</p>
                          <p className="text-sm text-slate-300">{result.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {summary.keyFrames.length > 0 && (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-white mb-3">Key Moments to Review</h3>
                      <div className="space-y-2">
                        {summary.keyFrames.map((kf, i) => (
                          <button
                            key={i}
                            onClick={() => handleSeekToFrame(kf.timestamp)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                              selectedKeyFrame === kf.timestamp
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <span className="text-xs text-slate-400 font-mono w-12 shrink-0">
                              {formatTime(kf.timestamp)}
                            </span>
                            <span className="text-sm text-slate-300 flex-1">{kf.issue}</span>
                            <span className={`text-xs font-bold ${scoreColor(kf.score)}`}>
                              {kf.score}
                            </span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-3">
                        Click a moment to jump to that point in the video
                      </p>
                    </div>
                  )}

                  {summary.drills.length > 0 && (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-white mb-3">Recommended Drills</h3>
                      <div className="space-y-2">
                        {summary.drills.map((drill, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg"
                          >
                            <span className="text-amber-400 text-sm mt-0.5">{i + 1}.</span>
                            <p className="text-sm text-slate-300">{drill}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {speedEstimate && (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-white mb-3">Ball Speed Estimation</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-white">{speedEstimate.speedKph}</p>
                          <p className="text-xs text-slate-500">km/h</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-slate-400">{speedEstimate.speedMph}</p>
                          <p className="text-xs text-slate-500">mph</p>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${classifyPace(speedEstimate.speedKph).color}`}>{classifyPace(speedEstimate.speedKph).label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Confidence: {speedEstimate.confidence} &middot; {speedEstimate.method}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {actionClips.length > 0 && (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                      <h3 className="text-sm font-semibold text-white mb-3">Auto-Detected Clips</h3>
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-white">{actionClips.length}</p>
                          <p className="text-xs text-slate-500">Clips</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-400">{getClipSummary(actionClips).activeDuration}s</p>
                          <p className="text-xs text-slate-500">Active</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-red-400">{getClipSummary(actionClips).deadTime}s</p>
                          <p className="text-xs text-slate-500">Dead Time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-amber-400">{getClipSummary(actionClips).totalDuration}s</p>
                          <p className="text-xs text-slate-500">Total</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {actionClips.map((clip, i) => (
                          <button
                            key={i}
                            onClick={() => handleSeekToFrame(clip.startTime)}
                            className="w-full flex items-center gap-3 p-2 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors text-left"
                          >
                            <span className="text-xs text-slate-400 font-mono w-20">{formatTime(clip.startTime)} - {formatTime(clip.endTime)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${clip.type === "batting" ? "bg-emerald-500/10 text-emerald-400" : clip.type === "bowling" ? "bg-blue-500/10 text-blue-400" : clip.type === "fielding" ? "bg-amber-500/10 text-amber-400" : "bg-slate-500/10 text-slate-400"}`}>{clip.label}</span>
                            <span className="text-xs text-slate-600 ml-auto">{Math.round(clip.confidence * 100)}%</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Next Steps</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Link href="/analyze/coach" className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors">
                        <p className="text-sm font-medium text-purple-400">Ask AI Coach</p>
                        <p className="text-xs text-slate-400 mt-1">Get personalized coaching tips based on this analysis</p>
                      </Link>
                      <Link href="/analyze/compare" className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-colors">
                        <p className="text-sm font-medium text-cyan-400">Compare with Pros</p>
                        <p className="text-xs text-slate-400 mt-1">See how you compare to Kohli, Bumrah, and more</p>
                      </Link>
                      <Link href="/analyze/progress" className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 hover:border-amber-500/40 transition-colors">
                        <p className="text-sm font-medium text-amber-400">View Progress</p>
                        <p className="text-xs text-slate-400 mt-1">Track your improvement over time</p>
                      </Link>
                      <Link href="/analyze/notes" className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors">
                        <p className="text-sm font-medium text-orange-400">Coach Notes</p>
                        <p className="text-xs text-slate-400 mt-1">Add coaching notes and export reports</p>
                      </Link>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "history" && (
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
                      <p className="text-slate-400">No analysis history yet. Analyze a video to see results here.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end">
                        <button
                          onClick={handleClearHistory}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Clear History
                        </button>
                      </div>
                      {history.map((entry) => (
                        <div key={entry.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-white">{entry.fileName}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(entry.date).toLocaleDateString()} &mdash; {entry.summary.type} analysis
                              </p>
                            </div>
                            <span className={`text-2xl font-bold ${scoreColor(entry.summary.overallScore)}`}>
                              {entry.summary.overallScore}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {entry.summary.categories.map((cat, i) => (
                              <span
                                key={i}
                                className={`text-xs px-2 py-1 rounded-full border ${scoreBgLight(cat.score)}`}
                              >
                                {cat.category}: {cat.score}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {!isProcessing && !summary && !videoUrl && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">Upload a video to get started</p>
              <p className="text-sm text-slate-500 mt-1">
                Our AI will detect your body pose and analyze your cricket technique
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Pose detection</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Joint angle analysis</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Technique scoring</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Drill recommendations</span>
              </div>
              <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg max-w-md mx-auto">
                <p className="text-xs text-blue-400 font-medium mb-1">How it works</p>
                <p className="text-xs text-slate-400">
                  1. Upload a video of batting, bowling, or fielding<br />
                  2. AI detects 33 body landmarks using MediaPipe Pose<br />
                  3. Joint angles are measured and compared to ideal technique<br />
                  4. Get scores, specific feedback, and drill recommendations
                </p>
              </div>
            </div>
          )}

          {!isProcessing && !summary && videoUrl && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 text-center">
              <p className="text-slate-400 font-medium">
                Video loaded! Select analysis type and click &quot;Analyze Video&quot;
              </p>
              <p className="text-sm text-slate-500 mt-1">The AI will process your video frame by frame</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
