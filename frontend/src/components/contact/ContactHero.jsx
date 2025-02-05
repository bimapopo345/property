import React from 'react';

export default function Hero() {
  return (
    <div className="relative h-[40vh] flex items-center justify-center my-6 mx-6 rounded-2xl">
      {/* Radial Gradient Background Section */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,249,0.4766500350140056) 12%, rgba(8,0,255,0.4458377100840336) 41%, rgba(255,26,26,0.8155856092436975) 100%)',
        }}
      />

      {/* Content Section */}
      <div className="relative text-center text-stone-900 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
        <p className="text-xl leading-relaxed">
          Have questions? We're here to help! Reach out for any inquiries about
          our property listings or services.
        </p>
      </div>
    </div>
  );
}
