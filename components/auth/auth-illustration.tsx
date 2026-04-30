"use client"

import Image from "next/image"

export function AuthIllustration() {
  return (
    <div className="w-full max-w-lg bg-brand-green-light rounded-3xl p-8 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="relative">
          <div className="w-8 h-10 bg-brand-green rounded-full transform -rotate-12" />
          <div className="absolute top-1 right-0 w-3 h-3 bg-brand-yellow rounded-full" />
        </div>
        <span className="text-brand-green font-bold text-xl">Ajanah</span>
      </div>

      {/* Calendar illustration */}
      <div className="relative flex justify-center mb-8">
        <div className="relative">
          {/* Calendar base */}
          <div className="w-48 h-40 bg-brand-green rounded-lg shadow-lg relative overflow-hidden transform -rotate-6">
            {/* Calendar top row */}
            <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-around px-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-white/20 rounded-full" />
              ))}
            </div>
            {/* Calendar grid */}
            <div className="absolute top-10 left-2 right-2 grid grid-cols-7 gap-1">
              {[...Array(28)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm ${
                    i % 5 === 0 ? "bg-brand-yellow" : "bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Floating paper */}
          <div className="absolute -top-4 -right-8 w-20 h-24 bg-white rounded-lg shadow-md transform rotate-6 border border-gray-100">
            <div className="p-2 space-y-1">
              <div className="w-full h-1.5 bg-gray-200 rounded" />
              <div className="w-3/4 h-1.5 bg-gray-200 rounded" />
              <div className="w-full h-1.5 bg-gray-200 rounded" />
              <div className="w-1/2 h-1.5 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Second floating paper */}
          <div className="absolute top-6 -right-12 w-16 h-20 bg-white rounded-lg shadow-md transform rotate-12 border border-gray-100">
            <div className="p-2 space-y-1">
              <div className="w-full h-1 bg-gray-200 rounded" />
              <div className="w-2/3 h-1 bg-gray-200 rounded" />
              <div className="w-full h-1 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Pill/badge element */}
          <div className="absolute -top-8 left-4 w-8 h-4 bg-brand-green rounded-full transform -rotate-45" />

          {/* Dotted path */}
          <svg
            className="absolute -right-16 top-0 w-24 h-32"
            viewBox="0 0 100 130"
            fill="none"
          >
            <path
              d="M0 0 Q 50 60, 30 130"
              stroke="#22C55E"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Welcome card */}
      <div className="bg-brand-green rounded-2xl p-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <h2 className="text-2xl font-bold mb-2 relative z-10">Welcome to Event Hub</h2>
        <p className="text-white/80 text-sm relative z-10">
          Manage your events, connect with attendees, and create memorable experiences.
        </p>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6">
        <div className="w-2 h-2 rounded-full bg-brand-green" />
        <div className="w-2 h-2 rounded-full bg-brand-green/40" />
        <div className="w-2 h-2 rounded-full bg-brand-green/40" />
      </div>
    </div>
  )
}
