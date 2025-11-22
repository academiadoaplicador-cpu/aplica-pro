
import React, { useState } from 'react';
import { ArrowLeft, Camera, Send, CreditCard, QrCode, CheckCircle2, MapPin, Car, Refrigerator, Ruler, ArrowRight, DollarSign, Navigation } from 'lucide-react';
import { PaymentLink, ServiceRequest } from '../types';
import Logo from './Logo';

interface ClientPortalProps {
    onBack: () => void;
    onSubmitRequest: (req: ServiceRequest) => void;
    pendingPayments: PaymentLink[];
    onPay: (id: string) => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ onBack, onSubmitRequest, pendingPayments, onPay }) => {
    const [activeTab, setActiveTab] = useState<'request' | 'pay'>('request');
    const [requestSent, setRequestSent] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Wizard State
    const [step, setStep] = useState(1); // 1: Location, 2: Service Type, 3: Material, 4: Result/Contact
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Estimate Data
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState('');
    const [distance, setDistance] = useState(0);
    const [travelFee, setTravelFee] = useState(0);

    const [serviceCategory, setServiceCategory] = useState<'vehicle' | 'fridge' | 'flat'>('vehicle');
    const [subType, setSubType] = useState('');
    const [materialTier, setMaterialTier] = useState<'Econômico' | 'Padrão' | 'Premium'>('Padrão');

    // Final Contact Info
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [desc, setDesc] = useState('');

    // Mock Data for Estimation
    const basePrices = {
        vehicle: {
            'Hatch Pequeno': { material: 14, labor: 500 },
            'Hatch Médio': { material: 16, labor: 600 },
            'Sedan': { material: 18, labor: 700 },
            'SUV': { material: 22, labor: 900 },
            'Picape': { material: 24, labor: 1000 }
        },
        fridge: {
            '1 Porta': { material: 3.5, labor: 250 },
            'Duplex': { material: 5, labor: 350 },
            'Side by Side': { material: 7, labor: 500 }
        },
        flat: {
            'Parede Pequena (3x3)': { material: 10, labor: 300 },
            'Parede Grande': { material: 20, labor: 600 }
        }
    };

    const materialMultipliers = {
        'Econômico': 30, // R$/m
        'Padrão': 65,
        'Premium': 120
    };

    const handleCepSearch = async () => {
        if (cep.length < 8) return;
        setLoadingLocation(true);
        try {
            const cleanCep = cep.replace(/\D/g, '');
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();
            
            if (!data.erro) {
                setAddress(`${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`);
                
                // MOCK DISTANCE CALCULATION (Random between 2km and 30km for demo)
                const mockDist = Math.floor(Math.random() * 28) + 2; 
                setDistance(mockDist);
                
                // Fee logic: R$ 2.50 per km
                setTravelFee(mockDist * 2.50);
                
                setStep(2);
            } else {
                alert("CEP não encontrado.");
            }
        } catch (error) {
            alert("Erro ao buscar CEP.");
        } finally {
            setLoadingLocation(false);
        }
    };

    const calculateEstimate = () => {
        let base = { material: 0, labor: 0 };
        
        // Safety check for dynamic key access
        if (serviceCategory === 'vehicle') {
             base = (basePrices.vehicle as any)[subType] || { material: 0, labor: 0 };
        } else if (serviceCategory === 'fridge') {
             base = (basePrices.fridge as any)[subType] || { material: 0, labor: 0 };
        } else {
             base = (basePrices.flat as any)[subType] || { material: 0, labor: 0 };
        }

        const matCost = base.material * materialMultipliers[materialTier];
        const total = matCost + base.labor + travelFee;
        
        return {
            min: total * 0.9, // -10% range
            max: total * 1.1  // +10% range
        };
    };

    const handleSubmit = () => {
        if (!name || !contact) return;
        
        const estimate = calculateEstimate();

        const newReq: ServiceRequest = {
            id: Date.now().toString(),
            clientName: name,
            contact: contact,
            type: `${serviceCategory} - ${subType}`,
            description: desc || `Solicitação via Portal: ${materialTier}`,
            date: new Date(),
            status: 'pending',
            budgetDetails: {
                serviceType: serviceCategory,
                subType: subType,
                materialTier: materialTier,
                address: address,
                distanceKm: distance,
                estimatedValueMin: estimate.min,
                estimatedValueMax: estimate.max
            }
        };
        
        onSubmitRequest(newReq);
        setRequestSent(true);
    };

    const handlePay = (id: string) => {
        onPay(id);
        setPaymentSuccess(true);
        setTimeout(() => setPaymentSuccess(false), 3000);
    };

    const estimate = calculateEstimate();

    return (
        <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans pb-12">
            {/* Mobile Header */}
            <div className="bg-zinc-900 p-4 text-white flex items-center justify-between shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Logo className="w-8 h-8" />
                    <span className="font-bold text-sm">Portal do Cliente</span>
                </div>
                <button onClick={onBack} className="text-xs text-zinc-400 border border-zinc-700 px-2 py-1 rounded hover:text-white">
                    Sair
                </button>
            </div>

            <div className="max-w-md mx-auto p-4">
                
                {/* Tabs */}
                <div className="flex bg-white rounded-xl p-1 shadow-sm mb-6">
                    <button 
                        onClick={() => setActiveTab('request')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'request' ? 'bg-orange-600 text-white shadow' : 'text-zinc-500'}`}
                    >
                        Orçamento Online
                    </button>
                    <button 
                        onClick={() => setActiveTab('pay')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'pay' ? 'bg-orange-600 text-white shadow' : 'text-zinc-500'}`}
                    >
                        Meus Pagamentos
                    </button>
                </div>

                {activeTab === 'request' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
                        {requestSent ? (
                            <div className="text-center py-10">
                                <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-800">Solicitação Enviada!</h3>
                                <p className="text-zinc-500 text-sm mt-2">Recebemos seu pedido com a estimativa. Entraremos em contato pelo WhatsApp.</p>
                                <button onClick={() => { setRequestSent(false); setStep(1); }} className="mt-6 text-orange-600 font-bold text-sm hover:underline">
                                    Novo orçamento
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Progress Bar */}
                                <div className="flex justify-between mb-6 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -z-10"></div>
                                    {[1, 2, 3, 4].map(s => (
                                        <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-orange-600 text-white' : 'bg-zinc-200 text-zinc-400'}`}>
                                            {s}
                                        </div>
                                    ))}
                                </div>

                                {/* STEP 1: Location */}
                                {step === 1 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                        <h2 className="text-xl font-bold text-zinc-800">Onde será o serviço?</h2>
                                        <p className="text-sm text-zinc-500">Informe seu CEP para calcularmos o deslocamento do aplicador mais próximo.</p>
                                        
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                            <input 
                                                value={cep}
                                                onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                                                className="w-full p-4 pl-10 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-orange-500 outline-none"
                                                placeholder="00000-000"
                                                maxLength={8}
                                            />
                                        </div>

                                        <button 
                                            onClick={handleCepSearch}
                                            disabled={loadingLocation || cep.length < 8}
                                            className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loadingLocation ? 'Calculando...' : 'Continuar'} <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* STEP 2: Service Type */}
                                {step === 2 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                        <button onClick={() => setStep(1)} className="text-xs text-zinc-400 hover:text-orange-500 flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3"/> Voltar</button>
                                        <h2 className="text-xl font-bold text-zinc-800">O que vamos fazer?</h2>
                                        
                                        {/* Category Selector */}
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <button onClick={() => setServiceCategory('vehicle')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 ${serviceCategory === 'vehicle' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-zinc-200'}`}>
                                                <Car className="w-6 h-6" /> <span className="text-xs font-bold">Veículo</span>
                                            </button>
                                            <button onClick={() => setServiceCategory('fridge')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 ${serviceCategory === 'fridge' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-zinc-200'}`}>
                                                <Refrigerator className="w-6 h-6" /> <span className="text-xs font-bold">Geladeira</span>
                                            </button>
                                            <button onClick={() => setServiceCategory('flat')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 ${serviceCategory === 'flat' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-zinc-200'}`}>
                                                <Ruler className="w-6 h-6" /> <span className="text-xs font-bold">Parede</span>
                                            </button>
                                        </div>

                                        {/* Sub Type Selector */}
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-zinc-500 uppercase">Selecione o Modelo:</p>
                                            {Object.keys(basePrices[serviceCategory]).map(opt => (
                                                <button 
                                                    key={opt}
                                                    onClick={() => { setSubType(opt); setStep(3); }}
                                                    className={`w-full p-4 text-left rounded-xl border hover:border-orange-500 hover:bg-orange-50 transition-all ${subType === opt ? 'border-orange-500 bg-orange-50 font-bold' : 'border-zinc-100 bg-zinc-50'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {address && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700 flex items-center gap-2">
                                                <Navigation className="w-3 h-3" /> Distância do Aplicador: ~{distance}km
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* STEP 3: Material */}
                                {step === 3 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                        <button onClick={() => setStep(2)} className="text-xs text-zinc-400 hover:text-orange-500 flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3"/> Voltar</button>
                                        <h2 className="text-xl font-bold text-zinc-800">Qualidade do Material</h2>
                                        
                                        <div className="space-y-3">
                                            <button onClick={() => { setMaterialTier('Econômico'); setStep(4); }} className="w-full p-4 rounded-xl border border-zinc-200 hover:border-orange-500 text-left group transition-all">
                                                <div className="font-bold text-zinc-700 group-hover:text-orange-600">Linha Econômica (Promocional)</div>
                                                <div className="text-xs text-zinc-500 mt-1">Ideal para campanhas curtas ou superfícies planas simples. Menor durabilidade.</div>
                                            </button>
                                            <button onClick={() => { setMaterialTier('Padrão'); setStep(4); }} className="w-full p-4 rounded-xl border border-zinc-200 hover:border-orange-500 text-left group transition-all bg-orange-50/30 border-orange-200">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-bold text-zinc-900 group-hover:text-orange-600">Linha Padrão (Recomendado)</div>
                                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">Mais Pedido</span>
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-1">Vinil polimérico de boa durabilidade e acabamento. Ótimo custo-benefício.</div>
                                            </button>
                                            <button onClick={() => { setMaterialTier('Premium'); setStep(4); }} className="w-full p-4 rounded-xl border border-zinc-200 hover:border-orange-500 text-left group transition-all">
                                                <div className="font-bold text-zinc-700 group-hover:text-orange-600">Linha Premium / Cast</div>
                                                <div className="text-xs text-zinc-500 mt-1">Máxima durabilidade e conformação. Para envelopamento total complexo.</div>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: Result & Form */}
                                {step === 4 && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                        <button onClick={() => setStep(3)} className="text-xs text-zinc-400 hover:text-orange-500 flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3"/> Voltar</button>
                                        
                                        <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-lg text-center relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
                                            <p className="text-zinc-400 text-xs font-bold uppercase mb-2">Estimativa de Investimento</p>
                                            <h2 className="text-3xl font-bold text-white">
                                                R$ {Math.floor(estimate.min).toLocaleString()} - {Math.ceil(estimate.max).toLocaleString()}
                                            </h2>
                                            <p className="text-[10px] text-zinc-500 mt-2">*Valor aproximado incluindo material e deslocamento.</p>
                                        </div>

                                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs text-zinc-600 space-y-1">
                                            <div className="flex justify-between"><span>Serviço:</span> <strong>{serviceCategory} - {subType}</strong></div>
                                            <div className="flex justify-between"><span>Material:</span> <strong>{materialTier}</strong></div>
                                            <div className="flex justify-between"><span>Deslocamento:</span> <strong>R$ {travelFee.toFixed(2)}</strong></div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <h3 className="font-bold text-zinc-800">Finalizar Solicitação</h3>
                                            <input 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-orange-500 outline-none" 
                                                placeholder="Seu Nome"
                                            />
                                            <input 
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                                className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-orange-500 outline-none" 
                                                placeholder="Seu WhatsApp"
                                            />
                                            <textarea 
                                                value={desc}
                                                onChange={(e) => setDesc(e.target.value)}
                                                className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:border-orange-500 outline-none min-h-[80px]" 
                                                placeholder="Observações adicionais (opcional)..."
                                            />
                                            
                                            <button 
                                                onClick={handleSubmit}
                                                disabled={!name || !contact}
                                                className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-300 disabled:text-zinc-500 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                                            >
                                                <Send className="w-5 h-5" /> Enviar Pedido
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'pay' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {paymentSuccess && (
                             <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3 mb-4 shadow-sm">
                                <CheckCircle2 className="w-6 h-6" />
                                <span className="font-bold">Pagamento Confirmado! Obrigado.</span>
                             </div>
                        )}

                        <h2 className="text-xl font-bold text-zinc-800 ml-2">Pagamentos Pendentes</h2>
                        
                        {pendingPayments.filter(p => p.status === 'pending').length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                                <p className="text-zinc-400">Você não possui pagamentos pendentes.</p>
                            </div>
                        ) : (
                            pendingPayments.filter(p => p.status === 'pending').map(pay => (
                                <div key={pay.id} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-zinc-900">{pay.description}</h3>
                                            <p className="text-xs text-zinc-500">{new Date(pay.dateCreated).toLocaleDateString()}</p>
                                        </div>
                                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">Pendente</span>
                                    </div>
                                    
                                    <div className="text-3xl font-black text-zinc-900 mb-6">
                                        R$ {pay.amount.toFixed(2)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handlePay(pay.id)}
                                            className="py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <QrCode className="w-4 h-4" /> Pix
                                        </button>
                                        <button 
                                            onClick={() => handlePay(pay.id)}
                                            className="py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <CreditCard className="w-4 h-4" /> Cartão
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientPortal;
