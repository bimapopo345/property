import React from 'react';
import { motion } from 'framer-motion';
import aboutimage from '../../assets/images/about_enhanced.jpg';

export default function Hero() {
  return (
    <div className='mt-20'>
    <div className="relative h-[60vh] flex items-center justify-center my-3 mx-6 rounded-2xl">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 rounded-2xl"
        style={{
          backgroundImage: `url(${aboutimage})`,
        }}
      >
        <div className="absolute inset-0 bg-cyan-50-300/50 rounded-2xl" />
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative text-center text-black px-4 max-w-4xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">About BuildEstate</h1>
        <p className="text-xl leading-relaxed">
          At BuildEstate, we believe in simplifying the property rental and buying process. 
          Our mission is to connect people with their dream homes effortlessly.
        </p>
      </motion.div>
    </div>
    </div>
  );
}