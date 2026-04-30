"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface DrawingTool {
  type: "arrow" | "circle" | "line" | "freehand" | "angle" | "text";
  label: string;
}

interface DrawingItem {
  id: string;
  tool: string;
  points: { x: number; y: number }[];
  color: string;
  text?: string;
}

const TOOLS: DrawingTool[] = [
  { type: "arrow", label: "Arrow" },
  { type: "circle", label: "Circle" },
  { type: "line", label: "Line" },
  { type: "freehand", label: "Draw" },
  { type: "angle", label: "Angle" },
  { type: "text", label: "Text" },
];

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", "#FFFFFF"];

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function VideoDrawingTools({ videoRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [currentTool, setCurrentTool] = useState<string>("arrow");
  const [currentColor, setCurrentColor] = useState("#10B981");
  const [drawings, setDrawings] = useState<DrawingItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [textInput, setTextInput] = useState("");
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);

  const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  }, []);

  const redraw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, items: DrawingItem[], tempPoints?: { x: number; y: number }[]) => {
    ctx.clearRect(0, 0, w, h);
    const allItems = [...items];
    if (tempPoints && tempPoints.length >= 1) {
      allItems.push({ id: "temp", tool: currentTool, points: tempPoints, color: currentColor });
    }

    for (const item of allItems) {
      ctx.strokeStyle = item.color;
      ctx.fillStyle = item.color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const pts = item.points.map((p) => ({ x: p.x * w, y: p.y * h }));

      if (item.tool === "freehand" && pts.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      } else if (item.tool === "line" && pts.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.stroke();
      } else if (item.tool === "arrow" && pts.length >= 2) {
        const start = pts[0];
        const end = pts[pts.length - 1];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = 12;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      } else if (item.tool === "circle" && pts.length >= 2) {
        const cx = (pts[0].x + pts[pts.length - 1].x) / 2;
        const cy = (pts[0].y + pts[pts.length - 1].y) / 2;
        const rx = Math.abs(pts[pts.length - 1].x - pts[0].x) / 2;
        const ry = Math.abs(pts[pts.length - 1].y - pts[0].y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (item.tool === "angle" && pts.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.stroke();
        const a1 = Math.atan2(pts[0].y - pts[1].y, pts[0].x - pts[1].x);
        const a2 = Math.atan2(pts[2].y - pts[1].y, pts[2].x - pts[1].x);
        let angleDeg = Math.abs(((a2 - a1) * 180) / Math.PI);
        if (angleDeg > 180) angleDeg = 360 - angleDeg;
        ctx.font = "12px sans-serif";
        ctx.fillText(`${Math.round(angleDeg)}°`, pts[1].x + 10, pts[1].y - 5);
        ctx.beginPath();
        ctx.arc(pts[1].x, pts[1].y, 20, Math.min(a1, a2), Math.max(a1, a2));
        ctx.stroke();
      } else if (item.tool === "text" && pts.length >= 1 && item.text) {
        ctx.font = "14px sans-serif";
        ctx.fillText(item.text, pts[0].x, pts[0].y);
      }
    }
  }, [currentTool, currentColor]);

  useEffect(() => {
    if (!active || !canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) redraw(ctx, canvas.width, canvas.height, drawings);
  }, [active, drawings, redraw, videoRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!active) return;
    const pos = getPos(e);
    if (currentTool === "text") {
      setTextPos(pos);
      return;
    }
    setIsDrawing(true);
    setCurrentPoints([pos]);
  }, [active, currentTool, getPos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const pos = getPos(e);
    const newPoints = currentTool === "freehand" ? [...currentPoints, pos] : [currentPoints[0], pos];
    if (currentTool === "freehand") setCurrentPoints(newPoints);
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) redraw(ctx, canvasRef.current.width, canvasRef.current.height, drawings, currentTool === "freehand" ? newPoints : [currentPoints[0], pos]);
  }, [isDrawing, currentPoints, currentTool, drawings, getPos, redraw]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    let finalPoints = currentTool === "freehand" ? [...currentPoints, pos] : [currentPoints[0], pos];
    if (currentTool === "angle" && currentPoints.length < 3) {
      setCurrentPoints([...currentPoints, pos]);
      if (currentPoints.length < 2) { return; }
      finalPoints = [...currentPoints, pos];
    }
    setIsDrawing(false);
    const item: DrawingItem = { id: Date.now().toString(), tool: currentTool, points: finalPoints, color: currentColor };
    setDrawings((prev) => [...prev, item]);
    setCurrentPoints([]);
  }, [isDrawing, currentPoints, currentTool, currentColor, getPos]);

  const handleTextSubmit = useCallback(() => {
    if (!textPos || !textInput.trim()) return;
    const item: DrawingItem = { id: Date.now().toString(), tool: "text", points: [textPos], color: currentColor, text: textInput.trim() };
    setDrawings((prev) => [...prev, item]);
    setTextInput("");
    setTextPos(null);
  }, [textPos, textInput, currentColor]);

  const undo = useCallback(() => setDrawings((prev) => prev.slice(0, -1)), []);
  const clearAll = useCallback(() => setDrawings([]), []);

  const saveSnapshot = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return;
    const video = videoRef.current;
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = video.videoWidth;
    exportCanvas.height = video.videoHeight;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const scaleX = video.videoWidth / canvasRef.current.width;
    const scaleY = video.videoHeight / canvasRef.current.height;
    ctx.scale(scaleX, scaleY);
    redraw(ctx, canvasRef.current.width, canvasRef.current.height, drawings);
    const link = document.createElement("a");
    link.download = `cricket-analysis-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  }, [drawings, redraw, videoRef]);

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="flex items-center gap-2 text-xs bg-slate-700/50 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-600/50 hover:text-white hover:border-slate-500 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Drawing Tools
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full z-10 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-lg p-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setCurrentTool(tool.type)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentTool === tool.type ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white"
            }`}
          >
            {tool.label}
          </button>
        ))}
        <div className="border-l border-slate-700 h-5 mx-1" />
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setCurrentColor(c)}
            className={`w-5 h-5 rounded-full border-2 transition-all ${currentColor === c ? "border-white scale-110" : "border-slate-600"}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <div className="border-l border-slate-700 h-5 mx-1" />
        <button onClick={undo} className="text-xs text-slate-400 hover:text-white px-2">Undo</button>
        <button onClick={clearAll} className="text-xs text-slate-400 hover:text-white px-2">Clear</button>
        <button onClick={saveSnapshot} className="text-xs text-emerald-400 hover:text-emerald-300 px-2">Save Image</button>
        <button onClick={() => { setActive(false); clearAll(); }} className="text-xs text-red-400 hover:text-red-300 px-2 ml-auto">Close</button>
      </div>

      {textPos && (
        <div className="flex gap-2 bg-slate-800/80 border border-slate-700/50 rounded-lg p-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleTextSubmit(); }}
            placeholder="Type annotation text..."
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button onClick={handleTextSubmit} className="text-xs text-emerald-400 px-2">Add</button>
          <button onClick={() => setTextPos(null)} className="text-xs text-slate-400 px-2">Cancel</button>
        </div>
      )}
    </div>
  );
}
