"use client"

import lottie, { type AnimationItem } from "lottie-web"
import { useEffect, useRef } from "react"

interface CognalyzeLoadingProps {
  size?: "sm" | "md" | "lg" | "fullscreen"
  message?: string
  className?: string
}

export function CognalyzeLoading({ size = "md", message = "Analisando...", className = "" }: CognalyzeLoadingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)

  useEffect(() => {
    if (containerRef.current && !animationRef.current) {
      // Animation data for accessibility analysis theme
      const animationData = {
        v: "5.7.4",
        fr: 60,
        ip: 0,
        op: 120,
        w: 200,
        h: 200,
        nm: "Accessibility Scan",
        ddd: 0,
        assets: [],
        layers: [
          {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Eye Outline",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              p: { a: 0, k: [100, 100, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: {
                a: 1,
                k: [
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 0,
                    s: [80, 80, 100],
                  },
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 60,
                    s: [100, 100, 100],
                  },
                  { t: 120, s: [80, 80, 100] },
                ],
              },
            },
            ao: 0,
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    ind: 0,
                    ty: "sh",
                    ks: {
                      a: 0,
                      k: {
                        i: [
                          [0, 0],
                          [-16.57, -11.04],
                          [0, 0],
                          [16.57, -11.04],
                        ],
                        o: [
                          [16.57, -11.04],
                          [0, 0],
                          [-16.57, -11.04],
                          [0, 0],
                        ],
                        v: [
                          [-60, 0],
                          [0, -30],
                          [60, 0],
                          [0, 30],
                        ],
                        c: true,
                      },
                    },
                  },
                  {
                    ty: "st",
                    c: { a: 0, k: [0.4, 0.6, 1, 1] },
                    o: { a: 0, k: 100 },
                    w: { a: 0, k: 4 },
                    lc: 2,
                    lj: 2,
                  },
                  {
                    ty: "tr",
                    p: { a: 0, k: [0, 0] },
                    a: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [100, 100] },
                    r: { a: 0, k: 0 },
                    o: { a: 0, k: 100 },
                  },
                ],
              },
            ],
          },
          {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: "Pupil",
            sr: 1,
            ks: {
              o: { a: 0, k: 100 },
              r: { a: 0, k: 0 },
              p: { a: 0, k: [100, 100, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: {
                a: 1,
                k: [
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 0,
                    s: [100, 100, 100],
                  },
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 30,
                    s: [90, 90, 100],
                  },
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 60,
                    s: [100, 100, 100],
                  },
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 90,
                    s: [90, 90, 100],
                  },
                  { t: 120, s: [100, 100, 100] },
                ],
              },
            },
            ao: 0,
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    d: 1,
                    ty: "el",
                    s: { a: 0, k: [30, 30] },
                    p: { a: 0, k: [0, 0] },
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.2, 0.4, 0.9, 1] },
                    o: { a: 0, k: 100 },
                  },
                  {
                    ty: "tr",
                    p: { a: 0, k: [0, 0] },
                    a: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [100, 100] },
                    r: { a: 0, k: 0 },
                    o: { a: 0, k: 100 },
                  },
                ],
              },
            ],
          },
          {
            ddd: 0,
            ind: 3,
            ty: 4,
            nm: "Scan Line",
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 0,
                    s: [0],
                  },
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 20,
                    s: [100],
                  },
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 100,
                    s: [100],
                  },
                  { t: 120, s: [0] },
                ],
              },
              r: { a: 0, k: 0 },
              p: {
                a: 1,
                k: [
                  {
                    i: { x: 0.42, y: 1 },
                    o: { x: 0.58, y: 0 },
                    t: 0,
                    s: [100, 60, 0],
                    to: [0, 13.33, 0],
                    ti: [0, -13.33, 0],
                  },
                  { t: 120, s: [100, 140, 0] },
                ],
              },
              a: { a: 0, k: [0, 0, 0] },
              s: { a: 0, k: [100, 100, 100] },
            },
            ao: 0,
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    ty: "rc",
                    d: 1,
                    s: { a: 0, k: [140, 2] },
                    p: { a: 0, k: [0, 0] },
                    r: { a: 0, k: 0 },
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.3, 0.8, 1, 1] },
                    o: { a: 0, k: 80 },
                  },
                  {
                    ty: "tr",
                    p: { a: 0, k: [0, 0] },
                    a: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [100, 100] },
                    r: { a: 0, k: 0 },
                    o: { a: 0, k: 100 },
                  },
                ],
              },
            ],
          },
          {
            ddd: 0,
            ind: 4,
            ty: 4,
            nm: "Particles",
            sr: 1,
            ks: {
              o: {
                a: 1,
                k: [
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 0,
                    s: [0],
                  },
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 30,
                    s: [60],
                  },
                  {
                    i: { x: [0.42], y: [1] },
                    o: { x: [0.58], y: [0] },
                    t: 90,
                    s: [60],
                  },
                  { t: 120, s: [0] },
                ],
              },
              r: {
                a: 1,
                k: [
                  { t: 0, s: [0] },
                  { t: 120, s: [360] },
                ],
              },
              p: { a: 0, k: [100, 100, 0] },
              a: { a: 0, k: [0, 0, 0] },
              s: { a: 0, k: [100, 100, 100] },
            },
            ao: 0,
            shapes: [
              {
                ty: "gr",
                it: [
                  {
                    d: 1,
                    ty: "el",
                    s: { a: 0, k: [4, 4] },
                    p: { a: 0, k: [50, 0] },
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.5, 0.7, 1, 1] },
                    o: { a: 0, k: 100 },
                  },
                  {
                    ty: "tr",
                    p: { a: 0, k: [0, 0] },
                    a: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [100, 100] },
                    r: { a: 0, k: 0 },
                    o: { a: 0, k: 100 },
                  },
                ],
              },
              {
                ty: "gr",
                it: [
                  {
                    d: 1,
                    ty: "el",
                    s: { a: 0, k: [4, 4] },
                    p: { a: 0, k: [-50, 0] },
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.5, 0.7, 1, 1] },
                    o: { a: 0, k: 100 },
                  },
                  {
                    ty: "tr",
                    p: { a: 0, k: [0, 0] },
                    a: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [100, 100] },
                    r: { a: 0, k: 0 },
                    o: { a: 0, k: 100 },
                  },
                ],
              },
              {
                ty: "gr",
                it: [
                  {
                    d: 1,
                    ty: "el",
                    s: { a: 0, k: [4, 4] },
                    p: { a: 0, k: [0, 50] },
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.5, 0.7, 1, 1] },
                    o: { a: 0, k: 100 },
                  },
                  {
                    ty: "tr",
                    p: { a: 0, k: [0, 0] },
                    a: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [100, 100] },
                    r: { a: 0, k: 0 },
                    o: { a: 0, k: 100 },
                  },
                ],
              },
              {
                ty: "gr",
                it: [
                  {
                    d: 1,
                    ty: "el",
                    s: { a: 0, k: [4, 4] },
                    p: { a: 0, k: [0, -50] },
                  },
                  {
                    ty: "fl",
                    c: { a: 0, k: [0.5, 0.7, 1, 1] },
                    o: { a: 0, k: 100 },
                  },
                  {
                    ty: "tr",
                    p: { a: 0, k: [0, 0] },
                    a: { a: 0, k: [0, 0] },
                    s: { a: 0, k: [100, 100] },
                    r: { a: 0, k: 0 },
                    o: { a: 0, k: 100 },
                  },
                ],
              },
            ],
          },
        ],
      }

      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      })
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
        animationRef.current = null
      }
    }
  }, [])

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    fullscreen: "w-40 h-40",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    fullscreen: "text-xl",
  }

  if (size === "fullscreen") {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm ${className}`}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div ref={containerRef} className={sizeClasses[size]} aria-label="Loading animation" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className={`font-semibold text-foreground ${textSizeClasses[size]}`}>{message}</p>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative">
        <div ref={containerRef} className={sizeClasses[size]} aria-label="Loading animation" />
      </div>
      {message && <p className={`font-medium text-muted-foreground ${textSizeClasses[size]}`}>{message}</p>}
    </div>
  )
}
