
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, FileText, X, Check } from 'lucide-react';
import Logo from './Logo';

interface LoginProps {
  onLogin: (email: string) => void;
}

// Substitua esta URL pela URL real do seu Google Forms
const REGISTER_FORM_URL = 'https://forms.gle/SEU_LINK_AQUI';

const TERMS_OF_USE = `
1. ACEITAÇÃO DOS TERMOS
Ao utilizar o "Aplica PRO", você concorda integralmente com estes termos. Se não concordar, não utilize a ferramenta.

2. FINALIDADE DA FERRAMENTA
Este aplicativo é uma ferramenta auxiliar destinada a ESTIMAR custos, materiais e orçamentos para profissionais de envelopamento e comunicação visual.

3. ISENÇÃO DE RESPONSABILIDADE (IMPORTANTE)
O "Aplica PRO" fornece sugestões baseadas em médias de mercado e fórmulas matemáticas padrão.
- NÃO nos responsabilizamos por falta ou sobra de materiais. O aplicador deve sempre conferir as medidas reais do veículo/superfície antes da compra.
- NÃO nos responsabilizamos por prejuízos financeiros decorrentes de orçamentos gerados na plataforma. Os preços de venda são sugestões e devem ser revisados pelo usuário.
- Variações na largura da bobina, técnica de aplicação, quebra de memória e erros de corte são de responsabilidade exclusiva do profissional.

4. DADOS E PRIVACIDADE
Os dados financeiros inseridos (custos fixos, pro labore) ficam salvos apenas no navegador do seu dispositivo (ou na sessão atual) para fins de cálculo.

5. PROPRIEDADE INTELECTUAL
Todo o design, código e lógica do "Aplica PRO" são propriedade exclusiva de seus desenvolvedores. É proibida a cópia, engenharia reversa ou comercialização não autorizada do software.
`;

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Terms Modal State
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic empty check
    if (!email || !password) {
        setError('Por favor, preencha todos os campos para continuar.');
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Por favor, insira um formato de e-mail válido.');
        return;
    }

    setIsLoading(true);

    // Simulating an API call
    setTimeout(() => {
      setIsLoading(false);
      // Pass email up
      onLogin(email);
    }, 1500);
  };

  const handleOpenTerms = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowTerms(true);
  };

  const handleAcceptAndRegister = () => {
      setShowTerms(false);
      window.open(REGISTER_FORM_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-zinc-800 p-4 rounded-3xl shadow-lg shadow-orange-900/20 mb-4 border border-zinc-700">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Aplica PRO</h1>
          <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest mt-1">Gestão para Envelopamento</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase ml-1">E-mail Profissional</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-700"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
               <label className="text-xs font-bold text-zinc-400 uppercase">Senha</label>
               <a href="#" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">Esqueceu?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Acessando...
              </>
            ) : (
              <>
                Entrar na Plataforma <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
           <p className="text-zinc-500 text-sm">
             Ainda não tem acesso?{' '}
             <button onClick={handleOpenTerms} className="text-white font-bold hover:text-orange-500 transition-colors underline decoration-zinc-700 hover:decoration-orange-500 underline-offset-4">
               Criar conta parceiro
             </button>
           </p>
           
           <p className="text-[10px] text-zinc-600">
             Ao entrar, você concorda com os <button onClick={() => setShowTerms(true)} className="hover:text-orange-500 underline">Termos de Uso</button>.
           </p>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-center gap-4 opacity-50">
           <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
           <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
           <div className="h-2 w-2 rounded-full bg-zinc-700"></div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]">
                  {/* Header */}
                  <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-orange-500" /> Termos de Uso
                      </h3>
                      <button onClick={() => setShowTerms(false)} className="text-zinc-500 hover:text-white transition-colors">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                      <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                          <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                              {TERMS_OF_USE}
                          </p>
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 rounded-b-2xl flex flex-col gap-3">
                      <button 
                        onClick={handleAcceptAndRegister}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                      >
                          <Check className="w-5 h-5" /> Li, Aceito e Quero me Cadastrar
                      </button>
                      
                      <button 
                          onClick={() => setShowTerms(false)}
                          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl transition-colors text-sm"
                      >
                          Apenas Ler / Fechar
                      </button>

                      <p className="text-center text-[10px] text-zinc-500 mt-1">
                          Ao clicar em "Cadastrar", você será redirecionado para o formulário.
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Login;
