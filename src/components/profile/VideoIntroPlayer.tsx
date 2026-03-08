"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Player } from "@/types";
import { videoIntroPropsFromPlayer } from "./VideoIntroComposition";

const PlayerComponent = dynamic(
  () => Promise.all([
    import("@remotion/player"),
    import("./VideoIntroComposition"),
  ]).then(([playerMod, compMod]) => ({
    default: ({ player }: { player: Player }) => {
      const props = videoIntroPropsFromPlayer(player);
      return (
        <playerMod.Player
          component={compMod.default}
          inputProps={props}
          durationInFrames={150}
          compositionWidth={854}
          compositionHeight={480}
          fps={30}
          style={{ width: "100%", borderRadius: 12 }}
          controls
          autoPlay={false}
        />
      );
    }
  })),
  { ssr: false, loading: () => <div className="aspect-video bg-slate-800 rounded-xl animate-pulse" /> }
);

export default function VideoIntroPlayer({ player }: { player: Player }) {
  const [showPlayer, setShowPlayer] = useState(false);

  if (!showPlayer) {
    return (
      <button
        onClick={() => setShowPlayer(true)}
        className="w-full aspect-video bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col items-center justify-center gap-3 hover:border-emerald-500/30 transition-all group"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-600/20 flex items-center justify-center group-hover:bg-emerald-600/30 transition-all">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#10b981"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        </div>
        <span className="text-sm text-slate-400 group-hover:text-emerald-400 transition-colors">Generate Video Introduction</span>
        <span className="text-xs text-slate-600">Client-side rendering with Remotion</span>
      </button>
    );
  }

  return <PlayerComponent player={player} />;
}
