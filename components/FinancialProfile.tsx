
import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Building2, UserCircle, Calculator, Save, Clock } from 'lucide-react';
import { FinancialData } from '../types';

interface FinancialProfileProps {
  data: FinancialData;
  onUpdate: (data: FinancialData) => void;
}

const FinancialProfile: React.FC<FinancialProfileProps> = ({ data, onUpdate }) => {
  // Local state for form handling
  const [formData, setFormData] = useState<FinancialData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: keyof FinancialData['monthlyFixedCosts'] | 'proLabore' | 'workingDaysPerMonth' | 'workingHoursPerDay', value: string) => {
    // Validation: Ensure positive numbers only
    // Block negative signs manually just in case
    if (value.includes('-')) return;

    let numValue = 0;
    if (value !== '') {
        numValue = parseFloat(value);
    }

    if (isNaN(numValue) || numValue < 0) return;
    
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field === 'proLabore' || field === 'workingDaysPerMonth' || field === 'workingHoursPerDay') {
        // Explicit cast for TS comfort, though logic ensures it fits
        (newData as any)[field] = numValue;
      } else {
        newData.monthlyFixedCosts = {
            ...prev.monthlyFixedCosts,
            [field]: numValue
        };
      }

      // Recalculate totals immediately for preview
      const totalFixed = Object.values(newData.monthlyFixedCosts).reduce((a: number, b: number) => a + b, 0);
      newData.totalMonthlyCost = totalFixed + newData.proLabore;
      
      const days = newData.workingDaysPerMonth > 0 ? newData.workingDaysPerMonth : 1;
      newData.dailyCost = newData.totalMonthlyCost / days;

      const hours = newData.workingHoursPerDay > 0 ? newData.workingHoursPerDay : 8;
      newData.hourlyCost = newData.dailyCost / hours;

      return newData;
    });
  };

  const handleSave = () => {
    onUpdate(formData);
    // Visual feedback could go here
  };

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                <div className="bg-orange-600/20 p-2 rounded-lg">
                    <UserCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Objetivos Pessoais</h3>
                    <p className="text-xs text-zinc-400">Defina quanto você quer ganhar e sua carga horária.</p>
                </div>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Salário Desejado (Pro Labore)</label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.proLabore}
                        onChange={(e) => handleChange('proLabore', e.target.value)}
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                        placeholder="R$ 3.000,00"
                    />
                    <p className="text-[10px] text-zinc-500 mt-2">Valor líquido que você retira para sua conta pessoal todo mês.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Dias Trabalhados / Mês</label>
                        <input 
                            type="number" 
                            min="0"
                            max="31"
                            value={formData.workingDaysPerMonth}
                            onChange={(e) => handleChange('workingDaysPerMonth', e.target.value)}
                            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                            placeholder="22"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Horas / Dia</label>
                        <input 
                            type="number" 
                            min="1"
                            max="24"
                            value={formData.workingHoursPerDay || 8}
                            onChange={(e) => handleChange('workingHoursPerDay', e.target.value)}
                            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                            placeholder="8"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                <div className="bg-blue-600/20 p-2 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Custos Fixos da Empresa</h3>
                    <p className="text-xs text-zinc-400">Contas que chegam todo mês, tendo serviço ou não.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Aluguel / Condomínio</label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.monthlyFixedCosts.rent}
                        onChange={(e) => handleChange('rent', e.target.value)}
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Energia / Água / Internet</label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.monthlyFixedCosts.utilities}
                        onChange={(e) => handleChange('utilities', e.target.value)}
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Software / Contador</label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.monthlyFixedCosts.software}
                        onChange={(e) => handleChange('software', e.target.value)}
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Marketing / Anúncios</label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.monthlyFixedCosts.marketing}
                        onChange={(e) => handleChange('marketing', e.target.value)}
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">MEI / Impostos Fixos</label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.monthlyFixedCosts.mei_taxes}
                        onChange={(e) => handleChange('mei_taxes', e.target.value)}
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Outros / Manutenção</label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.monthlyFixedCosts.misc}
                        onChange={(e) => handleChange('misc', e.target.value)}
                        className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
        </div>

        <button 
            onClick={handleSave}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
        >
            <Save className="w-5 h-5" /> Salvar Configurações
        </button>
      </div>

      <div className="lg:col-span-5 space-y-6">
         <div className="sticky top-6">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-blue-500"></div>
                
                <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4">Seu Custo Hora Técnico</p>
                
                <div className="mb-8">
                    <h2 className="text-5xl font-black text-white tracking-tighter">
                        {formatCurrency(formData.hourlyCost || 0)}
                    </h2>
                    <p className="text-orange-500 font-medium mt-1">Por hora trabalhada</p>
                </div>

                <div className="bg-zinc-950/50 rounded-xl p-4 mb-6 border border-zinc-800">
                    <div className="flex justify-between items-center text-sm mb-1">
                         <span className="text-zinc-500">Custo Dia (Diária)</span>
                         <span className="font-bold text-zinc-300">{formatCurrency(formData.dailyCost)}</span>
                    </div>
                    <div className="text-[10px] text-zinc-600 text-right">Baseado em {formData.workingHoursPerDay || 8}h de trabalho</div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-zinc-700 pt-6">
                    <div className="text-left">
                        <p className="text-xs text-zinc-500 mb-1">Custo Fixo Total</p>
                        <p className="text-lg font-bold text-zinc-200">
                             {formatCurrency(formData.totalMonthlyCost)}<span className="text-xs font-normal text-zinc-500">/mês</span>
                        </p>
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-zinc-500 mb-1">Salário Definido</p>
                        <p className="text-lg font-bold text-emerald-400">
                            {formatCurrency(formData.proLabore)}<span className="text-xs font-normal text-zinc-500">/mês</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-blue-900/20 border border-blue-900/50 p-6 rounded-2xl">
                <h4 className="text-blue-400 font-bold flex items-center gap-2 mb-3">
                    <Calculator className="w-4 h-4" /> Como isso ajuda?
                </h4>
                <p className="text-sm text-blue-200/70 leading-relaxed">
                    Agora a <strong>Calculadora de Orçamento</strong> usará automaticamente o valor de 
                    <span className="text-white font-bold"> {formatCurrency(formData.hourlyCost || 0)} </span>
                    por hora.
                    <br/><br/>
                    Isso permite cobrar com precisão serviços rápidos (ex: 2 horas) ou projetos longos (ex: 3 dias/24h), sempre cobrindo seus custos.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FinancialProfile;
