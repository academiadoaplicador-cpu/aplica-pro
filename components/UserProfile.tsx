
import React, { useState, useRef } from 'react';
import { 
  User, MapPin, Briefcase, Award, Edit3, Save, Camera, 
  CheckCircle, XCircle, Clock, Upload, Trash2, ShieldCheck,
  Star, Truck, Palette, PaintBucket, Eye, Lock, MessageCircle, ThumbsUp
} from 'lucide-react';
import { UserProfile, Certificate, CertificateStatus, Review } from '../types';

interface UserProfileProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const UserProfileComponent: React.FC<UserProfileProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});
  
  // Address Search State
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Certificate Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertInstitution, setNewCertInstitution] = useState('');
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- VALIDAÇÃO ---
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    let isValid = true;

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 letras.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Insira um e-mail válido.";
      isValid = false;
    }

    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!formData.phone || phoneClean.length < 10) {
      newErrors.phone = "Telefone inválido (mínimo 10 dígitos).";
      isValid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = "Obrigatório";
      isValid = false;
    }
    if (!formData.state.trim()) {
      newErrors.state = "Obrigatório";
      isValid = false;
    }

    if (formData.experienceYears < 0 || isNaN(formData.experienceYears)) {
      newErrors.experienceYears = "Inválido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- HANDLERS GERAIS ---
  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSkillToggle = (skill: keyof typeof formData.skills) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: !prev.skills[skill] }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
        onUpdate(formData);
        setIsEditing(false);
        setErrors({});
    }
  };

  // --- BUSCA DE CEP (VIACEP) ---
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    // Mask 00000-000
    if (value.length > 5) {
        value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    
    handleChange('zipCode', value);
  };

  const handleCepBlur = async () => {
    if (!formData.zipCode) return;
    
    const cep = formData.zipCode.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setIsLoadingCep(true);
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            setFormData(prev => ({
                ...prev,
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf
            }));
        }
    } catch (error) {
        console.error("Erro ao buscar CEP", error);
    } finally {
        setIsLoadingCep(false);
    }
  };

  // --- CERTIFICADOS ---
  const handleAddCertificate = () => {
    if (!newCertName || !newCertInstitution) return;
    
    const newCert: Certificate = {
      id: Date.now().toString(),
      courseName: newCertName,
      institution: newCertInstitution,
      date: new Date().toISOString().split('T')[0],
      fileName: "certificado_upload.pdf",
      status: 'Pendente'
    };

    const updatedCertificates = [...formData.certificates, newCert];
    setFormData(prev => ({ ...prev, certificates: updatedCertificates }));
    onUpdate({ ...formData, certificates: updatedCertificates });
    
    setNewCertName('');
    setNewCertInstitution('');
    setShowUploadModal(false);
  };

  const handleDeleteCertificate = (id: string) => {
     const updatedCertificates = formData.certificates.filter(c => c.id !== id);
     setFormData(prev => ({ ...prev, certificates: updatedCertificates }));
     onUpdate({ ...formData, certificates: updatedCertificates });
  };

  const handleSimulateAdminAction = (id: string, status: CertificateStatus) => {
    const updatedCertificates = formData.certificates.map(c => 
        c.id === id ? { ...c, status } : c
    );
    setFormData(prev => ({ ...prev, certificates: updatedCertificates }));
    onUpdate({ ...formData, certificates: updatedCertificates });
  };

  // --- REVIEWS & RATINGS ---
  const handleSubmitReview = () => {
      if (newReviewRating === 0 || !reviewerName.trim()) return;

      const newReview: Review = {
          id: Date.now().toString(),
          clientName: reviewerName,
          rating: newReviewRating,
          comment: newReviewComment,
          date: new Date().toISOString().split('T')[0]
      };

      const updatedReviews = [...(formData.reviews || []), newReview];
      
      // Calculate new average
      const totalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
      const avgRating = totalRating / updatedReviews.length;

      const updatedProfile = {
          ...formData,
          reviews: updatedReviews,
          rating: avgRating
      };

      setFormData(updatedProfile);
      onUpdate(updatedProfile);

      // Reset & Close
      setNewReviewRating(0);
      setNewReviewComment('');
      setReviewerName('');
      setShowReviewModal(false);
  };

  const handleRequestReview = () => {
      alert("Link de avaliação copiado! Envie para seu cliente: aplicador.app/avaliar/" + profile.id);
  };

  // --- HELPERS ---
  const getStatusBadge = (status: CertificateStatus) => {
    switch (status) {
        case 'Aprovado':
            return <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Reconhecido</span>;
        case 'Rejeitado':
            return <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full"><XCircle className="w-3 h-3" /> Rejeitado</span>;
        default:
            return <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full"><Clock className="w-3 h-3" /> Em Análise</span>;
    }
  };

  const getSkillIcon = (key: string, className: string = "w-6 h-6") => {
      switch(key) {
          case 'ppf': return <ShieldCheck className={className} />;
          case 'fleet': return <Truck className={className} />;
          case 'decorative': return <Palette className={className} />;
          case 'visual': return <Eye className={className} />;
          case 'colorChange': return <PaintBucket className={className} />;
          default: return <Award className={className} />;
      }
  };

  const getSkillLabel = (key: string) => {
      switch(key) {
          case 'ppf': return 'PPF Protection';
          case 'fleet': return 'Frota / Caminhão';
          case 'decorative': return 'Decorativo (Arq)';
          case 'visual': return 'Comunicação Visual';
          case 'colorChange': return 'Troca de Cor';
          default: return key;
      }
  };

  const renderStars = (rating: number, size: string = "w-4 h-4") => {
      return (
          <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`${size} ${star <= Math.round(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-600'}`}
                  />
              ))}
              <span className="text-white font-bold text-sm ml-2">{rating.toFixed(1)}</span>
          </div>
      );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Profile Card */}
      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-600 to-orange-900 opacity-20"></div>
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-end">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-zinc-900 shadow-lg overflow-hidden bg-zinc-800 flex items-center justify-center">
               {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <User className="w-16 h-16 text-zinc-500" />
               )}
            </div>
            {isEditing && (
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full shadow-lg hover:bg-orange-500 transition-colors"
               >
                   <Camera className="w-4 h-4" />
               </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </div>

          {/* Info */}
          <div className="flex-1 mb-2 w-full">
             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                 <div>
                    {isEditing ? (
                        <div>
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`text-3xl font-bold text-white bg-zinc-800/50 border rounded-lg px-2 py-1 mb-1 outline-none focus:border-orange-500 w-full max-w-md ${errors.name ? 'border-red-500' : 'border-zinc-700'}`}
                                placeholder="Nome Completo"
                            />
                            {errors.name && <p className="text-red-500 text-xs font-bold mb-2">{errors.name}</p>}
                        </div>
                    ) : (
                        <h1 className="text-3xl font-bold text-white mb-1">{formData.name}</h1>
                    )}
                    
                    <div className="mb-3 flex items-center gap-4">
                        {renderStars(formData.rating)}
                        <div className="h-4 w-px bg-zinc-700 mx-2"></div>
                        <div className="flex items-center gap-2">
                             {Object.entries(formData.skills).filter(([_, active]) => active).map(([key]) => (
                                 <div key={key} className="text-orange-500" title={getSkillLabel(key)}>
                                     {getSkillIcon(key, "w-4 h-4")}
                                 </div>
                             ))}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
                        <div className="flex items-center gap-1">
                             <MapPin className="w-4 h-4 text-orange-500" />
                             <span>{formData.city} - {formData.state}</span>
                        </div>
                        <div className="flex items-center gap-1">
                             <Briefcase className="w-4 h-4 text-emerald-500" />
                             {isEditing ? (
                                <div className="flex items-center gap-1">
                                    <input 
                                        type="number"
                                        min="0"
                                        value={formData.experienceYears} 
                                        onChange={(e) => handleChange('experienceYears', Number(e.target.value))}
                                        className={`bg-zinc-800 border rounded px-1 py-0.5 w-16 ${errors.experienceYears ? 'border-red-500' : 'border-zinc-700'}`}
                                    />
                                    <span>Anos</span>
                                </div>
                             ) : (
                                <span>{formData.experienceYears} Anos de Experiência</span>
                             )}
                        </div>
                    </div>
                 </div>

                 <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                            isEditing 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        }`}
                    >
                        {isEditing ? <><Save className="w-4 h-4"/> Salvar Perfil</> : <><Edit3 className="w-4 h-4"/> Editar Perfil</>}
                    </button>
                    
                    {/* Client View Simulation Button */}
                    {!isEditing && (
                         <button 
                             onClick={() => setShowReviewModal(true)}
                             className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg"
                         >
                             <Star className="w-4 h-4" /> Avaliar Profissional
                         </button>
                    )}
                 </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
              
              {/* Contact Info */}
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" /> Dados de Contato
                  </h3>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-zinc-500 uppercase font-bold">E-mail</label>
                          <input 
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={`w-full bg-zinc-950 border rounded-lg p-3 text-zinc-300 mt-1 disabled:opacity-60 ${errors.email ? 'border-red-500' : 'border-zinc-800'}`}
                          />
                      </div>
                      <div>
                          <label className="text-xs text-zinc-500 uppercase font-bold">Telefone</label>
                          <input 
                            disabled={!isEditing}
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={`w-full bg-zinc-950 border rounded-lg p-3 text-zinc-300 mt-1 disabled:opacity-60 ${errors.phone ? 'border-red-500' : 'border-zinc-800'}`}
                          />
                      </div>
                  </div>
              </div>
              
              {/* Skills Matrix */}
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-500" /> Especialidades
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                      {Object.entries(formData.skills).map(([key, active]) => (
                          <div 
                            key={key}
                            onClick={() => handleSkillToggle(key as keyof typeof formData.skills)}
                            className={`
                                flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center gap-2
                                ${isEditing ? 'cursor-pointer hover:bg-zinc-800' : 'cursor-default'}
                                ${active 
                                    ? 'bg-orange-900/20 border-orange-500/50 text-orange-100' 
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 grayscale opacity-70'
                                }
                            `}
                          >
                             <div className={`p-2 rounded-full ${active ? 'bg-orange-500/20' : 'bg-zinc-800'}`}>
                                {getSkillIcon(key)}
                             </div>
                             <span className="text-xs font-medium leading-tight">
                                 {getSkillLabel(key)}
                             </span>
                             {isEditing && (
                                active ? <CheckCircle className="w-4 h-4 text-orange-500" /> : <div className="w-4 h-4 rounded-full border-2 border-zinc-700" />
                             )}
                          </div>
                      ))}
                  </div>
              </div>

              {/* Private Address (Admin) */}
              <div className="bg-zinc-900 rounded-2xl p-6 border border-orange-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                      <Lock className="w-4 h-4 text-zinc-600" />
                  </div>
                  <h3 className="text-zinc-300 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <MapPin className="w-4 h-4 text-zinc-500" /> Endereço (Privado)
                  </h3>
                  
                  <div className="space-y-3">
                     <div className="flex gap-3">
                        <div className="w-1/3">
                           <label className="text-[10px] text-zinc-500 font-bold">CEP</label>
                           <div className="relative">
                                <input 
                                    disabled={!isEditing}
                                    value={formData.zipCode || ''}
                                    onChange={handleCepChange}
                                    onBlur={handleCepBlur}
                                    placeholder="00000-000"
                                    maxLength={9}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-300 disabled:opacity-50 outline-none focus:border-orange-500"
                                />
                                {isLoadingCep && <div className="absolute right-2 top-2 w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>}
                           </div>
                           {isEditing && <p className="text-[9px] text-zinc-600 mt-1">Busca automática</p>}
                        </div>
                        <div className="w-2/3">
                           <label className="text-[10px] text-zinc-500 font-bold">Rua</label>
                           <input 
                                disabled={!isEditing}
                                value={formData.street || ''}
                                onChange={(e) => handleChange('street', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-300 disabled:opacity-50"
                           />
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <div className="w-1/3">
                           <label className="text-[10px] text-zinc-500 font-bold">Número</label>
                           <input 
                                disabled={!isEditing}
                                value={formData.number || ''}
                                onChange={(e) => handleChange('number', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-300 disabled:opacity-50"
                           />
                        </div>
                        <div className="w-2/3">
                           <label className="text-[10px] text-zinc-500 font-bold">Bairro</label>
                           <input 
                                disabled={!isEditing}
                                value={formData.neighborhood || ''}
                                onChange={(e) => handleChange('neighborhood', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-300 disabled:opacity-50"
                           />
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <div className="w-1/2">
                           <label className="text-[10px] text-zinc-500 font-bold">Cidade</label>
                           <input 
                                disabled={!isEditing}
                                value={formData.city || ''}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-300 disabled:opacity-50"
                           />
                        </div>
                        <div className="w-1/2">
                           <label className="text-[10px] text-zinc-500 font-bold">Estado</label>
                           <input 
                                disabled={!isEditing}
                                value={formData.state || ''}
                                onChange={(e) => handleChange('state', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-300 disabled:opacity-50"
                           />
                        </div>
                     </div>
                  </div>
              </div>

              {/* Request Review Button */}
              <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 rounded-2xl border border-zinc-800 text-center">
                 <p className="text-sm text-zinc-300 mb-4">Precisa de mais avaliações?</p>
                 <button 
                    onClick={handleRequestReview}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                 >
                     <MessageCircle className="w-4 h-4" /> Solicitar Avaliação do Cliente
                 </button>
              </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
              {/* Certificates */}
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Certificações
                        </h3>
                      </div>
                      <button 
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-zinc-700"
                      >
                          <Upload className="w-4 h-4" /> Enviar Novo
                      </button>
                  </div>

                  <div className="space-y-3">
                      {formData.certificates.length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-xl">
                              <p className="text-zinc-500">Nenhum certificado enviado.</p>
                          </div>
                      ) : (
                          formData.certificates.map((cert) => (
                              <div key={cert.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 group">
                                  <div className="flex items-start gap-3">
                                      <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                          <Award className={`w-6 h-6 ${cert.status === 'Aprovado' ? 'text-emerald-500' : 'text-zinc-500'}`} />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-white text-sm">{cert.courseName}</h4>
                                          <p className="text-xs text-zinc-400">{cert.institution} • {cert.date}</p>
                                          <div className="mt-2">{getStatusBadge(cert.status)}</div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      {/* Admin Demo Buttons */}
                                      <div className="hidden group-hover:flex items-center gap-1 mr-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                                          <button onClick={() => handleSimulateAdminAction(cert.id, 'Aprovado')} title="Aprovar" className="p-1 hover:text-emerald-500 text-zinc-600"><CheckCircle className="w-4 h-4"/></button>
                                          <button onClick={() => handleSimulateAdminAction(cert.id, 'Rejeitado')} title="Rejeitar" className="p-1 hover:text-red-500 text-zinc-600"><XCircle className="w-4 h-4"/></button>
                                      </div>
                                      <button onClick={() => handleDeleteCertificate(cert.id)} className="text-zinc-600 hover:text-red-500 transition-colors p-2">
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>

              {/* Client Reviews */}
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5 text-blue-500" /> Avaliações de Clientes
                  </h3>
                  
                  <div className="space-y-4">
                      {(!formData.reviews || formData.reviews.length === 0) ? (
                          <div className="text-center py-8 text-zinc-500 text-sm">
                              Nenhuma avaliação registrada ainda.
                          </div>
                      ) : (
                          formData.reviews.map((review) => (
                              <div key={review.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                                  <div className="flex justify-between items-start mb-2">
                                      <div>
                                          <span className="text-white font-bold text-sm block">{review.clientName}</span>
                                          <span className="text-xs text-zinc-500">{review.date}</span>
                                      </div>
                                      <div className="flex">{renderStars(review.rating, "w-3 h-3")}</div>
                                  </div>
                                  <p className="text-zinc-400 text-sm italic">"{review.comment}"</p>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                  <h3 className="text-white font-bold text-lg mb-4">Enviar Certificado</h3>
                  <div className="space-y-4">
                      <input 
                        value={newCertName}
                        onChange={(e) => setNewCertName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-orange-500"
                        placeholder="Nome do Curso"
                      />
                      <input 
                        value={newCertInstitution}
                        onChange={(e) => setNewCertInstitution(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-orange-500"
                        placeholder="Instituição"
                      />
                      <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500/50">
                          <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                          <p className="text-sm text-zinc-400">Upload Arquivo (PDF/IMG)</p>
                      </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                      <button onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl">Cancelar</button>
                      <button onClick={handleAddCertificate} className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold">Enviar</button>
                  </div>
              </div>
          </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">Avaliar Profissional</h3>
                  <p className="text-zinc-400 text-sm text-center mb-6">Como foi sua experiência com {profile.name}?</p>
                  
                  <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                             <Star className={`w-10 h-10 ${star <= newReviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} />
                          </button>
                      ))}
                  </div>

                  <div className="space-y-4">
                      <input 
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                        placeholder="Seu Nome"
                      />
                      <textarea 
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 min-h-[100px] resize-none"
                        placeholder="Escreva um comentário sobre o serviço..."
                      />
                  </div>

                  <div className="flex gap-3 mt-6">
                      <button onClick={() => setShowReviewModal(false)} className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl">Cancelar</button>
                      <button 
                        onClick={handleSubmitReview}
                        disabled={!newReviewRating || !reviewerName}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl font-bold transition-colors"
                      >
                          Enviar Avaliação
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserProfileComponent;
