
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, DollarSign, Clock, Briefcase, AlertTriangle, Ruler, RefreshCw, Car, Refrigerator, ArrowDownCircle } from 'lucide-react';
import { QuoteResult, FinancialData, VehiclePreset } from '../types';

interface QuoteCalculatorProps {
    financialData?: FinancialData;
    importedData?: {
        totalRawMaterialCost: number;
        totalHours: number;
        currentBudgetTotal: number;
    };
}

const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ financialData, importedData }) => {
  // Calc Mode
  const [calcMode, setCalcMode] = useState<'linear' | 'dimensions'>('linear');
  const [appType, setAppType] = useState<'custom' | 'vehicle' | 'fridge' | 'flat'>('custom');

  // Material Inputs
  const [materialPrice, setMaterialPrice] = useState<number>(65); // R$/m
  const [materialQuantity, setMaterialQuantity] = useState<number>(18); // meters
  const [materialMarkup, setMaterialMarkup] = useState<number>(20); // %
  
  // Dimensions Inputs
  const [dimWidth, setDimWidth] = useState<number>(0);
  const [dimHeight, setDimHeight] = useState<number>(0);
  const [dimQty, setDimQty] = useState<number>(1);
  const [rollWidth, setRollWidth] = useState<number>(1.52);

  // Labor Inputs
  const [workHours, setWorkHours] = useState<number>(4); // Default 4 hours
  const [hourlyCostBase, setHourlyCostBase] = useState<number>(30); 
  const [helpers, setHelpers] = useState<number>(0); 
  const [helperHourlyRate, setHelperHourlyRate] = useState<number>(20); // R$/h for helper

  // Operational Inputs
  const [extraCosts, setExtraCosts] = useState<number>(50); 
  const [targetMargin, setTargetMargin] = useState<number>(40); 
  const [result, setResult] = useState<QuoteResult | null>(null);

  // Presets Data (Duplicated from MaterialCalculator for independence, ideally shared context/hook)
  const vehiclePresets: VehiclePreset[] = [
    { id: 'hatch_small', name: 'Hatch Pequeno (Mobi, Kwid)', avgMaterial: 14 },
    { id: 'hatch_med', name: 'Hatch Médio (Onix, Polo)', avgMaterial: 16 },
    { id: 'sedan', name: 'Sedan (Corolla, Civic)', avgMaterial: 18 },
    { id: 'suv_small', name: 'SUV Compacto (T-Cross, Tracker)', avgMaterial: 20 },
    { id: 'suv_large', name: 'SUV Grande (SW4, Commander)', avgMaterial: 24 },
    { id: 'pickup', name: 'Picape Média (Hilux, S10)', avgMaterial: 22 },
  ];

  const fridgePresets: VehiclePreset[] = [
    { id: 'frigobar', name: 'Frigobar', avgMaterial: 2.5 },
    { id: 'padrao', name: 'Geladeira 1 Porta', avgMaterial: 3.5 },
    { id: 'duplex', name: 'Duplex (2 Portas)', avgMaterial: 4.8 },
    { id: 'inverse', name: 'Inverse (Freezer Embaixo)', avgMaterial: 5.0 },
    { id: 'sidebyside', name: 'Side by Side', avgMaterial: 6.5 },
    { id: 'french', name: 'French Door (3+ Portas)', avgMaterial: 8.0 },
  ];

  useEffect(() => {
      if (financialData && financialData.hourlyCost > 0) {
          setHourlyCostBase(parseFloat(financialData.hourlyCost.toFixed(2)));
      }
  }, [financialData]);

  // Handle Imported Data from Budget Builder
  useEffect(() => {
      if (importedData) {
          // Switch to custom mode to allow free editing
          setAppType('custom');
          setCalcMode('linear');
          
          // Set Material Price to the Total Raw Cost and Quantity to 1 to simplify
          // This treats the "Material Price" field as "Total Material Cost" for the simulation
          setMaterialPrice(parseFloat(importedData.totalRawMaterialCost.toFixed(2)));
          setMaterialQuantity(1);
          setMaterialMarkup(0); // Margin is calculated in the final profit

          // Set Hours
          setWorkHours(importedData.totalHours);
      }
  }, [importedData]);

  // Effect to auto-calculate linear meters when in dimensions mode
  useEffect(() => {
      if (calcMode === 'dimensions') {
          if (dimWidth > 0 && dimHeight > 0 && rollWidth > 0) {
              const area = dimWidth * dimHeight * dimQty;
              const wasteArea = area * 1.20; // 20% safety margin for cuts
              const linearMeters = wasteArea / rollWidth;
              setMaterialQuantity(parseFloat(linearMeters.toFixed(2)));
          }
      }
  }, [dimWidth, dimHeight, dimQty, rollWidth, calcMode]);

  const handlePresetSelect = (meters: number) => {
      setMaterialQuantity(meters);
      setCalcMode('linear'); // Force linear mode for presets
  };

  const handleAppTypeChange = (type: 'custom' | 'vehicle' | 'fridge' | 'flat') => {
      setAppType(type);
      if (type === 'flat') {
          setCalcMode('dimensions');
      } else if (type === 'vehicle' || type === 'fridge') {
          setCalcMode('linear');
      }
  };

  const calculate = () => {
    const rawMaterialCost = materialPrice * materialQuantity;
    // If markup is used, it adds to the cost basis for the customer, but here we want to see profit
    // Let's assume materialPrice is the COST. Markup is added to revenue.
    
    // Labor Cost Calculation based on Hours
    const myLaborCost = workHours * hourlyCostBase;
    const helpersCost = workHours * helpers * helperHourlyRate;
    
    const jobOperationalCost = extraCosts;
    const totalSpend = rawMaterialCost + myLaborCost + helpersCost + jobOperationalCost;

    let suggestedPrice = 0;
    if (targetMargin < 100) {
      suggestedPrice = totalSpend / (1 - targetMargin / 100);
    }

    const estimatedProfit = suggestedPrice - totalSpend;

    // Calculate Price Per SQM
    let estimatedArea = 0;
    if (calcMode === 'dimensions') {
        estimatedArea = dimWidth * dimHeight * dimQty;
    } else {
        estimatedArea = materialQuantity * rollWidth;
    }

    const pricePerSqm = estimatedArea > 0 ? suggestedPrice / estimatedArea : 0;

    setResult({
      totalMaterialCost: rawMaterialCost,
      totalLaborCost: myLaborCost + helpersCost,
      totalFixedCost: jobOperationalCost,
      totalCost: totalSpend,
      suggestedPrice,
      estimatedProfit,
      profitMargin: targetMargin,
      pricePerSqm
    });
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialPrice, materialQuantity, materialMarkup, workHours, hourlyCostBase, helpers, helperHourlyRate, extraCosts, targetMargin, dimWidth, dimHeight, dimQty, rollWidth, calcMode]);

  const chartData = result ? [
    { name: 'Material', value: result.totalMaterialCost },
    { name: 'Custo Operacional (Horas)', value: result.totalLaborCost },
    { name: 'Extras do Job', value: result.totalFixedCost },
    { name: 'Lucro do Orçamento', value: result.estimatedProfit },
  ] : [];

  const COLORS = ['#f97316', '#3b82f6', '#64748b', '#10b981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Inputs Column */}
      <div className="lg:col-span-7 space-y-6">
        
        {importedData && (
            <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <ArrowDownCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                    <h4 className="text-blue-400 font-bold text-sm">Dados importados do Orçamento</h4>
                    <p className="text-blue-200/70 text-xs mt-1">
                        O simulador foi preenchido automaticamente com o custo total de material (R$ {importedData.totalRawMaterialCost.toFixed(2)}) 
                        e horas totais ({importedData.totalHours}h) da sua lista de itens. Ajuste a margem de lucro para analisar a viabilidade.
                    </p>
                </div>
            </div>
        )}

        {/* Application Type Selector */}
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <div className="grid grid-cols-4 gap-2">
                <button 
                    onClick={() => handleAppTypeChange('vehicle')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all ${appType === 'vehicle' ? 'bg-orange-600 text-white border-orange-500' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}
                >
                    <Car className="w-5 h-5 mb-1" />
                    Veículo
                </button>
                <button 
                    onClick={() => handleAppTypeChange('fridge')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all ${appType === 'fridge' ? 'bg-orange-600 text-white border-orange-500' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}
                >
                    <Refrigerator className="w-5 h-5 mb-1" />
                    Geladeira
                </button>
                <button 
                    onClick={() => handleAppTypeChange('flat')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all ${appType === 'flat' ? 'bg-orange-600 text-white border-orange-500' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}
                >
                    <Ruler className="w-5 h-5 mb-1" />
                    Sup. Plana
                </button>
                 <button 
                    onClick={() => handleAppTypeChange('custom')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition-all ${appType === 'custom' ? 'bg-orange-600 text-white border-orange-500' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}
                >
                    <Calculator className="w-5 h-5 mb-1" />
                    Manual
                </button>
            </div>

            {/* Submenu for Presets */}
            {appType === 'vehicle' && (
                <div className="mt-3 pt-3 border-t border-zinc-800">
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Selecione o Modelo:</label>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {vehiclePresets.map(p => (
                            <button key={p.id} onClick={() => handlePresetSelect(p.avgMaterial)} className="text-left text-xs p-2 rounded bg-zinc-950 border border-zinc-800 hover:border-orange-500 text-zinc-300 hover:text-white transition">
                                {p.name}
                            </button>
                        ))}
                     </div>
                </div>
            )}
             {appType === 'fridge' && (
                <div className="mt-3 pt-3 border-t border-zinc-800">
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Selecione o Modelo:</label>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {fridgePresets.map(p => (
                            <button key={p.id} onClick={() => handlePresetSelect(p.avgMaterial)} className="text-left text-xs p-2 rounded bg-zinc-950 border border-zinc-800 hover:border-orange-500 text-zinc-300 hover:text-white transition">
                                {p.name}
                            </button>
                        ))}
                     </div>
                </div>
            )}
        </div>

        {/* Material Card */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-orange-500 flex items-center gap-2">
                <Calculator className="w-5 h-5" /> Custo de Material
             </h2>
             <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                 <button 
                    onClick={() => setCalcMode('linear')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${calcMode === 'linear' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                    Metragem Linear
                 </button>
                 <button 
                    onClick={() => setCalcMode('dimensions')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${calcMode === 'dimensions' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                    Por Medidas
                 </button>
             </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-medium text-zinc-400 mb-1">Preço do Material (R$)</label>
                   <input type="number" value={materialPrice} onChange={(e) => setMaterialPrice(Number(e.target.value))}
                     className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 outline-none" />
                   <p className="text-[10px] text-zinc-500 mt-1">Custo por metro (ou custo total se qtd=1)</p>
                </div>
                <div>
                   <label className="block text-xs font-medium text-zinc-400 mb-1">Margem Material (%)</label>
                   <input type="number" value={materialMarkup} onChange={(e) => setMaterialMarkup(Number(e.target.value))}
                     className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 outline-none" />
                </div>
            </div>

            {calcMode === 'dimensions' && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-2 mb-3 text-zinc-500 text-xs font-bold uppercase">
                        <Ruler className="w-3 h-3" /> Calculadora de Área
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                            <label className="text-[10px] text-zinc-500">Largura (m)</label>
                            <input type="number" value={dimWidth} onChange={(e) => setDimWidth(Number(e.target.value))}
                             className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] text-zinc-500">Altura (m)</label>
                            <input type="number" value={dimHeight} onChange={(e) => setDimHeight(Number(e.target.value))}
                             className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] text-zinc-500">Qtd</label>
                            <input type="number" value={dimQty} onChange={(e) => setDimQty(Number(e.target.value))}
                             className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="text-[10px] text-zinc-500">Largura da Bobina (m)</label>
                         <input type="number" value={rollWidth} onChange={(e) => setRollWidth(Number(e.target.value))}
                             className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm" />
                    </div>
                    <div className="flex items-center gap-2 text-orange-500 text-xs bg-orange-900/10 p-2 rounded border border-orange-900/30">
                        <RefreshCw className="w-3 h-3" />
                        <span>Converte automaticamente para metros lineares (+20% margem)</span>
                    </div>
                </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                  {calcMode === 'dimensions' ? 'Metros Lineares Calculados (Para Compra)' : 'Quantidade de Material'}
              </label>
              <input type="number" value={materialQuantity} onChange={(e) => setMaterialQuantity(Number(e.target.value))}
                disabled={calcMode === 'dimensions'}
                className={`w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-bold text-lg outline-none ${calcMode === 'dimensions' ? 'opacity-80 cursor-not-allowed text-emerald-500 border-emerald-900/30' : 'focus:border-orange-500'}`} />
            </div>
          </div>
        </div>

        {/* Labor Card */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <h2 className="text-lg font-bold text-blue-500 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Tempo e Custos
          </h2>
          
          {financialData && (
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-900/50 rounded-xl flex items-center justify-between">
                 <div className="text-xs text-blue-200">
                    Baseado no seu <strong className="text-white">Perfil Financeiro</strong>, seu custo hora é:
                 </div>
                 <div className="text-lg font-bold text-white">
                    R$ {financialData.hourlyCost.toFixed(2)}
                 </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Horas de Trabalho</label>
              <input 
                type="number" 
                value={workHours} 
                onChange={(e) => setWorkHours(Number(e.target.value))}
                step="0.5"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
              />
              <p className="text-[10px] text-zinc-500 mt-1">Ex: 2 para duas horas, 0.5 para meia hora</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Seu Custo Hora (R$)</label>
              <input 
                type="number" 
                value={hourlyCostBase} 
                onChange={(e) => setHourlyCostBase(Number(e.target.value))}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
              />
               <p className="text-[10px] text-zinc-500 mt-1">Inclui Salário + Contas Fixas (Automático)</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Ajudantes Extras</label>
              <input type="number" value={helpers} onChange={(e) => setHelpers(Number(e.target.value))}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Custo Hora Ajudante (R$)</label>
              <input 
                type="number" 
                value={helperHourlyRate} 
                onChange={(e) => setHelperHourlyRate(Number(e.target.value))}
                disabled={helpers === 0}
                className={`w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none ${helpers === 0 ? 'opacity-50' : 'focus:border-zinc-600 focus:ring-1'}`} 
              />
            </div>
          </div>
        </div>

        {/* Profit Card */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <h2 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" /> Margem e Extras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Custos Extras do Job (R$)</label>
              <div className="text-[10px] text-zinc-500 mb-1">Uber, Almoço, Estacionamento</div>
              <input type="number" value={extraCosts} onChange={(e) => setExtraCosts(Number(e.target.value))}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-emerald-500 mb-1">Margem de Lucro (%)</label>
              <div className="text-[10px] text-zinc-500 mb-1">Lucro real para o caixa da empresa</div>
              <input type="number" value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))}
                className="w-full p-3 bg-zinc-950 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-5 space-y-6">
        {result && (
          <>
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                  <DollarSign className="w-24 h-24" />
               </div>
               <p className="text-orange-100 text-sm font-medium mb-1">Valor Sugerido do Orçamento</p>
               <h3 className="text-4xl font-bold tracking-tight mb-2">
                 R$ {result.suggestedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </h3>
               
               {importedData && (
                  <div className="mb-4 p-2 bg-black/20 rounded-lg border border-white/10">
                      <div className="flex justify-between items-center text-xs">
                          <span className="text-orange-200">Valor no Orçamento (Aba Itens):</span>
                          <span className="font-bold">R$ {importedData.currentBudgetTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                  </div>
               )}
               
               {result.pricePerSqm > 0 && !importedData && (
                   <div className="mb-6 inline-block bg-black/20 px-3 py-1 rounded-lg text-xs font-medium text-orange-50 border border-white/10">
                       Referência: R$ {result.pricePerSqm.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / m²
                   </div>
               )}
               
               <div className="grid grid-cols-2 gap-4 border-t border-orange-500/30 pt-4">
                  <div>
                    <p className="text-orange-100 text-xs">Custo Total (Break Even)</p>
                    <p className="text-lg font-semibold">R$ {result.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-orange-200 opacity-70">Paga material, contas e seu salário</p>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-xs font-bold">Lucro Líquido da Empresa</p>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-bold text-emerald-50 bg-emerald-600/20 px-2 rounded">
                        R$ {result.estimatedProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <p className="text-[10px] text-emerald-100 opacity-70">Dinheiro para crescer/investir</p>
                  </div>
               </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg">
              <h4 className="text-zinc-400 text-sm font-bold mb-4 text-center">Para onde vai o dinheiro?</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                      itemStyle={{ color: '#f4f4f5' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-zinc-400 text-xs ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-orange-950/30 border border-orange-900/50 p-4 rounded-xl flex gap-3">
               <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
               <div className="text-xs text-orange-200/80">
                 <strong className="text-orange-500 block mb-1">Análise Financeira:</strong>
                 Seu preço sugerido já cobre seu salário mensal proporcional às {workHours}h trabalhadas. O "Lucro Líquido" é dinheiro extra para reinvestir na empresa.
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuoteCalculator;
