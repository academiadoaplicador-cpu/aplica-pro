
import React, { useState } from 'react';
import { Globe, MapPin, Plus, CheckCircle2, ExternalLink } from 'lucide-react';

const ApplicatorMap: React.FC = () => {
  const [requestSent, setRequestSent] = useState(false);

  // Google My Maps Embed URL
  const mapUrl = "https://www.google.com/maps/d/embed?mid=1btkvx-rOYmfAsu6AeG2oFOGkVjnKe6pb&ehbc=2E312F";

  const handleJoinRequest = () => {
    // Simulate sending request to admin
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 5000);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-orange-500" /> Rede de Aplicadores
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Encontre parceiros em todo o Brasil. Mais de 700 pontos cadastrados.
          </p>
        </div>
        
        <button 
          onClick={handleJoinRequest}
          disabled={requestSent}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg
            ${requestSent 
              ? 'bg-emerald-600 text-white cursor-default' 
              : 'bg-orange-600 hover:bg-orange-500 text-white active:scale-95'
            }
          `}
        >
          {requestSent ? (
            <>
              <CheckCircle2 className="w-5 h-5" /> Solicitação Enviada
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" /> Quero aparecer no mapa
            </>
          )}
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-inner relative group">
        {/* Interaction Blocker Overlay */}
        <div className="absolute inset-0 z-10 bg-transparent cursor-default"></div>

        <iframe 
          src={mapUrl} 
          width="100%" 
          height="100%" 
          style={{ border: 0, pointerEvents: 'none' }}
          className="absolute inset-0 grayscale-[30%] opacity-80 transition-all group-hover:grayscale-0 group-hover:opacity-100"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        
        {/* Static Label Overlay */}
        <div className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur text-xs text-zinc-400 p-3 rounded-lg border border-zinc-700 shadow-lg pointer-events-none z-20">
          <p className="flex items-center gap-2">
             <MapPin className="w-4 h-4 text-orange-500" />
             Visualização de Abrangência (Mapa Estático)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicatorMap;
