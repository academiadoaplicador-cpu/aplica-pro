
import React, { useState } from 'react';
import { Shield, Users, DollarSign, Package, Save, Search, TrendingUp, AlertCircle, ChevronRight, ChevronDown, Award, CheckCircle, XCircle, MapPin, Plus, Sparkles, Lock, Unlock } from 'lucide-react';
import { VinylCatalogData, UserProfile, MapRequest, CertificateStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface AdminDashboardProps {
    vinylData: VinylCatalogData;
    onUpdateVinylData: (data: VinylCatalogData) => void;
    allUsers?: UserProfile[];
    onUpdateUser?: (user: UserProfile) => void;
    mapRequests?: MapRequest[];
    onUpdateMapRequest?: (id: string, status: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    vinylData, 
    onUpdateVinylData, 
    allUsers = [], 
    onUpdateUser, 
    mapRequests = [], 
    onUpdateMapRequest 
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'users' | 'certificates' | 'map' | 'ai'>('overview');
    
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
    const [showAddMaterial, setShowAddMaterial] = useState(false);
    const [materialSearch, setMaterialSearch] = useState('');
    
    const [userSearch, setUserSearch] = useState('');
    
    const [newMatCat, setNewMatCat] = useState('');
    const [newMatBrand, setNewMatBrand] = useState('');
    const [newMatLine, setNewMatLine] = useState('');
    const [newMatPrice, setNewMatPrice] = useState('');

    // MOCK DATA FOR CHARTS
    const revenueData = [
        { name: 'Jun', value: 4500 },
        { name: 'Jul', value: 6200 },
        { name: 'Ago', value: 8100 },
        { name: 'Set', value: 9800 },
        { name: 'Out', value: 11200 },
        { name: 'Nov', value: 12450 },
    ];

    const userGrowthData = [
        { name: 'Jun', users: 50 },
        { name: 'Jul', users: 85 },
        { name: 'Ago', users: 120 },
        { name: 'Set', users: 160 },
        { name: 'Out', users: 210 },
        { name: 'Nov', users: 248 },
    ];

    const aiUsageData = [
        { day: 'Seg', tokens: 15000 },
        { day: 'Ter', tokens: 22000 },
        { day: 'Qua', tokens: 18000 },
        { day: 'Qui', tokens: 25000 },
        { day: 'Sex', tokens: 30000 },
        { day: 'Sáb', tokens: 12000 },
        { day: 'Dom', tokens: 8000 },
    ];

    const handlePriceChange = (cat: string, brand: string, line: string, newPrice: string) => {
        const price = parseFloat(newPrice);
        if (isNaN(price) || price < 0) return;
        const newData = JSON.parse(JSON.stringify(vinylData));
        if (newData[cat] && newData[cat][brand] && newData[cat][brand][line]) {
            newData[cat][brand][line].price = price;
        }
        onUpdateVinylData(newData);
    };

    const handleRecommendationToggle = (cat: string, brand: string, line: string, type: string) => {
        const newData = JSON.parse(JSON.stringify(vinylData));
        if (newData[cat] && newData[cat][brand] && newData[cat][brand][line]) {
            const currentRecs = newData[cat][brand][line].recommendedFor || [];
            if (currentRecs.includes(type)) {
                newData[cat][brand][line].recommendedFor = currentRecs.filter((r: string) => r !== type);
            } else {
                newData[cat][brand][line].recommendedFor = [...currentRecs, type];
            }
        }
        onUpdateVinylData(newData);
    };

    const handleAddMaterial = () => {
        if (!newMatCat || !newMatBrand || !newMatLine || !newMatPrice) return;
        const newData = JSON.parse(JSON.stringify(vinylData));
        
        if (!newData[newMatCat]) newData[newMatCat] = {};
        if (!newData[newMatCat][newMatBrand]) newData[newMatCat][newMatBrand] = {};
        
        newData[newMatCat][newMatBrand][newMatLine] = {
            price: parseFloat(newMatPrice),
            widths: [1.52],
            colors: ["Padrão"],
            recommendedFor: ['vehicle', 'fridge', 'flat']
        };
        
        onUpdateVinylData(newData);
        setShowAddMaterial(false);
        setNewMatLine('');
    };

    const handleCertAction = (userId: string, certId: string, action: CertificateStatus) => {
        if (!onUpdateUser) return;
        const user = allUsers.find(u => u.id === userId);
        if (user) {
            const updatedUser = { ...user, certificates: user.certificates.map(c => c.id === certId ? { ...c, status: action } : c) };
            onUpdateUser(updatedUser);
        }
    };

    const handleToggleUserStatus = (userId: string) => {
        if (!onUpdateUser) return;
        const user = allUsers.find(u => u.id === userId);
        if (user) {
            const newStatus = user.subscriptionStatus === 'active' ? 'expired' : 'active';
            onUpdateUser({ ...user, subscriptionStatus: newStatus });
        }
    };

    const pendingCertificates = allUsers.flatMap(user => 
        user.certificates.filter(c => c.status === 'Pendente').map(c => ({ ...c, userId: user.id, userName: user.name }))
    );

    const filteredUsers = allUsers.filter(u => 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-wrap gap-2 bg-zinc-900 rounded-xl p-1 border border-zinc-800 w-fit">
                <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                    <TrendingUp className="w-4 h-4" /> Visão Geral
                </button>
                <button onClick={() => setActiveTab('materials')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'materials' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                    <Package className="w-4 h-4" /> Materiais
                </button>
                <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                    <Users className="w-4 h-4" /> Usuários
                </button>
                <button onClick={() => setActiveTab('certificates')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'certificates' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                    <Award className="w-4 h-4" /> Certificados {pendingCertificates.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 rounded-full">{pendingCertificates.length}</span>}
                </button>
                <button onClick={() => setActiveTab('map')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'map' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                    <MapPin className="w-4 h-4" /> Mapa
                </button>
                 <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                    <Sparkles className="w-4 h-4" /> IA & Custos
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div><p className="text-zinc-400 text-xs font-bold uppercase">MRR (Recorrente)</p><h3 className="text-3xl font-bold text-white mt-1">R$ 12.450,00</h3></div>
                                <div className="bg-emerald-500/20 p-2 rounded-lg"><DollarSign className="w-6 h-6 text-emerald-500" /></div>
                            </div>
                            <p className="text-xs text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +15% este mês</p>
                        </div>
                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div><p className="text-zinc-400 text-xs font-bold uppercase">Usuários Ativos</p><h3 className="text-3xl font-bold text-white mt-1">{allUsers.length}</h3></div>
                                <div className="bg-blue-500/20 p-2 rounded-lg"><Users className="w-6 h-6 text-blue-500" /></div>
                            </div>
                            <p className="text-xs text-zinc-500">Total na base</p>
                        </div>
                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div><p className="text-zinc-400 text-xs font-bold uppercase">Certificados Pendentes</p><h3 className="text-3xl font-bold text-white mt-1">{pendingCertificates.length}</h3></div>
                                <div className="bg-orange-500/20 p-2 rounded-lg"><Award className="w-6 h-6 text-orange-500" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                            <h3 className="text-white font-bold text-lg mb-6">Crescimento de Receita</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} formatter={(value: number) => `R$ ${value}`} />
                                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                            <h3 className="text-white font-bold text-lg mb-6">Novos Assinantes</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={userGrowthData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                                        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'materials' && (
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center bg-zinc-950 gap-4">
                        <div><h3 className="text-white font-bold text-lg">Catálogo de Materiais</h3><p className="text-zinc-400 text-sm">Editor Global de Preços</p></div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar material..." 
                                    value={materialSearch}
                                    onChange={(e) => setMaterialSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
                                />
                            </div>
                            <button onClick={() => setShowAddMaterial(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-500 transition-colors whitespace-nowrap">
                                <Plus className="w-4 h-4" /> Novo
                            </button>
                        </div>
                    </div>
                    <div className="p-4 space-y-2">
                        {Object.keys(vinylData).map((category) => (
                            <div key={category} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
                                <button onClick={() => setExpandedCategory(expandedCategory === category ? null : category)} className="w-full flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                                    <span className="font-bold text-white flex items-center gap-2">{expandedCategory === category ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}{category}</span>
                                    <span className="text-xs bg-zinc-900 px-2 py-1 rounded text-zinc-400">{Object.keys(vinylData[category]).length} Marcas</span>
                                </button>
                                {expandedCategory === category && (
                                    <div className="p-4 space-y-3 bg-zinc-950/50">
                                        {Object.keys(vinylData[category]).map((brand) => (
                                            <div key={brand} className="ml-4 border-l-2 border-zinc-800 pl-4">
                                                <button onClick={() => setExpandedBrand(expandedBrand === brand ? null : brand)} className="w-full flex items-center justify-between py-2 text-zinc-300 hover:text-white text-sm font-medium">
                                                    <span className="flex items-center gap-2">{expandedBrand === brand ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}{brand}</span>
                                                </button>
                                                {expandedBrand === brand && (
                                                    <div className="mt-2 space-y-2 ml-4">
                                                        {Object.keys(vinylData[category][brand])
                                                            .filter(line => line.toLowerCase().includes(materialSearch.toLowerCase()))
                                                            .map((line) => {
                                                            const item = vinylData[category][brand][line];
                                                            const recs = item.recommendedFor || [];
                                                            return (
                                                                <div key={line} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <p className="text-white text-sm font-medium">{line}</p>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-zinc-500">R$/m</span>
                                                                            <input type="number" value={item.price} onChange={(e) => handlePriceChange(category, brand, line, e.target.value)} className="w-20 bg-zinc-950 border border-zinc-700 rounded p-1 text-right text-white text-sm focus:border-orange-500 outline-none" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-800">
                                                                        <span className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Recomendado:</span>
                                                                        <button onClick={() => handleRecommendationToggle(category, brand, line, 'vehicle')} className={`text-[10px] px-2 py-0.5 rounded border ${recs.includes('vehicle') ? 'bg-orange-900/30 border-orange-500 text-orange-400' : 'bg-zinc-950 border-zinc-700 text-zinc-500'}`}>Vehicle</button>
                                                                        <button onClick={() => handleRecommendationToggle(category, brand, line, 'fridge')} className={`text-[10px] px-2 py-0.5 rounded border ${recs.includes('fridge') ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-zinc-950 border-zinc-700 text-zinc-500'}`}>Fridge</button>
                                                                        <button onClick={() => handleRecommendationToggle(category, brand, line, 'flat')} className={`text-[10px] px-2 py-0.5 rounded border ${recs.includes('flat') ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-700 text-zinc-500'}`}>Flat</button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input type="text" placeholder="Buscar usuário por nome ou email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full pl-10 p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-orange-500 outline-none" />
                    </div>
                    {filteredUsers.map(user => (
                        <div key={user.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold border border-zinc-700">{user.name.charAt(0)}</div>
                                <div><h4 className="text-white font-bold flex items-center gap-2">{user.name} {user.role === 'admin' && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 rounded-full border border-red-500/50">Admin</span>}</h4><p className="text-zinc-500 text-xs">{user.email} • {user.city}/{user.state}</p></div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                <div className="text-right mr-4"><p className="text-xs text-zinc-500">Plano</p><p className="text-sm text-white font-bold capitalize">{user.subscriptionPlan || 'Free'}</p></div>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${user.subscriptionStatus === 'active' ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-600 text-zinc-500'}`}>{user.subscriptionStatus.toUpperCase()}</span>
                                <button onClick={() => handleToggleUserStatus(user.id)} className={`p-2 rounded-lg border transition-colors ${user.subscriptionStatus === 'active' ? 'border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-500' : 'border-emerald-500 text-emerald-500 bg-emerald-500/10'}`} title={user.subscriptionStatus === 'active' ? "Suspender Usuário" : "Ativar Usuário"}>{user.subscriptionStatus === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'certificates' && (
                <div className="space-y-4">
                    {pendingCertificates.length === 0 ? (
                        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center text-zinc-500"><CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500/20" /><p>Todos os certificados foram validados!</p></div>
                    ) : (
                        pendingCertificates.map((cert, idx) => (
                            <div key={idx} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div><h4 className="text-white font-bold text-lg">{cert.courseName}</h4><p className="text-zinc-400 text-sm">{cert.institution} • Aluno: <span className="text-white">{cert.userName}</span></p><p className="text-zinc-500 text-xs mt-1 flex items-center gap-1"><Package className="w-3 h-3"/> Arquivo: {cert.fileName}</p></div>
                                <div className="flex gap-3"><button onClick={() => handleCertAction(cert.userId, cert.id, 'Rejeitado')} className="px-4 py-2 bg-zinc-950 border border-red-900 text-red-500 rounded-lg hover:bg-red-900/20 transition-colors">Rejeitar</button><button onClick={() => handleCertAction(cert.userId, cert.id, 'Aprovado')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-bold transition-colors shadow-lg shadow-emerald-900/20">Aprovar</button></div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'map' && (
                <div className="space-y-4">
                    {mapRequests.map(req => (
                        <div key={req.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                            <div><h4 className="text-white font-bold">{req.userName}</h4><p className="text-zinc-400 text-sm"><MapPin className="w-3 h-3 inline mr-1"/>{req.city}</p></div>
                            {req.status === 'pending' ? (<button onClick={() => onUpdateMapRequest && onUpdateMapRequest(req.id, 'approved')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-500 transition-colors">Marcar como Adicionado</button>) : (<span className="text-emerald-500 text-xs flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full font-bold border border-emerald-500/20"><CheckCircle className="w-3 h-3" /> Adicionado</span>)}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'ai' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                         <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" /> Consumo de Tokens (Gemini)</h3>
                         <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={aiUsageData}>
                                    <defs><linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                                    <Area type="monotone" dataKey="tokens" stroke="#8884d8" fillOpacity={1} fill="url(#colorTokens)" />
                                </AreaChart>
                            </ResponsiveContainer>
                         </div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                        <h3 className="text-white font-bold text-lg mb-4">Estimativa de Custo</h3>
                        <div className="flex items-end gap-2 mb-6"><span className="text-4xl font-bold text-white">$14.20</span><span className="text-zinc-500 mb-1">USD / mês corrente</span></div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm border-b border-zinc-800 pb-2"><span className="text-zinc-400">Consultas Técnicas</span><span className="text-white font-bold">1,240 reqs</span></div>
                            <div className="flex justify-between text-sm border-b border-zinc-800 pb-2"><span className="text-zinc-400">Análise de Imagem (Vision)</span><span className="text-white font-bold">320 imgs</span></div>
                            <div className="flex justify-between text-sm pt-2"><span className="text-zinc-400">Custo Médio por Usuário</span><span className="text-emerald-500 font-bold">$0.05</span></div>
                        </div>
                    </div>
                </div>
            )}

            {showAddMaterial && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h3 className="text-white font-bold text-lg mb-4">Adicionar Material</h3>
                        <div className="space-y-3">
                            <input placeholder="Categoria (Ex: Cast)" value={newMatCat} onChange={e => setNewMatCat(e.target.value)} className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:border-orange-500" />
                            <input placeholder="Marca (Ex: 3M)" value={newMatBrand} onChange={e => setNewMatBrand(e.target.value)} className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:border-orange-500" />
                            <input placeholder="Linha (Ex: 2080)" value={newMatLine} onChange={e => setNewMatLine(e.target.value)} className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:border-orange-500" />
                            <input placeholder="Preço (R$/m)" type="number" value={newMatPrice} onChange={e => setNewMatPrice(e.target.value)} className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:border-orange-500" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowAddMaterial(false)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors">Cancelar</button>
                            <button onClick={handleAddMaterial} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
