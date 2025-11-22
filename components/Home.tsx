
import React from 'react';
import { 
  Plus, Briefcase, MessageSquare, TrendingUp, Clock, 
  AlertTriangle, CheckCircle2, Calendar, ArrowRight 
} from 'lucide-react';
import { UserProfile, CRMQuote, ViewMode } from '../types';

interface HomeProps {
  userProfile: UserProfile;
  quotes: CRMQuote[];
  onNavigate: (mode: ViewMode) => void;
}

const Home: React.FC<HomeProps> = ({ userProfile, quotes, onNavigate }) => {
  
  // Quick Stats
  const pendingQuotes = quotes.filter(q => ['Novo', 'Em análise', 'Aprovado'].includes(q.currentStage)).length;
  const activeServices = quotes.filter(q => q.currentStage === 'Em execução').length;
  
  const currentMonth = new Date().getMonth();
  const paidThisMonth = quotes
    .filter(q => q.currentStage === 'Pago' && new Date(q.dateCreated).getMonth() === currentMonth)
    .reduce((acc, q) => acc + q.quotedValue, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
           <TrendingUp className="w-64 h-64 -mr-10 -mt-10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Olá, {userProfile.name.split(' ')[0]}!
          </h1>
          <p className="text-orange-100 text-lg max-w-xl">
            Bem-vindo de volta. Você tem <strong className="text-white">{activeServices} serviços em execução</strong> e <strong className="text-white">{pendingQuotes} orçamentos</strong> aguardando atenção.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <button 
              onClick={() => onNavigate(ViewMode.MATERIAL_ESTIMATOR)}
              className="bg-white text-orange-700 hover:bg-orange-50 font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" /> Novo Orçamento
            </button>
            <button 
              onClick={() => onNavigate(ViewMode.CRM)}
              className="bg-orange-900/40 hover:bg-orange-900/60 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 backdrop-blur-sm transition-all border border-white/10"
            >
              <Briefcase className="w-5 h-5" /> Ver Minha Agenda
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg hover:border-zinc-700 transition-colors group">
          <div className="flex justify-between items-start mb-4">
             <div className="bg-emerald-500/20 p-3 rounded-xl group-hover:bg-emerald-500/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
             </div>
             <span className="text-xs font-bold text-zinc-500 uppercase bg-zinc-950 px-2 py-1 rounded">Este Mês</span>
          </div>
          <p className="text-zinc-400 text-sm font-medium">Faturamento (Pago)</p>
          <h3 className="text-2xl font-bold text-white mt-1">
            R$ {paidThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg hover:border-zinc-700 transition-colors group">
          <div className="flex justify-between items-start mb-4">
             <div className="bg-blue-500/20 p-3 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                <Clock className="w-6 h-6 text-blue-500" />
             </div>
          </div>
          <p className="text-zinc-400 text-sm font-medium">Em Execução</p>
          <h3 className="text-2xl font-bold text-white mt-1">
            {activeServices} <span className="text-base font-normal text-zinc-500">Projetos</span>
          </h3>
        </div>

        <div 
          onClick={() => onNavigate(ViewMode.AI_ASSISTANT)}
          className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg hover:border-orange-500/50 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
             <div className="bg-orange-500/20 p-3 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                <MessageSquare className="w-6 h-6 text-orange-500" />
             </div>
             <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-orange-500 transition-colors" />
          </div>
          <p className="text-zinc-400 text-sm font-medium">Precisa de ajuda?</p>
          <h3 className="text-lg font-bold text-white mt-1 group-hover:text-orange-400 transition-colors">
            Falar com IA Técnica
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity (Simplified) */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-400" /> Últimos Orçamentos
          </h3>
          <div className="space-y-3">
            {quotes.slice(0, 4).map(quote => (
              <div key={quote.id} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                 <div>
                    <p className="text-white font-medium text-sm">{quote.clientName}</p>
                    <p className="text-zinc-500 text-xs">{quote.serviceDescription}</p>
                 </div>
                 <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      quote.currentStage === 'Pago' ? 'bg-emerald-500/20 text-emerald-500' :
                      quote.currentStage === 'Novo' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {quote.currentStage}
                    </span>
                 </div>
              </div>
            ))}
            {quotes.length === 0 && (
              <p className="text-zinc-500 text-sm text-center py-4">Nenhum orçamento recente.</p>
            )}
            <button 
              onClick={() => onNavigate(ViewMode.CRM)}
              className="w-full text-center text-sm text-zinc-400 hover:text-white mt-2 py-2"
            >
              Ver todos os orçamentos
            </button>
          </div>
        </div>

        {/* Daily Tip */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 relative overflow-hidden">
           <div className="absolute -right-6 -bottom-6 opacity-5">
              <AlertTriangle className="w-40 h-40 text-white" />
           </div>
           <div className="relative z-10">
             <h3 className="text-orange-500 font-bold text-lg mb-2 flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5" /> Dica do Especialista
             </h3>
             <p className="text-zinc-300 leading-relaxed">
               "Sempre limpe a superfície com álcool isopropílico antes da aplicação. Resíduos de cera ou gordura são os maiores causadores de descolamento prematuro (lifting) nas bordas."
             </p>
             <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  IA
                </div>
                <div className="text-xs text-zinc-500">
                   <strong className="text-zinc-300 block">Assistente Técnico</strong>
                   Dica gerada automaticamente
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
