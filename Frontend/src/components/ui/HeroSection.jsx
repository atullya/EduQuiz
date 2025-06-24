"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Play, Star, Zap, Shield, Users } from "lucide-react"

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Hide hero content when scrolled down significantly
      setIsVisible(currentScrollY < window.innerHeight * 0.8)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate transform values based on scroll
  const parallaxOffset = scrollY * 0.5
  const fadeOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.6))
  const scaleValue = Math.max(0.8, 1 - scrollY / (window.innerHeight * 2))

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="floating-shape shape-1"
          style={{
            transform: `translateY(${parallaxOffset * 0.3}px) translateX(${Math.sin(scrollY * 0.01) * 20}px)`,
            opacity: fadeOpacity,
          }}
        ></div>
        <div
          className="floating-shape shape-2"
          style={{
            transform: `translateY(${parallaxOffset * -0.2}px) translateX(${Math.cos(scrollY * 0.008) * 15}px)`,
            opacity: fadeOpacity,
          }}
        ></div>
        <div
          className="floating-shape shape-3"
          style={{
            transform: `translateY(${parallaxOffset * 0.4}px) rotate(${scrollY * 0.1}deg)`,
            opacity: fadeOpacity,
          }}
        ></div>
        <div
          className="floating-shape shape-4"
          style={{
            transform: `translateY(${parallaxOffset * -0.3}px) scale(${scaleValue})`,
            opacity: fadeOpacity,
          }}
        ></div>
        <div
          className="floating-shape shape-5"
          style={{
            transform: `translateY(${parallaxOffset * 0.6}px) rotate(${-scrollY * 0.05}deg)`,
            opacity: fadeOpacity,
          }}
        ></div>
      </div>

      {/* Grid Pattern with Parallax */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-5"
        style={{
          transform: `translateY(${parallaxOffset * 0.1}px)`,
          opacity: fadeOpacity * 0.5,
        }}
      ></div>

      {/* Main Content with Scroll Animations */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-300"
        style={{
          transform: `translateY(${parallaxOffset}px) scale(${scaleValue})`,
          opacity: fadeOpacity,
        }}
      >
        {/* Badge with Bounce Effect */}
        <div
          className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-sm font-medium text-gray-700 mb-8 animate-fade-in-up"
          style={{
            transform: `translateY(${Math.sin(scrollY * 0.02) * 5}px)`,
            opacity: isVisible ? 1 : 0,
          }}
        >
          <Star className="w-4 h-4 text-yellow-500 mr-2" />
          Trusted by 10,000+ users worldwide
        </div>

        {/* Main Headline with Dynamic Effects */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          <span
            className="block animate-slide-in-left"
            style={{
              transform: `translateX(${scrollY * -0.1}px)`,
              opacity: fadeOpacity,
            }}
          >
            Build Amazing
          </span>
          <span
            className="block animate-slide-in-right animation-delay-200"
            style={{
              transform: `translateX(${scrollY * 0.1}px)`,
              opacity: fadeOpacity,
            }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
              Experiences
            </span>
          </span>
        </h1>

        {/* Subtitle with Fade Effect */}
        <p
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400"
          style={{
            opacity: fadeOpacity,
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          Create stunning web applications with our modern tools and components. Fast, reliable, and beautifully
          designed for the next generation.
        </p>

        {/* CTA Buttons with Hover and Scroll Effects */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-600"
          style={{
            opacity: fadeOpacity,
            transform: `translateY(${scrollY * 0.3}px) scale(${scaleValue})`,
          }}
        >
          <button
            className="group bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center"
            style={{
              transform: `translateY(${Math.sin(scrollY * 0.03) * 3}px)`,
            }}
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            className="group bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
            style={{
              transform: `translateY(${Math.sin(scrollY * 0.03 + Math.PI) * 3}px)`,
            }}
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Watch Demo
          </button>
        </div>

        {/* Feature Icons with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-800">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and performance", color: "blue" },
            { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security built-in", color: "green" },
            { icon: Users, title: "Team Collaboration", desc: "Work together seamlessly", color: "purple" },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              style={{
                opacity: fadeOpacity,
                transform: `translateY(${scrollY * (0.1 + index * 0.05)}px) rotate(${Math.sin(scrollY * 0.01 + index) * 2}deg)`,
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div
                className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator with Dynamic Animation */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-all duration-300"
        style={{
          opacity: isVisible ? fadeOpacity : 0,
          transform: `translateX(-50%) translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div
            className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-scroll-indicator"
            style={{
              animationDuration: `${2 + Math.sin(scrollY * 0.01)}s`,
            }}
          ></div>
        </div>
      </div>
    </section>
  )
}
