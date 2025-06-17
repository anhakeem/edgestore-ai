'use client';

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Zap, Shield, Globe } from 'lucide-react';

const HomePage: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  // ✅ Initialize sessionId only after client-side mount
  useEffect(() => {
    let existing = sessionStorage.getItem('edgestore-session');
    if (!existing) {
      existing = uuidv4();
      sessionStorage.setItem('edgestore-session', existing);
    }
    setSessionId(existing);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const fetchPrediction = async () => {
    if (!sessionId || !inputValue.trim()) return;

    try {
      const response = await axios.post('https://edgestore-api.fly.dev/predict', { input: inputValue });
      const output = response.data.result || 'No result';
      setPrediction(output);

      await axios.post('https://edgestore-api.fly.dev/track', {
        sessionId,
        event: 'prediction_request',
        input: inputValue,
        output,
        timestamp: new Date().toISOString()
      });

      const timelineRes = await axios.get(`https://edgestore-api.fly.dev/timeline/${sessionId}`);
      setTimelineEvents(timelineRes.data.events.reverse().slice(0, 3)); // Show latest 3
    } catch (error) {
      console.error('Prediction error:', error);
      setPrediction('Prediction failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
          <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">Sync Fast.</span><br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Store Smart.</span><br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">Dominate the Edge.</span>
        </h1>

        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter your prompt"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg text-black"
          />

          <button
            onClick={fetchPrediction}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-full font-bold transition duration-300"
          >
            Run Prediction
          </button>
        </div>

        <p className="text-xl mt-6 text-gray-300">AI Prediction: <span className="text-cyan-300">{prediction}</span></p>
        <p className="mt-2 text-sm text-gray-500">Session ID: {sessionId}</p>
      </section>

      {/* Timeline History */}
      <section className="px-6 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">🧠 Recent Events</h2>
        {timelineEvents.length === 0 ? (
          <p className="text-gray-400">No events yet.</p>
        ) : (
          <ul className="space-y-2">
            {timelineEvents.map((event, idx) => (
              <li key={idx} className="bg-slate-800 p-4 rounded-lg text-left max-w-2xl mx-auto">
                <p><strong>🕒</strong> {event.timestamp}</p>
                <p><strong>📥</strong> {event.input}</p>
                <p><strong>📤</strong> {event.output}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Rotating Features */}
      <section className="text-center py-16 px-6">
        <div className={`inline-block p-6 rounded-xl bg-gradient-to-r ${features[currentFeature].gradient} text-white transition-all duration-500`}>
          <div className="mb-4">{features[currentFeature].icon}</div>
          <h2 className="text-2xl font-bold">{features[currentFeature].title}</h2>
          <p className="mt-2 max-w-xl mx-auto">{features[currentFeature].description}</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
