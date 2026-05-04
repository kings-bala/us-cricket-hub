"use client";

import { useRef, useState, useCallback } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface LivePoseResult {
  landmarks: NormalizedLandmark[];
  timestamp: number;
}

interface UseLivePoseDetectionReturn {
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  latestLandmarks: NormalizedLandmark[] | null;
  startCamera: (videoElement: HTMLVideoElement) => Promise<void>;
  stopCamera: () => void;
  detectFrame: (videoElement: HTMLVideoElement) => LivePoseResult | null;
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

export function useLivePoseDetection(): UseLivePoseDetectionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestLandmarks, setLatestLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const poseLandmarkerRef = useRef<unknown>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    setError(null);

    try {
      await initPoseLandmarker();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      videoElement.srcObject = stream;
      await videoElement.play();
      setIsStreaming(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Camera access failed";
      if (msg.includes("NotAllowed") || msg.includes("Permission")) {
        setError("Camera permission denied. Please allow camera access and try again.");
      } else if (msg.includes("NotFound") || msg.includes("DevicesNotFound")) {
        setError("No camera found on this device.");
      } else {
        setError(msg);
      }
      setIsStreaming(false);
    }
  }, [initPoseLandmarker]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setLatestLandmarks(null);
  }, []);

  const detectFrame = useCallback((videoElement: HTMLVideoElement): LivePoseResult | null => {
    if (!poseLandmarkerRef.current || !isStreaming) return null;

    const typedLandmarker = poseLandmarkerRef.current as {
      detectForVideo: (
        video: HTMLVideoElement,
        timestamp: number
      ) => { landmarks: NormalizedLandmark[][] };
    };

    try {
      const result = typedLandmarker.detectForVideo(
        videoElement,
        performance.now()
      );

      if (result.landmarks && result.landmarks.length > 0) {
        const landmarks = result.landmarks[0];
        setLatestLandmarks(landmarks);
        return { landmarks, timestamp: performance.now() / 1000 };
      }
    } catch {
      // frame detection can fail occasionally, just skip
    }

    return null;
  }, [isStreaming]);

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
        ctx.shadowColor = "#10B981";
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
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
    isStreaming,
    error,
    latestLandmarks,
    startCamera,
    stopCamera,
    detectFrame,
    drawLandmarks,
  };
}
