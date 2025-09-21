import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  BrainIcon,
  MessageCircleIcon,
  SparklesIcon,
  GraduationCapIcon,
  RocketIcon,
} from 'lucide-react'
const Particles = ({ className = '' }) => {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({
      length: 50,
    }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.2,
    }))
    setParticles(newParticles)
  }, [])
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          animate={{
            y: ['0%', '-100%'],
            opacity: [particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
const FloatingIcon = ({ icon: Icon, delay, x, y, className }) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{
        x,
        y,
      }}
      animate={{
        y: ['-10px', '10px', '-10px'],
        x: ['-5px', '5px', '-5px'],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-white/10 blur-xl transform scale-150" />
        <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
          <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  )
}
const HeroSection = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500" />
      {/* Animated Mesh Gradient Overlay */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(120,0,255,0.3)_0%,rgba(120,0,255,0)_60%)]" />
        <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_50%_50%,rgba(255,105,180,0.3)_0%,rgba(255,105,180,0)_70%)]" />
      </div>
      {/* Particles Animation */}
      <Particles className="opacity-60" />
      {/* Floating Icons */}
      <FloatingIcon
        icon={BrainIcon}
        delay={0}
        x="20%"
        y="30%"
        className="hidden md:block"
      />
      <FloatingIcon
        icon={MessageCircleIcon}
        delay={1}
        x="75%"
        y="25%"
        className="hidden md:block"
      />
      <FloatingIcon
        icon={BookOpenIcon}
        delay={2}
        x="15%"
        y="70%"
        className="hidden md:block"
      />
      <FloatingIcon
        icon={SparklesIcon}
        delay={1.5}
        x="80%"
        y="65%"
        className="hidden md:block"
      />
      <FloatingIcon
        icon={GraduationCapIcon}
        delay={2.5}
        x="60%"
        y="80%"
        className="hidden lg:block"
      />
      <FloatingIcon
        icon={RocketIcon}
        delay={0.5}
        x="30%"
        y="15%"
        className="hidden lg:block"
      />
      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center"
        >
          <div className="inline-block mb-6">
            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl transform scale-150" />
              <BookOpenIcon
                className="relative w-20 h-20 text-white mx-auto"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4"
          >
            <span className="inline-block">
              <span className="relative">
                <span className="relative z-10">Shikshya AI</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-pink-500 to-indigo-500 opacity-75 blur-sm"></span>
              </span>
            </span>
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.6,
            }}
            className="max-w-2xl mx-auto text-xl text-indigo-100 mb-8"
          >
            The next generation learning platform powered by artificial
            intelligence for Nepali students.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.8,
            }}
          >
            <button className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50">
              Get Started
            </button>
            <button className="ml-4 bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
              Learn More
            </button>
          </motion.div>
        </motion.div>
        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
          <svg
            className="absolute bottom-0 w-full h-40 text-white/5"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <motion.path
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 1,
                delay: 1,
              }}
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
export default HeroSection
