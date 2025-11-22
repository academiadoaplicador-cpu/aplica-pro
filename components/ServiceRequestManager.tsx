
import React, { useState } from 'react';
import { Share2, Copy, ExternalLink, Inbox, CheckCircle2, DollarSign, Plus, QrCode, CreditCard, ArrowRight } from 'lucide-react';
import { ServiceRequest, PaymentLink, ViewMode } from '../types';

interface ServiceRequestManagerProps {
    requests: ServiceRequest[];
    payments: PaymentLink[];
    onSimulateClientView: () => void;
    onCreatePayment: (payment: PaymentLink) => void;
}

const ServiceRequestManager: React.FC<ServiceRequestManagerProps> = ({ requests, payments, onSimulateClientView, onCreatePayment }) => {
    const [newPaymentAmount, setNewPaymentAmount] = useState('');
    const [newPaymentClient, setNewPaymentClient] = useState('');
    const [newPaymentDesc, setNewPaymentDesc] = useState('');

    const handleCreatePayment = () => {
        if (!newPaymentAmount || !newPaymentClient) return;
        
        const newLink: PaymentLink = {
            id: Date.now().toString(),
            clientName: newPaymentClient,
            description: newPaymentDesc || 'Serviço de Envelopamento',
            amount: parseFloat(newPaymentAmount),
            status: 'pending',
            dateCreated: new Date()
        };
        
        onCreatePayment(newLink);
        setNewPaymentAmount('');
        setNewPaymentClient('');
        setNewPaymentDesc('');
    };

    return (
        <div className="space-y-8">
            {/* Header Actions */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Links de Divulgação</h2>
                        <p className="text-sm text-zinc-400 mt-1">Compartilhe para receber solicitações de serviço.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={onSimulateClientView}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-zinc-700"
                        >
                            <ExternalLink className="w-4 h-4" /> Simular Visão do Cliente
                        </button>
                        <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg">
                            <Copy className="w-4 h-4" /> Copiar Link da Bio
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Requests Column */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Inbox className="w-5 h-5 text-blue-500" /> Solicitações Recebidas
                    </h3>
                    
                    {requests.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl p-8 text-center">
                            <p className="text-zinc-500">Nenhuma solicitação nova.</p>
                        </div>
                    ) : (
                        requests.map(req => (
                            <div key={req.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white">{req.clientName}</h4>
                                    <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full border border-blue-900/50">
                                        {req.type}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{req.description}</p>
                                <div className="flex justify-between items-center text-xs text-zinc-500">
                                    <span>{new Date(req.date).toLocaleDateString()}</span>
                                    <button className="text-orange-500 hover:text-orange-400 font-bold flex items-center gap-1">
                                        Responder <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Payments Column */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-500" /> Links de Cobrança
                    </h3>

                    {/* Generator */}
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                        <h4 className="text-sm font-bold text-zinc-300 mb-3">Criar Novo Link</h4>
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                value={newPaymentClient}
                                onChange={(e) => setNewPaymentClient(e.target.value)}
                                placeholder="Nome do Cliente"
                                className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none"
                            />
                            <input 
                                type="number" 
                                value={newPaymentAmount}
                                onChange={(e) => setNewPaymentAmount(e.target.value)}
                                placeholder="Valor (R$)"
                                className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none"
                            />
                            <button 
                                onClick={handleCreatePayment}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Gerar Link de Pagamento
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        {payments.map(pay => (
                            <div key={pay.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-white text-sm">{pay.clientName}</p>
                                    <p className="text-xs text-zinc-500">Link criado em {new Date(pay.dateCreated).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-500">R$ {pay.amount.toFixed(2)}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        {pay.status === 'paid' ? (
                                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Pago
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                                                Pendente
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestManager;
