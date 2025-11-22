
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, DollarSign, Calendar, Plus, Filter, 
  ChevronDown, FileText, Edit2
} from 'lucide-react';
import { CRMQuote, QuoteStage, FinancialData } from '../types';

interface CRMProps {
  financialData: FinancialData;
  quotes: CRMQuote[];
  onNewQuote: () => void;
  onEditQuote: (quote: CRMQuote) => void;
  onUpdateStage: (id: string, stage: QuoteStage) => void;
}

const CRM: React.FC<CRMProps> = ({ financialData, quotes, onNewQuote, onEditQuote, onUpdateStage }) => {
  const [filterStage, setFilterStage] = useState<QuoteStage | 'Todos'>('Todos');
  
  // Summary State
  const [currentMonthEarnings, setCurrentMonthEarnings] = useState(0);
  const [currentMonthCount, setCurrentMonthCount] = useState(0);

  // Calculate Summary whenever quotes change
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let earnings = 0;
    let count = 0;

    quotes.forEach(q => {
      const qDate = new Date(q.dateCreated);
      const isCurrentMonth = qDate.getMonth() === currentMonth && qDate.getFullYear() === currentYear;

      if (isCurrentMonth) {
        count++;
        if (q.currentStage === 'Pago') {
          earnings += q.quotedValue;
        }
      }
    });

    setCurrentMonthEarnings(earnings);
    setCurrentMonthCount(count);
  }, [quotes]);

  const stages: QuoteStage[] = ['Novo', 'Em análise', 'Aprovado', 'Em execução', 'Concluído', 'Pago'];

  const filteredQuotes = filterStage === 'Todos' 
    ? quotes 
    : quotes.filter(q => q.currentStage === filterStage);

  const getStageColor = (stage: QuoteStage) => {
    switch(stage) {
      case 'Novo': return 'bg-blue-500';
      case 'Em análise': return 'bg-yellow-500';
      case 'Aprovado': return 'bg-purple-500';
      case 'Em execução': return 'bg-orange-500';
      case 'Concluído': return 'bg-emerald-400';
      case 'Pago': return 'bg-emerald-600';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg flex items-center justify-between relative overflow-hidden">
           <div className="absolute right-0 top-0 p-6 opacity-5">
              <Calendar className="w-32 h-32 text-white" />
           </div>
           <div>
              <p className="text-zinc-400 text-sm font-medium">Orçamentos este mês</p>
              <h3 className="text-4xl font-bold text-white mt-2">{currentMonthCount}</h3>
              <p className="text-xs text-zinc-500 mt-1">Novos clientes em negociação</p>
           </div>
           <div className="bg-blue-600/20 p-3 rounded-xl">
              <FileText className="w-8 h-8 text-blue-500" />
           </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 p-6 opacity-5">
              <DollarSign className="w-32 h-32 text-emerald-500" />
           </div>
           <div>
              <p className="text-zinc-400 text-sm font-medium">Total Ganho (Pago)</p>
              <h3 className="text-4xl font-bold text-emerald-500 mt-2">
                R$ {currentMonthEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Entrada confirmada em caixa este mês</p>
           </div>
           <div className="bg-emerald-600/20 p-3 rounded-xl">
              <DollarSign className="w-8 h-8 text-emerald-500" />
           </div>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
            <button 
              onClick={() => setFilterStage('Todos')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStage === 'Todos' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'}`}
            >
              Todos
            </button>
            {stages.map(stage => (
              <button
                key={stage}
                onClick={() => setFilterStage(stage)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${filterStage === stage ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'}`}
              >
                <div className={`w-2 h-2 rounded-full ${getStageColor(stage)}`} />
                {stage}
              </button>
            ))}
         </div>

         <button 
            onClick={onNewQuote}
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-95 whitespace-nowrap"
         >
            <Plus className="w-5 h-5" /> Novo Orçamento
         </button>
      </div>

      {/* Quotes List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQuotes.length === 0 ? (
           <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed">
              <Briefcase className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-zinc-300 font-bold text-lg">Nenhum orçamento encontrado</h3>
              <p className="text-zinc-500 text-sm">Crie um novo orçamento para começar a gerenciar.</p>
           </div>
        ) : (
          filteredQuotes.map((quote) => (
            <div key={quote.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-0 overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-zinc-700 flex flex-col md:flex-row">
               {/* Status Indicator Strip */}
               <div className={`h-2 md:h-auto md:w-2 ${getStageColor(quote.currentStage)}`}></div>
               
               <div className="p-5 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  <div className="md:col-span-4">
                     <h4 className="font-bold text-white text-lg">{quote.clientName}</h4>
                     <p className="text-sm text-zinc-400 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {quote.serviceDescription}
                     </p>
                  </div>

                  <div className="md:col-span-3">
                     <p className="text-xs text-zinc-500 mb-1 uppercase font-bold">Valor Orçado</p>
                     <p className="text-xl font-bold text-white">
                       R$ {quote.quotedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                     </p>
                  </div>

                  <div className="md:col-span-2">
                     <p className="text-xs text-zinc-500 mb-1 uppercase font-bold">Data</p>
                     <p className="text-sm text-zinc-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(quote.dateCreated).toLocaleDateString()}
                     </p>
                  </div>

                  <div className="md:col-span-3 flex justify-start md:justify-end items-center gap-3">
                      <div className="relative group">
                         <select
                            value={quote.currentStage}
                            onChange={(e) => onUpdateStage(quote.id, e.target.value as QuoteStage)}
                            className="appearance-none bg-zinc-950 border border-zinc-700 text-white py-2 pl-4 pr-10 rounded-lg text-sm font-medium outline-none focus:border-orange-500 cursor-pointer hover:bg-zinc-900 transition-colors"
                         >
                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      </div>

                      <button 
                        onClick={() => onEditQuote(quote)}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors"
                        title="Editar Orçamento"
                      >
                          <Edit2 className="w-5 h-5" />
                      </button>
                  </div>

               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CRM;
