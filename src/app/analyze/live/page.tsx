"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useLivePoseDetection } from "@/hooks/useLivePoseDetection";
import {
  analyzeFrame,
  detectBowlingHand,
  type FrameAnalysis,
  type BowlingHand,
} from "@/lib/cricket-analysis";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import {
  saveAnalysis,
  getHistory,
  clearHistory,
  type SavedAnalysis,
} from "@/lib/analysis-history";

type AnalysisType = "batting" | "bowling" | "fielding";

export default function LiveAnalyzePage() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>("batting");
  const [bowlingHand, setBowlingHand] = useState<BowlingHand>("right");
  const [liveAnalysis, setLiveAnalysis] = useState<FrameAnalysis | null>(null);
  const [capturedFrames, setCapturedFrames] = useState<FrameAnalysis[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(true);
  const [recentFrameLandmarks, setRecentFrameLandmarks] = useState<NormalizedLandmark[][]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const {
    isLoading: modelLoading,
    isStreaming,
    error: poseError,
    startCamera,
    stopCamera,
    detectFrame,
    drawLandmarks,
  } = useLivePoseDetection();

  if (!historyLoaded) {
    if (typeof window !== "undefined") {
      const h = getHistory();
      setHistory(h);
    }
    setHistoryLoaded(true);
  }

  const processLiveFrame = useCallback(() => {
    if (!videoRef.current || !overlayCanvasRef.current || !isStreaming) return;

    const video = videoRef.current;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const result = detectFrame(video);

    if (result) {
      drawLandmarks(ctx, result.landmarks, canvas.width, canvas.height);

      if (showFeedback) {
        const analysis = analyzeFrame(result.landmarks, analysisType, result.timestamp, bowlingHand);
        setLiveAnalysis(analysis);
      }

      setRecentFrameLandmarks(prev => {
        const updated = [...prev, result.landmarks];
        if (updated.length > 30) return updated.slice(-30);
        return updated;
      });

      if (analysisType === "bowling" && recentFrameLandmarks.length >= 10) {
        const detected = detectBowlingHand(recentFrameLandmarks);
        if (detected !== bowlingHand) {
          setBowlingHand(detected);
        }
      }

      if (isCapturing) {
        const analysis = analyzeFrame(result.landmarks, analysisType, result.timestamp, bowlingHand);
        setCapturedFrames(prev => [...prev, analysis]);
      }
    }

    animationRef.current = requestAnimationFrame(processLiveFrame);
  }, [isStreaming, detectFrame, drawLandmarks, analysisType, bowlingHand, showFeedback, isCapturing, recentFrameLandmarks]);

  useEffect(() => {
    if (isStreaming) {
      animationRef.current = requestAnimationFrame(processLiveFrame);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isStreaming, processLiveFrame]);

  const handleStartCamera = useCallback(async () => {
    if (!videoRef.current) return;
    await startCamera(videoRef.current);
  }, [startCamera]);

  const handleStopCamera = useCallback(() => {
    stopCamera();
    setLiveAnalysis(null);
    setRecentFrameLandmarks([]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [stopCamera]);

  const handleCapture = useCallback(() => {
    setCapturedFrames([]);
    setCaptureCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCaptureCountdown(count);
      } else {
        setCaptureCountdown(null);
        setIsCapturing(true);

        setTimeout(() => {
          setIsCapturing(false);
          setCapturedFrames(frames => {
            if (frames.length > 0) {
              const avgScore = Math.round(
                frames.reduce((sum, f) => sum + f.overallScore, 0) / frames.length
              );
              const bestFrame = frames.reduce((best, f) =>
                f.checks.length > best.checks.length ? f : best, frames[0]);

              const summary = {
                type: analysisType,
                overallScore: avgScore,
                categories: bestFrame.checks,
                keyFrames: frames
                  .filter(f => f.overallScore < 70)
                  .slice(0, 3)
                  .map(f => ({
                    timestamp: f.timestamp,
                    issue: f.checks.reduce((worst, c) =>
                      c.score < worst.score ? c : worst, f.checks[0]).category,
                    score: f.overallScore,
                  })),
                drills: getDrillsFromChecks(bestFrame.checks),
              };

              const saved = saveAnalysis("Live Camera Capture", summary);
              setHistory(prev => [saved, ...prev]);
            }
            return frames;
          });
        }, 5000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [analysisType]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const scoreColor = (score: number) =>
    score >= 75 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";

  const scoreBg = (score: number) =>
    score >= 75 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";

  const scoreBgLight = (score: number) =>
    score >= 75
      ? "bg-emerald-500/20 border-emerald-500/30"
      : score >= 60
        ? "bg-amber-500/20 border-amber-500/30"
        : "bg-red-500/20 border-red-500/30";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-3 flex items-center gap-4">
        <Link href="/analyze" className="text-sm text-slate-400 hover:text-white">&larr; Video Upload Mode</Link>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Live Analysis</h1>
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
            LIVE
          </span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
            AI-Powered
          </span>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
            In-Browser
          </span>
        </div>
        <p className="text-slate-400">
          Point your camera at a player and get real-time AI feedback on technique. All processing runs locally.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
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
                  onClick={() => setAnalysisType(type.value)}
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
                    onClick={() => setBowlingHand(h)}
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
              <p className="text-xs text-slate-600 mt-2">
                Auto-detects after a few frames. Override if needed.
              </p>
            </div>
          )}

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              Controls
            </h2>
            {!isStreaming ? (
              <button
                onClick={handleStartCamera}
                disabled={modelLoading}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  !modelLoading
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {modelLoading ? "Loading AI Model..." : "Start Camera"}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleCapture}
                  disabled={isCapturing || captureCountdown !== null}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    !isCapturing && captureCountdown === null
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-red-500/50 text-red-200 cursor-not-allowed"
                  }`}
                >
                  {captureCountdown !== null
                    ? `Starting in ${captureCountdown}...`
                    : isCapturing
                      ? "Recording... (5s)"
                      : "Capture & Analyze (5s)"}
                </button>
                <button
                  onClick={handleStopCamera}
                  className="w-full py-2 rounded-xl font-medium border border-slate-600 text-slate-300 hover:border-slate-500 transition-colors"
                >
                  Stop Camera
                </button>
              </div>
            )}

            {isStreaming && (
              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={showFeedback}
                  onChange={(e) => setShowFeedback(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-emerald-500"
                />
                <span className="text-sm text-slate-300">Show real-time feedback</span>
              </label>
            )}
          </div>

          {poseError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-xs text-red-400">{poseError}</p>
            </div>
          )}

          {isStreaming && showFeedback && liveAnalysis && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Live Score</h3>
                <span className={`text-2xl font-bold ${scoreColor(liveAnalysis.overallScore)}`}>
                  {liveAnalysis.overallScore}
                </span>
              </div>
              <div className="space-y-2">
                {liveAnalysis.checks.map((check, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">{check.category}</span>
                      <span className={scoreColor(check.score)}>{check.score}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${scoreBg(check.score)}`}
                        style={{ width: `${check.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="relative bg-black" style={{ minHeight: 400 }}>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full"
                style={{ transform: "scaleX(-1)" }}
              />
              <canvas
                ref={overlayCanvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ transform: "scaleX(-1)" }}
              />

              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 font-medium">Click &quot;Start Camera&quot; to begin</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Position the player in frame for best results
                    </p>
                  </div>
                </div>
              )}

              {captureCountdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-8xl font-bold text-white animate-pulse">
                    {captureCountdown}
                  </div>
                </div>
              )}

              {isCapturing && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-red-400">Recording</span>
                </div>
              )}

              {isStreaming && !isCapturing && captureCountdown === null && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-400">Live</span>
                </div>
              )}
            </div>
          </div>

          {capturedFrames.length > 0 && !isCapturing && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Capture Analysis</h2>
                    <p className="text-sm text-slate-400">
                      Based on {capturedFrames.length} frames captured during the 5-second recording
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-4xl font-bold ${scoreColor(
                      Math.round(capturedFrames.reduce((s, f) => s + f.overallScore, 0) / capturedFrames.length)
                    )}`}>
                      {Math.round(capturedFrames.reduce((s, f) => s + f.overallScore, 0) / capturedFrames.length)}
                    </p>
                    <p className="text-xs text-slate-400">/ 100</p>
                  </div>
                </div>
              </div>

              {capturedFrames.length > 0 && (
                <div className="space-y-4">
                  {capturedFrames[Math.floor(capturedFrames.length / 2)].checks.map((check, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-white">{check.category}</h3>
                        <span className={`text-sm font-bold ${scoreColor(check.score)}`}>
                          {check.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${scoreBg(check.score)}`}
                          style={{ width: `${check.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-slate-300 mb-2">{check.comment}</p>
                      {check.angles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {check.angles.map((angle, j) => (
                            <span
                              key={j}
                              className={`text-xs px-2 py-1 rounded-full border ${scoreBgLight(
                                Math.abs(angle.angle - angle.ideal) <= angle.tolerance ? 90 :
                                Math.abs(angle.angle - angle.ideal) <= angle.tolerance * 2 ? 70 : 50
                              )}`}
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
                        <p className="text-sm text-slate-300">{check.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isStreaming && capturedFrames.length === 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">Live Camera Analysis</p>
              <p className="text-sm text-slate-500 mt-1">
                Get real-time AI feedback on cricket technique
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Real-time pose detection</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">Live score feedback</span>
                <span className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-slate-400">5-second capture analysis</span>
              </div>
              <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg max-w-md mx-auto">
                <p className="text-xs text-blue-400 font-medium mb-1">How it works</p>
                <p className="text-xs text-slate-400">
                  1. Click &quot;Start Camera&quot; to begin the live feed<br />
                  2. AI detects body pose in real-time and shows skeleton overlay<br />
                  3. Live scores update as the player moves<br />
                  4. Click &quot;Capture &amp; Analyze&quot; for a detailed 5-second analysis
                </p>
              </div>
              <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg max-w-md mx-auto">
                <p className="text-xs text-amber-400">
                  Tip: Side-on camera angle works best for batting and bowling analysis
                </p>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Recent History</h3>
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {history.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-sm text-white">{entry.fileName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(entry.date).toLocaleDateString()} &mdash; {entry.summary.type}
                      </p>
                    </div>
                    <span className={`text-lg font-bold ${scoreColor(entry.summary.overallScore)}`}>
                      {entry.summary.overallScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getDrillsFromChecks(checks: FrameAnalysis["checks"]): string[] {
  const drills: string[] = [];
  for (const check of checks) {
    if (check.score < 75 && check.suggestion) {
      drills.push(check.suggestion);
    }
  }
  return drills.slice(0, 4);
}
