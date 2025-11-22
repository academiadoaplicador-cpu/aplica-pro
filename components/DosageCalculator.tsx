import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Droplet, FlaskConical, Sprout } from 'lucide-react';

interface DosageResult {
  productPerTank: number;
  tanksNeeded: number;
  totalProduct: number;
  areaCoveredPerTank: number;
}

const DosageCalculator: React.FC = () => {
  const [tankSize, setTankSize] = useState<number>(2000); // Liters
  const [appRate, setAppRate] = useState<number>(150); // L/ha (Volume de Calda)
  const [dosage, setDosage] = useState<number>(2.5); // L/ha or Kg/ha
  const [totalArea, setTotalArea] = useState<number>(50); // Hectares
  const [result, setResult] = useState<DosageResult | null>(null);

  const calculate = () => {
    if (tankSize <= 0 || appRate <= 0 || dosage <= 0) return;

    // How many hectares does one tank cover?
    // Tank Size (L) / Application Rate (L/ha) = hectares per tank
    const areaCoveredPerTank = tankSize / appRate;

    // How much product per tank?
    // Area per tank (ha) * Dosage (L/ha)
    const productPerTank = areaCoveredPerTank * dosage;

    // Total tanks needed for the whole job
    const tanksNeeded = totalArea / areaCoveredPerTank;

    // Total product needed
    const totalProduct = totalArea * dosage;

    setResult({
      productPerTank,
      tanksNeeded,
      totalProduct,
      areaCoveredPerTank
    });
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tankSize, appRate, dosage, totalArea]);

  const chartData = result ? [
    { name: 'Água (L)', value: tankSize - result.productPerTank },
    { name: 'Produto (L/Kg)', value: result.productPerTank },
  ] : [];

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-emerald-600" />
          Parâmetros da Aplicação
        </h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Tamanho do Tanque (Litros)</label>
            <div className="relative">
              <input 
                type="number" 
                value={tankSize}
                onChange={(e) => setTankSize(Number(e.target.value))}
                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
              <Droplet className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Volume de Calda (L/ha)</label>
            <div className="relative">
              <input 
                type="number" 
                value={appRate}
                onChange={(e) => setAppRate(Number(e.target.value))}
                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
              <div className="absolute left-3 top-3.5 text-slate-400 text-xs font-bold">Rate</div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Vazão desejada por hectare.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Dosagem do Produto (L/ha ou Kg/ha)</label>
            <div className="relative">
              <input 
                type="number" 
                value={dosage}
                step="0.1"
                onChange={(e) => setDosage(Number(e.target.value))}
                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
              <Sprout className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Área Total (ha)</label>
            <input 
              type="number" 
              value={totalArea}
              onChange={(e) => setTotalArea(Number(e.target.value))}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
           {/* Quick Stats Card */}
          <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg shadow-emerald-200/50">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Produto por Tanque</p>
                  <h3 className="text-4xl font-bold mt-1">{result.productPerTank.toFixed(2)} <span className="text-lg font-normal">L (ou Kg)</span></h3>
                </div>
                <div className="bg-emerald-500/30 p-2 rounded-lg">
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-500">
                <div>
                  <p className="text-emerald-100 text-xs">Cobertura por Tanque</p>
                  <p className="text-xl font-semibold">{result.areaCoveredPerTank.toFixed(2)} ha</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-xs">Total de Tanques</p>
                  <p className="text-xl font-semibold">{Math.ceil(result.tanksNeeded)} <span className="text-sm font-normal">({result.tanksNeeded.toFixed(1)})</span></p>
                </div>
             </div>
          </div>

          {/* Visualization */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-72 flex flex-col">
            <h3 className="text-sm font-bold text-slate-600 mb-2">Proporção da Mistura</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(2)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm">
            <strong>Dica:</strong> Para um tanque de {tankSize}L, adicione primeiro metade da água, depois {result.productPerTank.toFixed(2)}L do produto, e complete o volume mantendo a agitação ligada.
          </div>
        </div>
      )}
    </div>
  );
};

export default DosageCalculator;