import React from 'react';

export const NetworkIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-52 rounded-2xl bg-gradient-to-br from-slate-50 via-sky-50/40 to-indigo-50/30 border border-slate-200/80 overflow-hidden flex items-center justify-center p-3 shadow-inner ${className}`}>
      {/* Background Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Network Graph Illustration */}
      <svg className="w-full h-full relative z-10" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection Lines */}
        <g stroke="#cbd5e1" strokeWidth="1.2" strokeOpacity="0.8">
          <line x1="70" y1="60" x2="160" y2="110" />
          <line x1="70" y1="110" x2="160" y2="110" />
          <line x1="70" y1="160" x2="160" y2="110" />
          
          <line x1="160" y1="110" x2="250" y2="110" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" />
          
          <line x1="250" y1="110" x2="330" y2="60" stroke="#38bdf8" />
          <line x1="250" y1="110" x2="340" y2="110" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="250" y1="110" x2="330" y2="160" stroke="#f59e0b" />

          {/* Social Cluster Edges */}
          <line x1="330" y1="60" x2="390" y2="40" />
          <line x1="330" y1="60" x2="410" y2="70" />
          <line x1="340" y1="110" x2="400" y2="105" />
          <line x1="340" y1="110" x2="430" y2="120" />
          <line x1="340" y1="110" x2="390" y2="140" />
          <line x1="330" y1="160" x2="410" y2="170" />
          <line x1="330" y1="160" x2="370" y2="190" />
          
          <line x1="390" y1="40" x2="440" y2="50" />
          <line x1="410" y1="70" x2="450" y2="85" />
          <line x1="400" y1="105" x2="460" y2="105" />
          <line x1="430" y1="120" x2="470" y2="135" />
          <line x1="410" y1="170" x2="460" y2="180" />
        </g>

        {/* Input Nodes (Text, Image, Video) */}
        <g>
          <rect x="52" y="44" width="32" height="32" rx="8" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
          <text x="68" y="64" textAnchor="middle" fontSize="12" fill="#0284c7" fontWeight="bold">T</text>

          <rect x="52" y="94" width="32" height="32" rx="8" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
          <text x="68" y="114" textAnchor="middle" fontSize="12" fill="#0284c7" fontWeight="bold">I</text>

          <rect x="52" y="144" width="32" height="32" rx="8" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
          <text x="68" y="164" textAnchor="middle" fontSize="12" fill="#0284c7" fontWeight="bold">V</text>
        </g>

        {/* Multimodal Fusion Hub */}
        <g>
          <circle cx="160" cy="110" r="18" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <circle cx="160" cy="110" r="8" fill="#0284c7" />
          <text x="160" y="140" textAnchor="middle" fontSize="9" fill="#0369a1" fontWeight="600">Fusion</text>
        </g>

        {/* Central XAI Core Node */}
        <g>
          <circle cx="250" cy="110" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="250" cy="110" r="34" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
          <text x="250" y="114" textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="800">XAI</text>
          <text x="250" y="152" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="700">Explainer</text>
        </g>

        {/* Social Graph Propagation Cluster Nodes */}
        <g>
          {/* Layer 1 Nodes */}
          <circle cx="330" cy="60" r="10" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="340" cy="110" r="12" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
          <circle cx="330" cy="160" r="9" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />

          {/* Layer 2 Nodes */}
          <circle cx="390" cy="40" r="7" fill="#0284c7" />
          <circle cx="410" cy="70" r="8" fill="#0369a1" />
          <circle cx="400" cy="105" r="9" fill="#ea580c" />
          <circle cx="430" cy="120" r="7" fill="#f97316" />
          <circle cx="390" cy="140" r="6" fill="#0284c7" />
          <circle cx="410" cy="170" r="8" fill="#0284c7" />
          <circle cx="370" cy="190" r="6" fill="#38bdf8" />

          {/* Layer 3 Peripheral Nodes */}
          <circle cx="440" cy="50" r="5" fill="#38bdf8" />
          <circle cx="450" cy="85" r="5" fill="#0284c7" />
          <circle cx="460" cy="105" r="6" fill="#ea580c" />
          <circle cx="470" cy="135" r="5" fill="#f97316" />
          <circle cx="460" cy="180" r="5" fill="#0284c7" />
        </g>
      </svg>
    </div>
  );
};
