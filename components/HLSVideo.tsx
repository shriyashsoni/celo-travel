"use client"

import React, { useEffect, useRef } from "react"
import Hls from "hls.js"

interface HLSVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string
}

export function HLSVideo({ src, ...props }: HLSVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls: Hls

    if (Hls.isSupported()) {
      hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (props.autoPlay) {
          video.play().catch((e) => console.log("Autoplay prevented:", e))
        }
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Fallback for Safari
      video.src = src
      video.addEventListener("loadedmetadata", () => {
        if (props.autoPlay) {
          video.play().catch((e) => console.log("Autoplay prevented:", e))
        }
      })
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [src, props.autoPlay])

  return <video ref={videoRef} {...props} />
}
