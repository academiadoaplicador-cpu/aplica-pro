
import React from 'react';
import { Ruler, MessageSquare, Menu, X, Wallet, Briefcase, BarChart3, User, Globe, Home, CalendarClock, Link as LinkIcon, Shield } from 'lucide-react';
import { ViewMode, UserRole } from '../types';
import Logo from './Logo';

interface LayoutProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  children: React.ReactNode;
  userRole?: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ currentMode, onModeChange, children, userRole = 'user' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: ViewMode.HOME, label: 'Início', icon: Home },
    { id: ViewMode.SCHEDULER, label: 'Minha Agenda', icon: CalendarClock },
    { id: ViewMode.CRM, label: 'Gestão de Orçamentos', icon: Briefcase },
    { id: ViewMode.REPORTS, label: 'Relatórios / Demonstrativo', icon: BarChart3 },
    { id: ViewMode.PAYMENT_MANAGER, label: 'Links & Pagamentos', icon: LinkIcon },
    { id: ViewMode.MATERIAL_ESTIMATOR, label: 'Novo Orçamento / Simulador', icon: Ruler },
    { id: ViewMode.MAP, label: 'Mapa da Rede', icon: Globe },
    { id: ViewMode.FINANCIAL_PROFILE, label: 'Meus Custos (Config)', icon: Wallet },
    { id: ViewMode.PROFILE, label: 'Meu Perfil', icon: User },
    { id: ViewMode.AI_ASSISTANT, label: 'Assistente Técnico IA', icon: MessageSquare },
  ];

  const handleNavClick = (mode: ViewMode) => {
    onModeChange(mode);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Mobile Header - Hidden on Print */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 z-50 flex items-center justify-between px-4 shadow-md print:hidden">
        <div className="flex items-center gap-3 text-white">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-lg tracking-tight">Aplica PRO</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-300 p-2">
            {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation - Hidden on Print */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:block flex flex-col print:hidden
      `}>
        <div className="h-16 lg:h-24 flex items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
             <div className="bg-zinc-800 p-2 rounded-xl shadow-lg shadow-orange-900/10 border border-zinc-700/50">
                 <Logo className="w-8 h-8" />
             </div>
             <div>
                 <h1 className="font-bold text-lg leading-tight text-white">Aplica PRO</h1>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 mt-2">Ferramentas do Profissional</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${currentMode === item.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-5 h-5 transition-colors ${currentMode === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-orange-500'}`} />
              {item.label}
            </button>
          ))}

          {userRole === 'admin' && (
              <div className="mt-6 pt-6 border-t border-zinc-800">
                  <p className="px-4 text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">Administração</p>
                  <button
                    onClick={() => handleNavClick(ViewMode.ADMIN_DASHBOARD)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group
                        ${currentMode === ViewMode.ADMIN_DASHBOARD 
                        ? 'bg-zinc-100 text-zinc-900 shadow-lg' 
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }
                    `}
                    >
                    <Shield className={`w-5 h-5 transition-colors ${currentMode === ViewMode.ADMIN_DASHBOARD ? 'text-orange-600' : 'text-zinc-500 group-hover:text-orange-500'}`} />
                    Painel Admin
                  </button>
              </div>
          )}
        </nav>

        <div className="p-4 border-t border-zinc-800">
            <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full ${userRole === 'admin' ? 'bg-red-600' : 'bg-gradient-to-tr from-orange-500 to-yellow-500'}`}></div>
                    <div>
                        <p className="text-sm font-bold text-white">{userRole === 'admin' ? 'Administrador' : 'Aplicador Parceiro'}</p>
                        <p className="text-xs text-zinc-500">{userRole === 'admin' ? 'Acesso Total' : 'Plano Pro'}</p>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full pt-16 lg:pt-0 overflow-hidden relative bg-[#121214] print:bg-white print:h-auto print:overflow-visible">
        {/* Header - Hidden on Print */}
        {currentMode !== ViewMode.CLIENT_PORTAL && (
            <header className="h-20 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800 flex items-center px-8 justify-between shrink-0 hidden lg:flex sticky top-0 z-30 print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {currentMode === ViewMode.ADMIN_DASHBOARD ? 'Painel Administrativo' : navItems.find(i => i.id === currentMode)?.label}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        {currentMode === ViewMode.ADMIN_DASHBOARD ? 'Controle total da plataforma e materiais.' : 'Gerencie seus negócios e otimize seus ganhos.'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition border border-zinc-700">
                        Suporte
                    </button>
                </div>
            </header>
        )}

        <div className={`flex-1 overflow-y-auto p-4 ${currentMode === ViewMode.CLIENT_PORTAL ? 'lg:p-0' : 'lg:p-8'} scroll-smooth print:overflow-visible print:p-0 custom-scrollbar`}>
           <div className={`mx-auto print:max-w-none ${currentMode === ViewMode.CLIENT_PORTAL ? 'max-w-full' : 'max-w-6xl'}`}>
             {children}
           </div>
        </div>
      </main>
      
      {/* Overlay for mobile menu - Hidden on Print */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden print:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
