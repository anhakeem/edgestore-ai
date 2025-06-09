'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Database, Zap, Shield, Globe, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Sync",
      description: "Synchronize your data across edge locations in milliseconds with our optimized protocols.",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Smart Storage",
      description: "Intelligent data placement and caching algorithms that adapt to your usage patterns.",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Edge Security",
      description: "Enterprise-grade security with end-to-end encryption and zero-trust architecture.",
      gradient: "from-emerald-500 to-teal-400"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Deploy across 200+ edge locations worldwide for ultra-low latency access.",
      gradient: "from-orange-500 to-red-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://edgestore-api.fly.dev/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: "🔥 The Edge has awakened" })
      });

      const data = await res.json();
      setApiResponse(data.result);
    } catch (err) {
      setApiResponse("❌ Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ... Navigation & Hero (same as before) */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                Sync Fast.
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Store Smart.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Dominate the Edge.
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The next-generation edge storage platform that brings your data closer to your users 
            with unprecedented speed and intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handlePredict}
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/40 flex items-center space-x-2"
            >
              <span>{loading ? 'Summoning AI...' : 'Get Started'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-gray-300 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-300 border border-gray-600 hover:border-gray-400">
              Watch Demo
            </button>
          </div>

          {/* Display Prediction */}
          {apiResponse && (
            <p className="mt-6 text-lg text-cyan-300 font-mono">
              {apiResponse}
            </p>
          )}
        </div>
      </section>

      {/* ... other sections untouched (features, CTA, footer) */}
    </div>
  );
};

export default HomePage;
