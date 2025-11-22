import React, { useState, useEffect } from 'react';
import { Settings, Gauge, Timer, MoveHorizontal } from 'lucide-react';

const CalibrationCalculator: React.FC = () => {
  // Inputs
  const [distance, setDistance] = useState<number>(50); // Meters
  const [time, setTime] = useState<number>(25); // Seconds to travel distance
  const [nozzleSpacing, setNozzleSpacing] = useState<number>(50); // cm
  const [measuredFlow, setMeasuredFlow] = useState<number>(0); // L/min per nozzle (optional check)
  const [targetRate, setTargetRate] = useState<number>(100); // Target L/ha

  // Results
  const [speedResult, setSpeedResult] = useState<number>(0);
  const [requiredFlow, setRequiredFlow] = useState<number>(0);

  useEffect(() => {
    // 1. Calculate Speed
    // Speed (km/h) = (Distance (m) * 3.6) / Time (s)
    if (time > 0) {
      const calculatedSpeed = (distance * 3.6) / time;
      setSpeedResult(calculatedSpeed);

      // 2. Calculate Required Flow for Target Rate
      // Flow (L/min) = (Rate (L/ha) * Speed (km/h) * Spacing (cm)) / 60000
      const flowNeeded = (targetRate * calculatedSpeed * nozzleSpacing) / 60000;
      setRequiredFlow(flowNeeded);
    }
  }, [distance, time, nozzleSpacing, targetRate]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Gauge className="w-6 h-6 text-emerald-600" />
          Calibração de Velocidade e Vazão
        </h2>
        <p className="text-slate-500 mb-6">
          Determine a velocidade do trator e descubra a vazão necessária por bico (ponta) para atingir seu volume de calda alvo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Speed Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-semibold border-b border-slate-200 pb-2">
                    <Timer className="w-4 h-4" /> Aferição de Velocidade
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Distância Percorrida (metros)</label>
                    <input 
                        type="number" 
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Tempo Gasto (segundos)</label>
                    <input 
                        type="number" 
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div className="pt-2">
                    <div className="text-xs text-slate-500">Velocidade Calculada</div>
                    <div className="text-2xl font-bold text-emerald-700">{speedResult.toFixed(1)} km/h</div>
                </div>
            </div>

            {/* Setup Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                 <div className="flex items-center gap-2 text-slate-700 font-semibold border-b border-slate-200 pb-2">
                    <Settings className="w-4 h-4" /> Configuração da Barra
                </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Espaçamento entre Bicos (cm)</label>
                    <input 
                        type="number" 
                        value={nozzleSpacing}
                        onChange={(e) => setNozzleSpacing(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Taxa Alvo (L/ha)</label>
                    <input 
                        type="number" 
                        value={targetRate}
                        onChange={(e) => setTargetRate(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
            </div>

             {/* Result Section */}
             <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center text-center">
                <h3 className="text-emerald-100 text-sm font-medium mb-2">Vazão Necessária por Bico</h3>
                <div className="text-5xl font-bold mb-2">{requiredFlow.toFixed(2)}</div>
                <div className="text-xl font-medium opacity-90">L/min</div>
                <div className="mt-4 text-xs text-emerald-200 px-4 border-t border-emerald-500 pt-4 w-full">
                    Procure na tabela do fabricante uma ponta que entregue {requiredFlow.toFixed(2)} L/min na pressão de trabalho desejada.
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800 text-sm">
            <h4 className="font-bold mb-1 flex items-center gap-2"><MoveHorizontal className="w-4 h-4"/> Atenção à Velocidade</h4>
            Manter a velocidade constante de <strong>{speedResult.toFixed(1)} km/h</strong> é crucial. Variações de 10% na velocidade resultam em variações de 10% na dose aplicada.
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm">
            <h4 className="font-bold mb-1">Fórmula Utilizada</h4>
            <code>Q (L/min) = (T (L/ha) × V (km/h) × E (cm)) / 60.000</code>
            <br/>
            Onde Q é vazão, T é taxa de aplicação, V é velocidade e E é espaçamento.
        </div>
      </div>
    </div>
  );
};

export default CalibrationCalculator;