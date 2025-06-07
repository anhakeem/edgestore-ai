import React, { useState, useEffect } from 'react';
import { ChevronRight, Database, Zap, Shield, Globe, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              EdgeStore.ai
            </span>
          </div>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
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
            
            {/* Floating elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The next-generation edge storage platform that brings your data closer to your users 
            with unprecedented speed and intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/40 flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-gray-300 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-300 border border-gray-600 hover:border-gray-400">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Animated background grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent transform -skew-y-12 animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Built for the Future
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Cutting-edge technology that scales with your ambitions
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border border-gray-800 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-gray-600 overflow-hidden ${
                  index === currentFeature ? 'ring-2 ring-cyan-400 shadow-2xl shadow-cyan-500/25' : ''
                }`}
                style={{
                  background: index === currentFeature 
                    ? `linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)`
                    : 'rgba(15, 23, 42, 0.6)'
                }}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon container */}
                <div className={`relative z-10 w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-100 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            ))}
          </div>

          {/* Feature indicator dots */}
          <div className="flex justify-center mt-12 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFeature 
                    ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-gray-800 backdrop-blur-sm bg-gradient-to-br from-slate-900/50 to-purple-900/30 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                Ready to Dominate?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who trust EdgeStore.ai to power their edge computing needs.
              </p>
              
              <button className="group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/40 flex items-center space-x-3 mx-auto">
                <span>Get Started</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              EdgeStore.ai
            </span>
          </div>
          <p className="text-gray-500">
            © 2025 EdgeStore.ai. Built for the edge computing revolution.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;