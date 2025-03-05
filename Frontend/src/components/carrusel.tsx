"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

import { cn } from "../utils/utils"

interface CarouselProps {
  images: {
    src: string
    alt: string
  }[]
  autoplaySpeed?: number
}

export default function CircularCarousel({ images, autoplaySpeed = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const dragThreshold = 50 // Minimum drag distance to change slide
  const dragSensitivity = 1.5 // Higher value makes dragging more sensitive

  const totalImages = images.length

  // Handle autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages)
      }, autoplaySpeed)
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [isAutoPlaying, totalImages, autoplaySpeed])

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Navigate to a specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    // Reset autoplay timer when manually changing slides
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
      if (isAutoPlaying) {
        autoplayTimerRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages)
        }, autoplaySpeed)
      }
    }
  }

  // Calculate positions for the circular carousel
  const getSlideStyle = (index: number) => {
    // Calculate the angle for each slide around the circle
    const angleOffset = (index - currentIndex) * (360 / totalImages)
    // Convert angle to radians
    const angleInRadians = (angleOffset * Math.PI) / 180

    // Calculate position on the circle
    const radius = 45 // Percentage of container width
    const x = Math.sin(angleInRadians) * radius
    const z = Math.cos(angleInRadians) * radius

    // Scale based on position (larger when in front)
    const scale = z > 0 ? 1.3 + z / 80 : 0.5 + z / 150
    const opacity = z > -20 ? 1 : 0.4

    return {
      transform: `translateX(${x}%) translateZ(${z}px) scale(${scale})`,
      zIndex: Math.round(z * 10),
      opacity,
    }
  }

  // Add dragging functionality
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    setIsAutoPlaying(false)

    // Get starting position
    if ("clientX" in e) {
      setStartX(e.clientX)
    } else {
      setStartX(e.touches[0].clientX)
    }
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return

    let currentX
    if ("clientX" in e) {
      currentX = e.clientX
    } else {
      currentX = e.touches[0].clientX
    }

    const diff = (currentX - startX) * dragSensitivity
    setDragOffset(diff)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    setIsDragging(false)
    setIsAutoPlaying(true)

    // Change slide if dragged far enough
    if (Math.abs(dragOffset) > dragThreshold) {
      if (dragOffset > 0) {
        // Dragged right, go to previous slide
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages)
      } else {
        // Dragged left, go to next slide
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages)
      }
    }

    setDragOffset(0)
  }

  // Add event listeners for touch devices
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isDragging])

  return (
    <div
      className="w-full max-w-5xl mx-auto px-4 py-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
    //   onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] perspective-1000 overflow-hidden">
        {/* Large red circle background - significantly larger than the images */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-red-600 rounded-full z-0 shadow-lg"></div>

        <div className="absolute w-full h-full flex items-center justify-center transform-style-3d">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] transition-all duration-500 ease-in-out",
                currentIndex === index ? "cursor-default" : "cursor-pointer",
              )}
              style={getSlideStyle(index)}
              onClick={() => !isDragging && goToSlide(index)}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
              <img
    src={image.src || "/placeholder.svg"}
    alt={image.alt}
    className="absolute inset-0 w-full h-full object-cover"
    loading="lazy"
  />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentIndex === index ? "bg-red-600 w-6" : "bg-red-600/40 hover:bg-red-600/60",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

