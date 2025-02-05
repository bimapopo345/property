import React, { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import heroimage from "../assets/images/heroimage.png";
import { LinearGradient, RadialGradient } from "react-text-gradients";

export const AnimatedContainer = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const directions = {
    vertical: "Y",
    horizontal: "X",
  };

  const springProps = useSpring({
    from: {
      transform: `translate${directions[direction]}(${
        reverse ? `-${distance}px` : `${distance}px`
      })`,
    },
    to: inView ? { transform: `translate${directions[direction]}(0px)` } : {},
    config: { tension: 50, friction: 25 },
  });

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

const Hero = () => {
  const handleSubmit = () => {
    window.location.href = "/properties";
  };

  return (
    <AnimatedContainer distance={50} direction="vertical">
      <div className="mt-20">
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 my-3 mx-6">
          <div
            className="absolute inset-0 z-0 rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url(${heroimage})`,
              backgroundSize:"cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-sky-300/40 via-slate/10 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
                <RadialGradient
                  gradient={[
                    "circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%",
                  ]}
                >
                  Find Your Perfect
                  <br />
                
                <span className="text-gray-800">Living Space</span>
                </RadialGradient>
              </h1>
                

              <p className="text-slate-700 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                Discover your dream home in the most sought-after locations
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="relative">
                <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/50 backdrop-blur-md rounded-2xl w-full max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Enter location..."
                    className="flex-1 px-4 py-2 rounded-xl border-0 bg-white shadow-sm"
                  />
                  <button onClick={handleSubmit} className="md:w-auto w-full bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium">
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default Hero;