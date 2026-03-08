"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Player, PlayerProfile } from "@/types";

function generateScript(player: Player, profile: PlayerProfile): string {
  const roleDesc = player.role === "Bowler"
    ? `a ${player.bowlingStyle.toLowerCase()} bowler`
    : player.role === "Batsman"
      ? `a ${player.battingStyle.toLowerCase().replace(" bat", "")} batsman`
      : player.role === "Wicket-Keeper"
        ? `a wicket-keeper batsman`
        : `an all-rounder who ${player.battingStyle.toLowerCase().includes("right") ? "bats right-handed" : "bats left-handed"} and bowls ${player.bowlingStyle.toLowerCase()}`;

  const topStat = player.role === "Bowler"
    ? `I have taken ${player.stats.wickets} wickets in ${player.stats.matches} matches with a best of ${player.stats.bestBowling}`
    : `I have scored ${player.stats.runs} runs in ${player.stats.matches} matches at an average of ${player.stats.battingAverage}`;

  const achievementLine = player.achievements.length > 0
    ? `Some of my key achievements include ${player.achievements.slice(0, 2).join(" and ")}.`
    : "";

  const clubLine = profile.previousClubs.length > 0
    ? `I have represented ${profile.previousClubs.slice(0, 2).join(" and ")}.`
    : "";

  return `Hi, my name is ${player.name}. I am ${roleDesc} from ${player.city}, ${player.country}.

I currently play in the ${player.ageGroup} age group. ${topStat}.

${achievementLine}

${clubLine}

I am passionate about cricket and looking forward to opportunities to develop my career at the highest level. Thank you for watching.`;
}

export default function VideoRecorder({ player, profile, onClose }: { player: Player; profile: PlayerProfile; onClose: () => void }) {
  const [step, setStep] = useState<"setup" | "recording" | "review">("setup");
  const [script, setScript] = useState(() => generateScript(player, profile));
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 1280, height: 720 }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError(null);
    } catch {
      setCameraError("Camera access denied. Please allow camera permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (step === "setup" || step === "recording") {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 1280, height: 720 }, audio: true });
          if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch {
          if (!cancelled) setCameraError("Camera access denied. Please allow camera permissions.");
        }
      })();
    }
    return () => {
      cancelled = true;
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current, { mimeType: "video/webm;codecs=vp9,opus" });
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedUrl(URL.createObjectURL(blob));
      setStep("review");
      stopCamera();
    };
    mediaRecorderRef.current = mr;
    mr.start(100);
    setIsRecording(true);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }

  function retake() {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setStep("setup");
  }

  function downloadRecording() {
    if (!recordedUrl) return;
    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = `${player.name.replace(/\s+/g, "-").toLowerCase()}-video-cv.webm`;
    a.click();
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {step === "setup" && "Record Your Video CV"}
            {step === "recording" && "Recording..."}
            {step === "review" && "Review Recording"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>

        {step === "review" && recordedUrl ? (
          <div>
            <video src={recordedUrl} controls className="w-full rounded-xl bg-black mb-4" />
            <div className="flex gap-3">
              <button onClick={retake} className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-white text-sm font-semibold transition-all">
                Retake
              </button>
              <button onClick={downloadRecording} className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all">
                Download Video
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                {cameraError ? (
                  <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm p-4 text-center">{cameraError}</div>
                ) : (
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
                )}
                {isRecording && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600/90 rounded-full px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-mono text-white">{formatTime(elapsed)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {!isRecording ? (
                  <button onClick={() => { setStep("recording"); startRecording(); }} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 border-4 border-white/20 flex items-center justify-center transition-all" title="Start Recording">
                    <span className="w-6 h-6 rounded-full bg-white" />
                  </button>
                ) : (
                  <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 border-4 border-white/20 flex items-center justify-center transition-all" title="Stop Recording">
                    <span className="w-6 h-6 rounded-sm bg-white" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                <span className="text-sm font-semibold text-emerald-400">Teleprompter</span>
              </div>
              <textarea
                value={script}
                onChange={e => setScript(e.target.value)}
                className="w-full h-64 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-base leading-relaxed p-4 resize-none focus:outline-none focus:border-emerald-500/50"
              />
              <p className="text-xs text-slate-500 mt-2">Edit the script above, then read it aloud while recording. The camera mirrors your view so text appears natural to viewers.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
