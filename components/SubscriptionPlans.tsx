
import React from 'react';
import { Check, Star, Shield, Zap, Lock } from 'lucide-react';
import Logo from './Logo';

interface SubscriptionPlansProps {
  onSelectPlan: (plan: 'monthly' | 'annual') => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
             <div className="bg-zinc-900 p-4 rounded-3xl shadow-2xl shadow-orange-900/20 border border-zinc-800">
                <Logo className="w-16 h-16" />
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Escolha seu plano <span className="text-orange-500">Pro</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Desbloqueie todas as ferramentas: Calculadora de Material, CRM, Orçamentos em PDF e IA Técnica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 flex flex-col relative hover:border-zinc-700 transition-all group">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white">Mensal</h3>
                <p className="text-zinc-500 text-sm">Pagamento recorrente</p>
            </div>
            <div className="mb-6">
                <span className="text-4xl font-black text-white">R$ 49,90</span>
                <span className="text-zinc-500">/mês</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Check className="w-5 h-5 text-zinc-600" /> Acesso total ao sistema
                </li>
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Check className="w-5 h-5 text-zinc-600" /> Orçamentos ilimitados
                </li>
                <li className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Check className="w-5 h-5 text-zinc-600" /> Suporte por email
                </li>
            </ul>
            <button 
                onClick={() => onSelectPlan('monthly')}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors border border-zinc-700"
            >
                Começar Teste Grátis (7 dias)
            </button>
          </div>

          {/* Annual Plan */}
          <div className="bg-zinc-900 rounded-3xl p-8 border-2 border-orange-500 relative shadow-2xl shadow-orange-900/20 flex flex-col transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" /> Mais Popular
            </div>
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white">Anual</h3>
                <p className="text-orange-200/60 text-sm">Economize 20%</p>
            </div>
            <div className="mb-6">
                <span className="text-4xl font-black text-white">R$ 39,90</span>
                <span className="text-zinc-500">/mês</span>
                <p className="text-xs text-zinc-500 mt-1">Cobrado anualmente (R$ 478,80)</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-white text-sm font-medium">
                    <div className="bg-orange-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-orange-500" /></div>
                    Tudo do plano mensal
                </li>
                <li className="flex items-center gap-3 text-white text-sm font-medium">
                    <div className="bg-orange-500/20 p-1 rounded-full"><Shield className="w-3 h-3 text-orange-500" /></div>
                    Selo de "Aplicador Verificado"
                </li>
                <li className="flex items-center gap-3 text-white text-sm font-medium">
                    <div className="bg-orange-500/20 p-1 rounded-full"><Zap className="w-3 h-3 text-orange-500" /></div>
                    Acesso antecipado a novos recursos
                </li>
                <li className="flex items-center gap-3 text-white text-sm font-medium">
                    <div className="bg-orange-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-orange-500" /></div>
                    Suporte prioritário WhatsApp
                </li>
            </ul>
            <button 
                onClick={() => onSelectPlan('annual')}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl font-bold transition-all shadow-lg transform active:scale-95"
            >
                Começar Teste Grátis (7 dias)
            </button>
            <p className="text-center text-[10px] text-zinc-500 mt-3">
                Cancele a qualquer momento durante o período de teste.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-zinc-600 text-sm flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Pagamento processado de forma segura.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
