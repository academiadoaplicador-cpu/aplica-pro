
import React from 'react';
import { CRMQuote } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieIcon, Target, CheckCircle2 } from 'lucide-react';

interface ReportsProps {
  quotes: CRMQuote[];
}

const Reports: React.FC<ReportsProps> = ({ quotes }) => {
  // KPI Calculations
  const totalQuotes = quotes.length;
  const totalValueAll = quotes.reduce((acc, q) => acc + q.quotedValue, 0);
  
  const paidQuotes = quotes.filter(q => q.currentStage === 'Pago');
  const totalPaid = paidQuotes.reduce((acc, q) => acc + q.quotedValue, 0);
  
  const activeQuotes = quotes.filter(q => ['Novo', 'Em análise', 'Aprovado', 'Em execução', 'Concluído'].includes(q.currentStage));
  const totalPipeline = activeQuotes.reduce((acc, q) => acc + q.quotedValue, 0);

  const conversionRate = totalQuotes > 0 ? ((paidQuotes.length / totalQuotes) * 100).toFixed(1) : '0';
  const avgTicket = paidQuotes.length > 0 ? totalPaid / paidQuotes.length : 0;

  // Data for Pie Chart (Distribution by Stage)
  const stageDistribution = [
    { name: 'Novos/Análise', value: quotes.filter(q => ['Novo', 'Em análise'].includes(q.currentStage)).length },
    { name: 'Em Execução', value: quotes.filter(q => ['Aprovado', 'Em execução'].includes(q.currentStage)).length },
    { name: 'Concluído/Pago', value: quotes.filter(q => ['Concluído', 'Pago'].includes(q.currentStage)).length },
  ].filter(item => item.value > 0);

  const COLORS = ['#3b82f6', '#f97316', '#10b981'];

  // Data for Bar Chart (Value by Stage)
  const valueByStage = [
    { name: 'Novo', value: quotes.filter(q => q.currentStage === 'Novo').reduce((acc, q) => acc + q.quotedValue, 0) },
    { name: 'Análise', value: quotes.filter(q => q.currentStage === 'Em análise').reduce((acc, q) => acc + q.quotedValue, 0) },
    { name: 'Aprovado', value: quotes.filter(q => q.currentStage === 'Aprovado').reduce((acc, q) => acc + q.quotedValue, 0) },
    { name: 'Execução', value: quotes.filter(q => q.currentStage === 'Em execução').reduce((acc, q) => acc + q.quotedValue, 0) },
    { name: 'Concluído', value: quotes.filter(q => q.currentStage === 'Concluído').reduce((acc, q) => acc + q.quotedValue, 0) },
    { name: 'Pago', value: quotes.filter(q => q.currentStage === 'Pago').reduce((acc, q) => acc + q.quotedValue, 0) },
  ];

  return (
    <div className="space-y-8">
       {/* KPI Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Paid */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-zinc-400 text-xs font-bold uppercase">Receita Confirmada</p>
                   <h3 className="text-2xl font-bold text-emerald-500 mt-1">
                      R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </h3>
                </div>
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                   <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
             </div>
             <p className="text-[10px] text-zinc-500">{paidQuotes.length} serviços pagos</p>
          </div>

           {/* Pipeline Value */}
           <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-zinc-400 text-xs font-bold uppercase">Em Negociação/Exec.</p>
                   <h3 className="text-2xl font-bold text-blue-500 mt-1">
                      R$ {totalPipeline.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </h3>
                </div>
                <div className="bg-blue-500/20 p-2 rounded-lg">
                   <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
             </div>
             <p className="text-[10px] text-zinc-500">{activeQuotes.length} serviços ativos</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-zinc-400 text-xs font-bold uppercase">Taxa de Conversão</p>
                   <h3 className="text-2xl font-bold text-orange-500 mt-1">
                      {conversionRate}%
                   </h3>
                </div>
                <div className="bg-orange-500/20 p-2 rounded-lg">
                   <Target className="w-6 h-6 text-orange-500" />
                </div>
             </div>
             <p className="text-[10px] text-zinc-500">Serviços pagos sobre total</p>
          </div>

          {/* Avg Ticket */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-zinc-400 text-xs font-bold uppercase">Ticket Médio</p>
                   <h3 className="text-2xl font-bold text-white mt-1">
                      R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </h3>
                </div>
                <div className="bg-zinc-800 p-2 rounded-lg">
                   <CheckCircle2 className="w-6 h-6 text-zinc-400" />
                </div>
             </div>
             <p className="text-[10px] text-zinc-500">Média por serviço fechado</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stage Pie Chart */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
             <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-orange-500" /> Distribuição de Orçamentos
             </h3>
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={stageDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {stageDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                            itemStyle={{ color: '#f4f4f5' }}
                        />
                        <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-zinc-400 text-sm ml-1">{value}</span>}/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Value Bar Chart */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
             <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" /> Valor em Pipeline (Funil)
             </h3>
             <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={valueByStage}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            stroke="#71717a" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="#71717a" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                            cursor={{fill: '#27272a'}}
                            formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                            itemStyle={{ color: '#f4f4f5' }}
                        />
                        <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Reports;
