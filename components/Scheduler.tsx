
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, ExternalLink, CheckCircle2, CalendarDays, ChevronLeft, ChevronRight, MoreHorizontal, MapPin, Video } from 'lucide-react';
import { CalendarEvent } from '../types';

const Scheduler: React.FC = () => {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Dummy events state
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
        id: '1',
        title: 'Envelopamento Teto - Corolla',
        start: new Date(new Date().setHours(9, 0, 0, 0)),
        end: new Date(new Date().setHours(12, 0, 0, 0)),
        type: 'service',
        clientName: 'João Silva',
        status: 'confirmed'
    },
    {
        id: '2',
        title: 'Orçamento Presencial - Frota',
        start: new Date(new Date().setDate(new Date().getDate() + 1)),
        end: new Date(new Date().setDate(new Date().getDate() + 1)),
        type: 'quote',
        clientName: 'Transportadora Rapido',
        status: 'pending'
    }
  ]);

  // Add Service Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventClient, setNewEventClient] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [newEventDuration, setNewEventDuration] = useState(2); // hours

  // Simulate Google Connection
  const handleGoogleConnect = () => {
      setIsConnecting(true);
      setTimeout(() => {
          setIsGoogleConnected(true);
          setIsConnecting(false);
          // Simulate importing events
          const googleEvent: CalendarEvent = {
              id: 'g1',
              title: 'Consulta Dentista (Google Agenda)',
              start: new Date(new Date().setHours(14, 0, 0, 0)),
              end: new Date(new Date().setHours(15, 0, 0, 0)),
              type: 'personal',
              status: 'confirmed'
          };
          setEvents(prev => [...prev, googleEvent]);
      }, 2000);
  };

  const handleAddEvent = () => {
      if (!newEventTitle || !newEventDate) return;

      const start = new Date(`${newEventDate}T${newEventTime}`);
      const end = new Date(start.getTime() + newEventDuration * 60 * 60 * 1000);

      const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: newEventTitle,
          start: start,
          end: end,
          clientName: newEventClient,
          type: 'service',
          status: 'confirmed'
      };

      setEvents([...events, newEvent]);
      setShowAddModal(false);
      setNewEventTitle('');
      setNewEventClient('');
  };

  // Calendar Grid Logic
  const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      
      const days = [];
      for (let i = 0; i < firstDay; i++) {
          days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
          days.push(new Date(year, month, i));
      }
      return days;
  };

  const changeMonth = (delta: number) => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const getEventsForDay = (date: Date) => {
      return events.filter(e => 
        e.start.getDate() === date.getDate() && 
        e.start.getMonth() === date.getMonth() && 
        e.start.getFullYear() === date.getFullYear()
      );
  };

  return (
    <div className="space-y-6">
       {/* Header / Integration Status */}
       <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CalendarDays className="w-6 h-6 text-orange-500" /> Minha Agenda
                </h2>
                <p className="text-zinc-400 text-sm mt-1">
                    Organize seus serviços e evite conflitos de horário.
                </p>
            </div>
            
            {!isGoogleConnected ? (
                <button 
                    onClick={handleGoogleConnect}
                    disabled={isConnecting}
                    className="bg-white text-zinc-900 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-100 transition-colors disabled:opacity-70"
                >
                    {isConnecting ? (
                        <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" /> Conectando...</span>
                    ) : (
                        <>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/1024px-Google_Calendar_icon_%282020%29.svg.png" alt="G" className="w-5 h-5" />
                            Conectar Google Agenda
                        </>
                    )}
                </button>
            ) : (
                <div className="flex items-center gap-2 bg-emerald-900/20 text-emerald-500 px-4 py-2.5 rounded-xl border border-emerald-900/50">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-bold">Sincronizado com Google</span>
                </div>
            )}
       </div>

       {/* Calendar View */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-8 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                {/* Calendar Controls */}
                <div className="p-4 flex justify-between items-center border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="text-lg font-bold text-white capitalize">
                        {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"><ChevronLeft className="w-5 h-5"/></button>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"><ChevronRight className="w-5 h-5"/></button>
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 bg-zinc-950 p-2 text-center border-b border-zinc-800">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                        <div key={d} className="text-xs font-bold text-zinc-500 uppercase py-2">{d}</div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 auto-rows-fr min-h-[400px]">
                    {getDaysInMonth(currentDate).map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="bg-zinc-900/50 border-r border-b border-zinc-800/50" />;
                        
                        const dayEvents = getEventsForDay(date);
                        const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth();

                        return (
                            <div 
                                key={date.toISOString()} 
                                className={`p-2 border-r border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer min-h-[100px] relative group ${isToday ? 'bg-zinc-800/30' : ''}`}
                                onClick={() => {
                                    setNewEventDate(date.toISOString().split('T')[0]);
                                    setShowAddModal(true);
                                }}
                            >
                                <span className={`text-sm font-medium ${isToday ? 'text-orange-500' : 'text-zinc-400'}`}>{date.getDate()}</span>
                                
                                <div className="space-y-1 mt-1">
                                    {dayEvents.map(ev => (
                                        <div key={ev.id} className={`text-[9px] p-1 rounded truncate ${
                                            ev.type === 'personal' ? 'bg-zinc-700 text-zinc-300' :
                                            ev.type === 'quote' ? 'bg-blue-900/50 text-blue-200 border border-blue-800' :
                                            'bg-orange-900/50 text-orange-200 border border-orange-800'
                                        }`}>
                                            {ev.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {ev.title}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Add Button on Hover */}
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-orange-600 rounded-full p-1 shadow-lg">
                                        <Plus className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar / Upcoming */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-white">Próximos Serviços</h3>
                         <button onClick={() => setShowAddModal(true)} className="text-xs text-orange-500 hover:text-orange-400 font-medium">Adicionar</button>
                    </div>
                    <div className="space-y-4">
                        {events.sort((a, b) => a.start.getTime() - b.start.getTime()).slice(0, 4).map(ev => (
                            <div key={ev.id} className="flex gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                                <div className={`w-1 rounded-full ${
                                    ev.type === 'personal' ? 'bg-zinc-500' : 
                                    ev.type === 'quote' ? 'bg-blue-500' : 'bg-orange-500'
                                }`}></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                                    {ev.clientName && <p className="text-xs text-zinc-400 flex items-center gap-1"><ExternalLink className="w-3 h-3"/> {ev.clientName}</p>}
                                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {ev.start.toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})} • {ev.start.getHours()}:00
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 text-white relative overflow-hidden">
                     <div className="absolute right-0 bottom-0 opacity-10">
                         <Clock className="w-32 h-32 -mr-4 -mb-4" />
                     </div>
                     <h3 className="font-bold text-lg mb-2">Agendamento Online</h3>
                     <p className="text-sm text-orange-100 mb-4">Envie seu link pessoal para clientes agendarem orçamentos automaticamente.</p>
                     <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                         <ExternalLink className="w-4 h-4" /> Copiar Link de Agenda
                     </button>
                </div>
            </div>
       </div>

       {/* Add Event Modal */}
       {showAddModal && (
           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                   <h3 className="text-lg font-bold text-white mb-4">Novo Agendamento</h3>
                   <div className="space-y-4">
                       <div>
                           <label className="text-xs font-medium text-zinc-400">Título do Serviço</label>
                           <input 
                                type="text" 
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-orange-500 mt-1"
                                placeholder="Ex: Envelopamento Capô"
                           />
                       </div>
                       <div>
                           <label className="text-xs font-medium text-zinc-400">Cliente (Opcional)</label>
                           <input 
                                type="text" 
                                value={newEventClient}
                                onChange={(e) => setNewEventClient(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-orange-500 mt-1"
                           />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="text-xs font-medium text-zinc-400">Data</label>
                               <input 
                                    type="date" 
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-orange-500 mt-1"
                               />
                           </div>
                           <div>
                               <label className="text-xs font-medium text-zinc-400">Hora</label>
                               <input 
                                    type="time" 
                                    value={newEventTime}
                                    onChange={(e) => setNewEventTime(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-orange-500 mt-1"
                               />
                           </div>
                       </div>
                   </div>
                   <div className="flex gap-3 mt-6">
                       <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl">Cancelar</button>
                       <button onClick={handleAddEvent} className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold">Salvar</button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default Scheduler;
    