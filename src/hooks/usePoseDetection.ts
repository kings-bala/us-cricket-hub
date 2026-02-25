"use client";

import { useRef, useState, useCallback } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface PoseFrame {
  timestamp: number;
  landmarks: NormalizedLandmark[];
}

interface UsePoseDetectionReturn {
  isLoading: boolean;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  frames: PoseFrame[];
  processVideo: (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    sampleRate?: number
  ) => Promise<PoseFrame[]>;
  drawLandmarks: (
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    width: number,
    height: number
  ) => void;
}

const POSE_CONNECTIONS: [number, number][] = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26],
  [25, 27], [26, 28],
];

export function usePoseDetection(): UsePoseDetectionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [frames, setFrames] = useState<PoseFrame[]>([]);
  const poseLandmarkerRef = useRef<unknown>(null);

  const initPoseLandmarker = useCallback(async () => {
    if (poseLandmarkerRef.current) return poseLandmarkerRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const vision = await import("@mediapipe/tasks-vision");
      const { PoseLandmarker, FilesetResolver } = vision;

      const wasmFileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const landmarker = await PoseLandmarker.createFromOptions(wasmFileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      poseLandmarkerRef.current = landmarker;
      setIsLoading(false);
      return landmarker;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load pose model";
      setError(msg);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const processVideo = useCallback(
    async (
      video: HTMLVideoElement,
      canvas: HTMLCanvasElement,
      sampleRate: number = 4
    ): Promise<PoseFrame[]> => {
      setIsProcessing(true);
      setProgress(0);
      setError(null);
      setFrames([]);

      try {
        const landmarker = await initPoseLandmarker();
        if (!landmarker) throw new Error("Pose model not initialized");

        const typedLandmarker = landmarker as {
          detectForVideo: (
            video: HTMLVideoElement,
            timestamp: number
          ) => { landmarks: NormalizedLandmark[][] };
        };

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context not available");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const duration = video.duration;
        const interval = 1 / sampleRate;
        const totalFrames = Math.floor(duration * sampleRate);
        const collectedFrames: PoseFrame[] = [];

        for (let i = 0; i < totalFrames; i++) {
          const time = i * interval;
          video.currentTime = time;

          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              video.removeEventListener("seeked", onSeeked);
              resolve();
            };
            video.addEventListener("seeked", onSeeked);
          });

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const result = typedLandmarker.detectForVideo(
            video,
            Math.round(time * 1000)
          );

          if (result.landmarks && result.landmarks.length > 0) {
            collectedFrames.push({
              timestamp: time,
              landmarks: result.landmarks[0],
            });
          }

          setProgress(Math.round(((i + 1) / totalFrames) * 100));
        }

        setFrames(collectedFrames);
        setIsProcessing(false);
        video.currentTime = 0;
        return collectedFrames;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Video processing failed";
        setError(msg);
        setIsProcessing(false);
        return [];
      }
    },
    [initPoseLandmarker]
  );

  const drawLandmarks = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      landmarks: NormalizedLandmark[],
      width: number,
      height: number
    ) => {
      for (const [start, end] of POSE_CONNECTIONS) {
        const a = landmarks[start];
        const b = landmarks[end];
        if (
          !a || !b ||
          (a.visibility !== undefined && a.visibility < 0.5) ||
          (b.visibility !== undefined && b.visibility < 0.5)
        )
          continue;

        ctx.beginPath();
        ctx.moveTo(a.x * width, a.y * height);
        ctx.lineTo(b.x * width, b.y * height);
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      for (let i = 0; i < landmarks.length; i++) {
        const lm = landmarks[i];
        if (lm.visibility !== undefined && lm.visibility < 0.5) continue;

        ctx.beginPath();
        ctx.arc(lm.x * width, lm.y * height, 5, 0, 2 * Math.PI);
        ctx.fillStyle = i >= 11 ? "#10B981" : "#3B82F6";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    []
  );

  return {
    isLoading,
    isProcessing,
    progress,
    error,
    frames,
    processVideo,
    drawLandmarks,
  };
}
