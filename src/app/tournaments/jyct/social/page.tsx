"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { jyctInfo, jyctAgeGroups, jyctPosts } from "@/data/jyct";

type FeedView = "grid" | "list";

export default function JYCTSocialPage() {
  const [view, setView] = useState<FeedView>("grid");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const post = selectedPost ? jyctPosts.find((p) => p.id === selectedPost) : null;

  return (
    <div className="min-h-screen">
      {/* Instagram-style Profile Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-[3px] bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-600">
                  JYCT
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-xl font-semibold text-white">jerseyyouthcricket</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isFollowing
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <a
                  href={`mailto:${jyctInfo.email}`}
                  className="px-6 py-1.5 rounded-lg text-sm font-semibold bg-slate-700 text-white hover:bg-slate-600 transition-all"
                >
                  Message
                </a>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center md:justify-start gap-8 mb-4">
              <div className="text-center">
                <span className="font-bold text-white">{jyctInfo.posts}</span>
                <span className="text-sm text-slate-400 ml-1">posts</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-white">{jyctInfo.followers.toLocaleString()}</span>
                <span className="text-sm text-slate-400 ml-1">followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-white">{jyctInfo.following}</span>
                <span className="text-sm text-slate-400 ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <p className="font-semibold text-white text-sm">{jyctInfo.name}</p>
              <p className="text-sm text-slate-300">
                {jyctInfo.tagline}
              </p>
              <p className="text-sm text-slate-300">
                {jyctInfo.ballType} | {jyctInfo.month}
              </p>
              <p className="text-sm text-slate-300">
                {jyctInfo.features.join(" | ")}
              </p>
              <p className="text-sm text-blue-400">
                {jyctInfo.email}
              </p>
              <Link href="/tournaments/jyct" className="text-sm text-blue-400 hover:text-blue-300 inline-block mt-1">
                View CricClubs Page →
              </Link>
            </div>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="mt-8 border-b border-slate-700/50 pb-6">
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { label: "Registration", icon: "📋" },
              { label: "Grounds", icon: "🏟️" },
              { label: "U11", icon: "🏏" },
              { label: "U13", icon: "🏏" },
              { label: "U15", icon: "🏏" },
              { label: "U18", icon: "🏏" },
              { label: "Girls", icon: "⭐" },
              { label: "Highlights", icon: "🎬" },
            ].map((highlight) => (
              <div key={highlight.label} className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-amber-400 to-pink-500">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xl">
                    {highlight.icon}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{highlight.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Age Group Quick Cards (unique to this tournament page) */}
        <div className="mt-6 mb-6">
          <div className="grid grid-cols-5 gap-2">
            {jyctAgeGroups.map((group) => (
              <div
                key={group.id}
                className={`relative rounded-xl bg-gradient-to-br ${group.color} p-3 text-center`}
              >
                {group.isNew && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs bg-pink-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                )}
                <p className="text-sm font-bold text-white">{group.name}</p>
                <p className="text-xs text-white/70">{group.overs} overs</p>
                <p className="text-xs font-semibold text-white/90 mt-1">${group.entryFee.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-8 border-t border-slate-700/50 pt-3 mb-6">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-1 pb-3 border-b-2 transition-colors ${
              view === "grid"
                ? "border-white text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Posts</span>
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1 pb-3 border-b-2 transition-colors ${
              view === "list"
                ? "border-white text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Feed</span>
          </button>
        </div>

        {/* Grid View */}
        {view === "grid" && (
          <div className="grid grid-cols-3 gap-1">
            {jyctPosts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPost(p.id)}
                className="relative aspect-square overflow-hidden rounded group"
              >
                {p.thumbnail ? (
                  <Image
                    src={p.thumbnail}
                    alt={p.caption}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
                    <span className="text-4xl">{p.icon}</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1 text-white text-sm font-bold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {p.likes}
                  </div>
                  <div className="flex items-center gap-1 text-white text-sm font-bold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                    </svg>
                    {p.comments}
                  </div>
                </div>
                {/* Type indicator */}
                {p.type !== "image" && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      {p.type === "video" ? (
                        <path d="M8 5v14l11-7z" />
                      ) : (
                        <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
                      )}
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* List/Feed View */}
        {view === "list" && (
          <div className="space-y-6">
            {jyctPosts.map((p) => (
              <div key={p.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">JY</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">jerseyyouthcricket</p>
                    <p className="text-xs text-slate-400">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>

                {/* Post Image */}
                <div className="relative aspect-square">
                  {p.thumbnail ? (
                    <Image
                      src={p.thumbnail}
                      alt={p.caption}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
                      <span className="text-7xl">{p.icon}</span>
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="p-3">
                  <div className="flex items-center gap-4 mb-2">
                    <svg className="w-6 h-6 text-white hover:text-red-400 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <svg className="w-6 h-6 text-white hover:text-slate-300 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <svg className="w-6 h-6 text-white hover:text-slate-300 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <p className="text-sm text-white font-semibold mb-1">{p.likes.toLocaleString()} likes</p>
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-white mr-1">jerseyyouthcricket</span>
                    {p.caption}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">View all {p.comments} comments</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {post && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-slate-900 rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Side */}
            <div className="relative md:w-1/2 aspect-square shrink-0">
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt={post.caption}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
                  <span className="text-7xl">{post.icon}</span>
                </div>
              )}
            </div>

            {/* Details Side */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">JY</span>
                </div>
                <span className="text-sm font-semibold text-white">jerseyyouthcricket</span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="ml-auto text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white mr-1">jerseyyouthcricket</span>
                  {post.caption}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>

              <div className="p-4 border-t border-slate-700/50">
                <div className="flex items-center gap-4 mb-2">
                  <svg className="w-6 h-6 text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <svg className="w-6 h-6 text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-white font-semibold">{post.likes.toLocaleString()} likes</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
