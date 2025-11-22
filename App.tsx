
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MaterialCalculator from './components/MaterialCalculator';
import AiAssistant from './components/AiAssistant';
import FinancialProfile from './components/FinancialProfile';
import Login from './components/Login';
import CRM from './components/CRM';
import Reports from './components/Reports';
import UserProfileComponent from './components/UserProfile';
import ApplicatorMap from './components/ApplicatorMap';
import Scheduler from './components/Scheduler';
import Home from './components/Home';
import ServiceRequestManager from './components/ServiceRequestManager';
import ClientPortal from './components/ClientPortal';
import SubscriptionPlans from './components/SubscriptionPlans';
import AdminDashboard from './components/AdminDashboard';
import { ViewMode, FinancialData, CRMQuote, UserProfile, ServiceRequest, PaymentLink, UserRole, VinylCatalogData } from './types';

// Initial Vinyl Data (Moved from MaterialCalculator)
const INITIAL_VINYL_CATALOG: VinylCatalogData = {
    "Cast (Premium) / Envelopamento": {
        "3M": {
            "Série 2080 - Padrão (Brilho/Fosco/Satin)": { 
                price: 235.00, 
                widths: [1.52],
                colors: ["Gloss Black (G12)", "Matte Black (M12)", "Satin Black (S12)", "Gloss White (G10)", "Satin White (S10)", "Matte Dark Grey (M261)", "Gloss Boat Blue (G127)", "Hot Rod Red (G13)"] 
            },
            "Série 2080 - High Gloss (Alto Brilho)": { 
                price: 260.00, 
                widths: [1.52],
                colors: ["High Gloss Black (HG12)", "High Gloss White (HG10)", "High Gloss Hot Rod Red (HG13)", "High Gloss Storm Grey (HG31)"] 
            },
            "Série 2080 - Texturizados (Carbono/Metal)": { 
                price: 285.00, 
                widths: [1.52],
                colors: ["Carbon Fiber Black (CFS12)", "Carbon Fiber Anthracite (CFS201)", "Brushed Black Metallic (BR212)", "Brushed Steel (BR201)", "Matrix Black (MX12)"] 
            },
            "Série 2080 - Color Flip (Camaleão)": { 
                price: 380.00, 
                widths: [1.52],
                colors: ["Deep Space (GP278)", "Psychedelic (GP281)", "Volcanic Flare (GP236)", "Satin Flip Ghost Pearl (SP280)"] 
            },
            "IJ180mC (Impressão Cast Premium)": { 
                price: 175.00, 
                widths: [1.37, 1.52],
                colors: ["Branco Brilho (Imprimível)", "Transparente", "Metálico (Imprimível)"] 
            },
            "Envision 480mC (Non-PVC / Ecológico)": { 
                price: 210.00, 
                widths: [1.37, 1.52],
                colors: ["Branco Brilho (Imprimível)"] 
            }
        },
        "Oracal (Orafol)": {
            "970RA Premium Wrapping Cast": { 
                price: 215.00, 
                widths: [1.52],
                colors: ["Gloss Black (070)", "Matte Black (070M)", "White (010)", "Cores Sólidas Diversas", "Metálicos Padrão"] 
            },
            "970RA Shift Effect (Camaleão)": { 
                price: 265.00, 
                widths: [1.52],
                colors: ["Aubergine Bronze", "Avocado", "Amethyst", "Aquamarine", "Cranberry", "Pearl Symphony"] 
            },
            "975 Structure Cast": { 
                price: 240.00, 
                widths: [1.52],
                colors: ["Carbon Fiber Black", "Carbon Fiber Silver", "Carbon Fiber Anthracite", "Honeycomb", "Brushed Aluminium", "Cocoon"] 
            },
            "951 Premium Cast (Plotter)": { 
                price: 145.00, 
                widths: [1.26, 1.00],
                colors: ["Preto", "Branco", "Cores Sólidas (Alta Durabilidade)", "Metálicos"] 
            },
            "751C High Performance Cast": { 
                price: 110.00, 
                widths: [1.26, 1.00, 0.63],
                colors: ["Preto", "Branco", "Vermelho", "Azul", "Amarelo", "Cores Sólidas (Recorte)"] 
            },
            "961 Luggage (Baú Corrugado)": {
                price: 130.00,
                widths: [1.26, 1.52],
                colors: ["Branco (Imprimível)"]
            }
        },
        "Avery Dennison": {
            "Supreme Wrapping Film (SWF) - Padrão": { 
                price: 235.00, 
                widths: [1.52],
                colors: ["Gloss Black", "Matte Black", "Satin Black", "White Pearl", "Gloss Carmine Red", "Gloss Grey", "Cores Sólidas"] 
            },
            "Supreme Wrapping Film (SWF) - Especiais": { 
                price: 290.00, 
                widths: [1.52],
                colors: ["ColorFlow (Camaleão)", "Diamond Series", "Rugged Onyx", "Brushed Metallic", "Carbon Fiber"] 
            },
            "Conform Chrome (Accent)": { 
                price: 580.00, 
                widths: [1.22],
                colors: ["Chrome Silver", "Chrome Gold", "Chrome Blue", "Chrome Red", "Chrome Black"] 
            },
            "MPI 1105 SuperCast (Digital)": { 
                price: 180.00, 
                widths: [1.37, 1.52],
                colors: ["Branco Brilho (Imprimível)"] 
            },
            "900 Super Cast (Recorte)": { 
                price: 140.00, 
                widths: [1.23],
                colors: ["Preto", "Branco", "Cores Sólidas (12 Anos)", "Metálicos"] 
            }
        },
        "Teckwrap": {
            "190 Series - Gloss & High Gloss": { 
                price: 185.00, 
                widths: [1.52],
                colors: ["High Gloss Black", "True Blood", "Racing Red", "Miami Blue", "Yellow Lime", "Nardo Grey", "China Blue"] 
            },
            "190 Series - Matte & Satin": { 
                price: 185.00, 
                widths: [1.52],
                colors: ["Matte Black", "Matte Military Green", "Satin Metallic Dark Grey", "Satin Chrome"] 
            },
            "HM/GAL Series (Heavy Metal/Galactic)": {
                price: 220.00, 
                widths: [1.52],
                colors: ["Galactic Blue", "Heavy Metal Neon", "Silk Bronze", "Millennium Jade"]
            },
            "RD/RB Series (Color Shift/Camaleão)": { 
                price: 260.00, 
                widths: [1.52],
                colors: ["Purple Blue", "Passion Red", "Glitter Black", "Magic Coral", "Rainbow Drift"] 
            },
            "CHM Series (Mirror Chrome)": { 
                price: 380.00, 
                widths: [1.52],
                colors: ["Mirror Chrome Silver", "Mirror Chrome Gold", "Rose Gold", "Blue Chrome", "Red Chrome"] 
            },
            "Neo Chrome (Holográfico)": {
                price: 350.00, 
                widths: [1.52],
                colors: ["Neo Silver", "Neo Black", "Neo Blue"]
            },
            "SL/ECH Series (Aluminum/Velvet)": {
                price: 240.00, 
                widths: [1.52],
                colors: ["Brushed Aluminum Black", "Velvet Red", "Velvet Blue"]
            }
        },
        "Arlon": {
            "Premium Colour Change (PCC)": { 
                price: 200.00, 
                widths: [1.52],
                colors: ["Gloss", "Matte", "Satin", "Aluminum", "Cyber Shield", "Candy Colors"] 
            },
            "SLX+ Cast Wrap": { 
                price: 165.00, 
                widths: [1.37, 1.52],
                colors: ["Branco Brilho (Imprimível)", "Transparente"] 
            }
        },
        "Mactac": {
            "ColourWrap Series": { 
                price: 190.00, 
                widths: [1.52],
                colors: ["Gloss Black", "Matte Black", "Stellar Black", "Metallic Finish", "Gloss White"] 
            }
        },
        "Alltak": {
            "Dynamic (Super Gloss)": { 
                price: 110.00, 
                widths: [1.38],
                colors: ["Dynamic Black", "Dynamic White", "Dynamic Red", "Dynamic Blue", "Dynamic Yellow"] 
            }
        },
        "Aplike": {
            "Cast Film": { 
                price: 120.00, 
                widths: [1.22],
                colors: ["Branco", "Transparente"] 
            }
        }
    },
    "Polimérico (Intermediário)": {
        "Alltak": {
            "Ultra (Alto Brilho)": { 
                price: 68.00, 
                widths: [1.38],
                colors: ["Ultra Black (Preto Brilho)", "Ultra White (Branco Brilho)", "Ultra Blood Red", "Ultra Deep Blue", "Ultra Nardo Grey", "Ultra Graphite Metallic", "Ultra Dark Grey", "Ultra Yellow"] 
            },
            "Satin (Acetinado/Fosco)": { 
                price: 72.00, 
                widths: [1.38],
                colors: ["Satin Black (Preto Acetinado)", "Satin White", "Satin Graphite Metallic", "Satin Military Green", "Satin Pearl White", "Satin Brown Metallic"] 
            },
            "Tuning (Texturas)": { 
                price: 85.00, 
                widths: [1.38],
                colors: ["Carbon 4D Black", "Carbon 5D High Gloss", "Carbon 6D", "Brushed Black (Aço Escovado)", "Brushed Aluminum", "Brushed Titanium"] 
            },
            "Kroko (Textura Animal)": { 
                price: 95.00, 
                widths: [1.38],
                colors: ["Kroko Black", "Kroko Brown"] 
            },
            "Camaleão (Color Shift)": { 
                price: 110.00, 
                widths: [1.38],
                colors: ["Dimension Space", "Dimension Cyber", "Dimension Tropical"] 
            },
            "Jateado (Opaco)": { 
                price: 65.00, 
                widths: [1.22, 1.38],
                colors: ["Jateado Black", "Jateado Silver", "Jateado Military", "Jateado Red"] 
            }
        },
        "Teckwrap": {
            "180 Series (Gloss/Matte)": { 
                price: 120.00, 
                widths: [1.52],
                colors: ["Gloss Black", "Matte Black", "Gloss White", "Satin White", "Carbon Fiber Black"] 
            },
            "RCF Series (Real Carbon Fiber)": { 
                price: 150.00, 
                widths: [1.52],
                colors: ["4D Carbon Black", "5D Carbon Black", "Forged Carbon (Forjado)", "Spiral Carbon"] 
            },
            "V Series (Super Gloss)": {
                price: 140.00, 
                widths: [1.52],
                colors: ["Super Gloss Black", "Crystal White"]
            }
        },
        "3M": {
            "Scotchcal IJ40 (Impressão)": { 
                price: 85.00, 
                widths: [1.37, 1.52],
                colors: ["Branco Brilho", "Branco Fosco", "Transparente"] 
            },
            "Controltac 40C": { 
                price: 95.00, 
                widths: [1.37, 1.52],
                colors: ["Branco (Imprimível)"] 
            }
        },
        "Oracal (Orafol)": {
            "651 Intermediate Cal": { 
                price: 48.00, 
                widths: [1.26, 1.00, 0.63],
                colors: ["Gloss Black (070)", "Matte Black (070M)", "White (010)", "Silver Grey (090)", "Gold (091)", "Cores Sólidas (60 cores)"] 
            },
            "551 High Performance Cal": { 
                price: 68.00, 
                widths: [1.26, 1.00],
                colors: ["Cores Sólidas", "Metálicos", "Branco", "Preto"] 
            },
            "6510 Fluorescent Cast": { 
                price: 120.00, 
                widths: [1.26],
                colors: ["Yellow (029)", "Orange (037)", "Red Orange (038)", "Red (039)", "Pink (046)", "Green (069)"] 
            },
            "351 Polyester (Cromo/Ouro)": { 
                price: 95.00, 
                widths: [1.26],
                colors: ["Chrome (001)", "Matt Chrome (002)", "Gold (003)", "Rose Gold"] 
            },
            "352 Print Polyester": { 
                price: 90.00, 
                widths: [1.26],
                colors: ["Silver", "Gold", "Clear"] 
            }
        },
        "Avery Dennison": {
            "700 Premium Film": { 
                price: 75.00, 
                widths: [1.23],
                colors: ["Preto Brilho", "Preto Fosco", "Branco", "Cores Sólidas (Alta Performance)"] 
            },
            "MPI 2900 / 2000 (Digital)": { 
                price: 65.00, 
                widths: [1.37],
                colors: ["Branco Brilho", "Branco Fosco"] 
            }
        },
        "SID": {
            "Car Wrap (Automotivo)": {
                price: 55.00,
                widths: [1.52],
                colors: ["Gloss Black", "Matte Black", "Gloss White", "Matte White", "Silver", "Red", "Blue", "Cores Sólidas"]
            },
            "Carbon 3D": {
                price: 65.00,
                widths: [1.52],
                colors: ["Black", "Silver", "Gold", "White"]
            }
        },
        "Imprimax": {
            "Gold Max": { 
                price: 42.00, 
                widths: [1.22, 1.40], 
                colors: ["Cores Sólidas", "Metálicos", "Foscos"] 
            },
            "Power Revest": { 
                price: 58.00, 
                widths: [1.38],
                colors: ["Jateados", "Texturizados", "Fibra 4D", "Camaleão"] 
            }
        },
        "Arclad": {
            "Nuance (Deco)": { 
                price: 55.00, 
                widths: [1.22],
                colors: ["Madeiras", "Pedras", "Couros", "Cores Sólidas"] 
            },
            "Performance": { 
                price: 48.00, 
                widths: [1.22],
                colors: ["Branco", "Preto", "Cores Básicas"] 
            }
        },
        "Mactac": {
            "MACal 9800 Pro": { 
                price: 85.00, 
                widths: [1.23],
                colors: ["Cores Sólidas (7-8 anos)", "Metálicos", "High Gloss"] 
            }
        },
        "Ritrama": {
            "Gemstone": { 
                price: 50.00, 
                widths: [1.26],
                colors: ["Pérola", "Metálicos"] 
            },
            "Ri-Mark": { 
                price: 35.00, 
                widths: [1.22],
                colors: ["Gloss", "Matt"] 
            }
        },
        "Arlon": {
            "Series 5000": { 
                price: 60.00, 
                widths: [1.22],
                colors: ["Cores Sólidas"] 
            }
        }
    },
    "Monomérico (Promocional)": {
        "3M": {
            "Scotchcal 50": { 
                price: 45.00, 
                widths: [1.22],
                colors: ["Branco", "Preto", "Cores Vibrantes", "Metálicos"] 
            },
            "IJ15 (Econômico)": { 
                price: 35.00, 
                widths: [1.27, 1.52],
                colors: ["Branco Brilho", "Branco Fosco"] 
            }
        },
        "Oracal (Orafol)": {
            "641 Economy Cal": { 
                price: 32.00, 
                widths: [1.26, 1.00],
                colors: ["Gloss Black", "Matte Black", "White", "Cores Básicas (40+ cores)"] 
            },
            "621 Economy Cal": { 
                price: 32.00, 
                widths: [1.26, 1.00],
                colors: ["Cores Sólidas"] 
            },
            "1640 Print Vinyl": { 
                price: 28.00, 
                widths: [1.26, 1.05],
                colors: ["Branco Brilho", "Branco Fosco", "Transparente"] 
            }
        },
        "Avery Dennison": {
            "500 Event Film": { 
                price: 35.00, 
                widths: [1.23],
                colors: ["Preto Brilho", "Preto Fosco", "Branco", "Cores Promocionais"] 
            },
            "MPI 3000 (Digital)": { 
                price: 28.00, 
                widths: [1.37],
                colors: ["Branco Promocional", "Fosco"] 
            }
        },
        "SID": {
            "Sign Series": { 
                price: 22.00, 
                widths: [1.27],
                colors: ["Branco", "Preto", "Amarelo", "Vermelho", "Azul", "Verde", "Transparente"] 
            }
        },
        "Aplike": {
            "Aplikor": { 
                price: 22.00, 
                widths: [1.22],
                colors: ["Branco", "Preto", "Amarelo", "Vermelho", "Azul", "Verde", "Transparente"] 
            },
            "ApliSign": { 
                price: 25.00, 
                widths: [1.22],
                colors: ["Cores de Recorte", "Foscos"] 
            }
        },
        "Metamark": {
            "M4 Series": { 
                price: 32.00, 
                widths: [1.22],
                colors: ["Gloss White", "Gloss Black", "Cores Básicas"] 
            },
            "M7 Series (Curta Duração)": { 
                price: 28.00, 
                widths: [1.22],
                colors: ["Cores Diversas"] 
            }
        },
        "Nar": {
            "Paper Liner": { 
                price: 18.00, 
                widths: [1.22],
                colors: ["Branco Brilho", "Transparente"] 
            }
        },
        "Imprimax": {
            "Digimax": { 
                price: 24.00, 
                widths: [1.22, 1.52],
                colors: ["Branco Brilho", "Branco Fosco"] 
            }
        }
    },
    "Especiais / Vidros / Refletivos / Arq.": {
        "Alltak": {
            "Decor (Arquitetura)": { 
                price: 65.00, 
                widths: [1.22],
                colors: ["Wood (Madeiras)", "Stone (Pedras)", "Leather (Couros)", "Concrete (Cimento)", "Linho"] 
            },
            "Decor Premium (Texturas)": { 
                price: 75.00, 
                widths: [1.22],
                colors: ["Rovere", "Carvalho", "Nogueira", "Mármore Carrara", "Mármore Black"] 
            },
            "Digital Print (Impressão)": { 
                price: 40.00, 
                widths: [1.22, 1.38],
                colors: ["Branco Brilho", "Branco Fosco", "Transparente"] 
            },
            "Floor (Piso)": { 
                price: 55.00, 
                widths: [1.22],
                colors: ["Laminação de Piso (Antiderrapante)"] 
            }
        },
        "3M": {
            "DI-NOC (Revestimento Arquitetônico)": { 
                price: 420.00, 
                widths: [1.22],
                colors: ["Fine Wood (Madeiras)", "Metallic (Metais)", "Stone (Pedras)", "Abstract", "Leather (Couro)"] 
            },
            "Fasara (Vidros Decorativos)": { 
                price: 350.00, 
                widths: [1.27],
                colors: ["Gradation", "Fabric", "Frost/Matte", "Geometric"] 
            },
            "Scotchcal 680CR (Refletivo)": { 
                price: 190.00, 
                widths: [1.22],
                colors: ["Preto Refletivo (Brilha Branco)", "Branco", "Vermelho", "Azul", "Amarelo"] 
            },
            "Diamond Grade (Sinalização)": { 
                price: 450.00, 
                widths: [1.22],
                colors: ["Amarelo/Preto (Zebrado)", "Vermelho/Branco"] 
            }
        },
        "Oracal (Orafol)": {
            "8300 Transparent Cal": {
                price: 55.00,
                widths: [1.26],
                colors: ["Cores Transparentes (Vitral)", "Dark Grey (Fumê)"]
            },
            "8500 Translucent Cal": {
                price: 75.00,
                widths: [1.26],
                colors: ["Branco Difusor", "Cores para Backlight"]
            },
            "8510 Etched Glass (Jateado)": {
                price: 78.00,
                widths: [1.26],
                colors: ["Silver (Prata)", "Gold (Ouro)", "Coarse (Grosso)", "Fine (Fino)"]
            },
            "8810 Frosted Glass": {
                price: 85.00,
                widths: [1.26],
                colors: ["Frost Effect (Glitter)"]
            },
            "Oralite 5200 (Refletivo)": {
                price: 120.00,
                widths: [1.22],
                colors: ["Branco", "Amarelo", "Vermelho", "Azul", "Verde", "Laranja"]
            }
        },
        "SID": {
            "One Way Vision (Perfurado)": {
                price: 42.00,
                widths: [1.37],
                colors: ["Branco/Preto"]
            },
            "Jateado (Etched)": {
                price: 38.00,
                widths: [1.22],
                colors: ["Jateado Padrão"]
            },
            "Floor Graphics (Laminação Piso)": {
                price: 45.00,
                widths: [1.27],
                colors: ["Transparente Texturizado"]
            }
        }
    },
    "PPF (Proteção de Pintura)": {
        "Alltak": {
            "Paint Protection (PVC/Hybrid)": { 
                price: 150.00, 
                widths: [1.37],
                colors: ["Transparente Brilho", "Transparente Fosco"] 
            }
        },
        "Teckwrap": {
            "PPF-X Series (TPU Premium)": { 
                price: 550.00, 
                widths: [1.52],
                colors: ["Gloss (Transparente)", "Matte (Fosco)"] 
            },
            "PPF-H Series (TPU Standard)": { 
                price: 420.00, 
                widths: [1.52],
                colors: ["Gloss (Transparente)"] 
            },
            "PPF Color (Black/Effect)": { 
                price: 580.00, 
                widths: [1.52],
                colors: ["Gloss Black", "Matte Black", "Prismatic"] 
            }
        },
        "3M": {
            "Scotchgard Pro Series": { 
                price: 620.00, 
                widths: [1.52, 0.61],
                colors: ["Gloss (Transparente)", "Matte (Fosco)"] 
            },
             "VentureShield (Standard)": { 
                price: 480.00, 
                widths: [1.52, 0.61],
                colors: ["Gloss (Transparente)"] 
            }
        },
        "Avery Dennison": {
            "SPF-Xi (Supreme Protection Film)": { 
                price: 680.00, 
                widths: [1.52],
                colors: ["Gloss (Transparente)", "Matte (Fosco)", "Neo Black (Preto)"] 
            }
        },
        "Oracal (Orafol)": {
            "Oraguard 270 (PVC Stone Guard)": {
                price: 180.00,
                widths: [1.26, 1.40],
                colors: ["Gloss (Transparente)"]
            },
            "Oraguard 2815 (PU Premium)": {
                price: 450.00,
                widths: [1.52],
                colors: ["Gloss (Transparente)"]
            }
        },
        "Xpel": {
            "Ultimate Plus": { 
                price: 650.00, 
                widths: [1.52, 0.76],
                colors: ["Gloss (Transparente)", "Black (Preto Alto Brilho)"] 
            },
            "Stealth": { 
                price: 680.00, 
                widths: [1.52],
                colors: ["Satin (Fosco Transparente)"] 
            },
            "Tracwrap": { 
                price: 150.00, 
                widths: [0.30, 0.60],
                colors: ["Proteção Temporária"] 
            }
        },
        "Stek": {
            "DynoShield": { 
                price: 580.00, 
                widths: [1.52],
                colors: ["Gloss"] 
            },
            "DynoMatte": { 
                price: 600.00, 
                widths: [1.52],
                colors: ["Satin"] 
            },
            "DynoCarbon": { 
                price: 650.00, 
                widths: [1.52],
                colors: ["Fibra de Carbono Realista"] 
            },
            "DynoBlack": { 
                price: 590.00, 
                widths: [1.52],
                colors: ["PPF Preto"] 
            }
        },
        "SH": {
            "SH Pro": { 
                price: 450.00, 
                widths: [1.52],
                colors: ["TPU Gloss", "TPU Matte", "TPU Black"] 
            }
        }
    },
    "Calandrado (Geral)": {
        "Genérico / Importado": {
             "Econômico": { 
                 price: 25.00, 
                 widths: [1.22, 1.06],
                 colors: ["Branco", "Preto", "Automotivo"] 
             }
        }
    }
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentMode, setCurrentMode] = useState<ViewMode>(ViewMode.HOME);
  const [userRole, setUserRole] = useState<UserRole>('user');

  // Global Vinyl Data (Lifted State)
  const [vinylData, setVinylData] = useState<VinylCatalogData>(INITIAL_VINYL_CATALOG);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_123',
    name: 'João Aplicador',
    email: 'joao@aplicador.com.br',
    role: 'user',
    phone: '(11) 99999-9999',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01001-000',
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    experienceYears: 5,
    rating: 4.8, 
    skills: {
        ppf: true,
        decorative: false,
        fleet: true,
        visual: true,
        colorChange: true
    },
    certificates: [],
    reviews: [],
    subscriptionStatus: 'none' 
  });

  // CRM State
  const [quotes, setQuotes] = useState<CRMQuote[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [editingQuote, setEditingQuote] = useState<CRMQuote | null>(null);

  // Financial Data
  const [financialData, setFinancialData] = useState<FinancialData>({
    monthlyFixedCosts: {
        rent: 1200, utilities: 300, software: 100, marketing: 200, mei_taxes: 70, misc: 200
    },
    proLabore: 3000,
    workingDaysPerMonth: 22,
    workingHoursPerDay: 8,
    totalMonthlyCost: 5070,
    dailyCost: 230.45,
    hourlyCost: 28.80
  });

  // Effects
  useEffect(() => {
      const totalFixed = Object.values(financialData.monthlyFixedCosts).reduce((a: number, b: number) => a + b, 0);
      const total = totalFixed + financialData.proLabore;
      const days = financialData.workingDaysPerMonth > 0 ? financialData.workingDaysPerMonth : 1;
      const daily = total / days;
      const hours = financialData.workingHoursPerDay > 0 ? financialData.workingHoursPerDay : 8;
      const hourly = daily / hours;
      
      if (total !== financialData.totalMonthlyCost || daily !== financialData.dailyCost || hourly !== financialData.hourlyCost) {
        setFinancialData(prev => ({ ...prev, totalMonthlyCost: total, dailyCost: daily, hourlyCost: hourly }));
      }
  }, [financialData.monthlyFixedCosts, financialData.proLabore, financialData.workingDaysPerMonth, financialData.workingHoursPerDay]);

  // Authentication
  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    
    // Simple Admin Logic based on email
    if (email === 'admin@aplicapro.com') {
        setUserRole('admin');
        setCurrentMode(ViewMode.ADMIN_DASHBOARD);
        // Admins bypass subscription check
        setUserProfile(prev => ({ ...prev, role: 'admin', email, subscriptionStatus: 'active' }));
    } else {
        setUserRole('user');
        setUserProfile(prev => ({ ...prev, email }));
    }
  };

  const handleStartTrial = (plan: 'monthly' | 'annual') => {
      setUserProfile(prev => ({
          ...prev,
          subscriptionStatus: 'trial',
          subscriptionPlan: plan,
          trialEndsAt: new Date(new Date().setDate(new Date().getDate() + 7))
      }));
      setCurrentMode(ViewMode.HOME);
  };

  // --- CRM & Feature Handlers ---
  const handleCreateNewQuote = () => { setEditingQuote(null); setCurrentMode(ViewMode.MATERIAL_ESTIMATOR); };
  const handleEditQuote = (quote: CRMQuote) => { setEditingQuote(quote); setCurrentMode(ViewMode.MATERIAL_ESTIMATOR); };
  const handleSaveQuote = (quoteData: CRMQuote) => {
      setQuotes(prev => editingQuote ? prev.map(q => q.id === quoteData.id ? quoteData : q) : [quoteData, ...prev]);
      setEditingQuote(null);
      setCurrentMode(ViewMode.CRM); 
  };
  const handleUpdateStage = (id: string, newStage: any) => {
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, currentStage: newStage, lastUpdated: new Date() } : q));
  };
  const handleCancelEdit = () => { setEditingQuote(null); setCurrentMode(ViewMode.CRM); };
  const handleFinancialUpdate = (newData: FinancialData) => { setFinancialData(newData); };
  const handleUpdateProfile = (updatedProfile: UserProfile) => { setUserProfile(updatedProfile); };
  const handleNewServiceRequest = (req: ServiceRequest) => { setServiceRequests(prev => [req, ...prev]); };
  const handlePaymentUpdate = (id: string) => { setPaymentLinks(prev => prev.map(p => p.id === id ? { ...p, status: 'paid' } : p)); };
  const handleCreatePaymentLink = (link: PaymentLink) => { setPaymentLinks(prev => [link, ...prev]); };

  // --- RENDER ---
  const renderContent = () => {
    // Subscription Paywall Gate
    if (isAuthenticated && userRole !== 'admin' && userProfile.subscriptionStatus === 'none') {
        return <SubscriptionPlans onSelectPlan={handleStartTrial} />;
    }

    switch (currentMode) {
      case ViewMode.HOME:
        return <Home userProfile={userProfile} quotes={quotes} onNavigate={setCurrentMode} />;
      case ViewMode.SCHEDULER:
        return <Scheduler />;
      case ViewMode.CRM:
        return <CRM financialData={financialData} quotes={quotes} onNewQuote={handleCreateNewQuote} onEditQuote={handleEditQuote} onUpdateStage={handleUpdateStage} />;
      case ViewMode.REPORTS:
        return <Reports quotes={quotes} />;
      case ViewMode.PAYMENT_MANAGER:
        return <ServiceRequestManager requests={serviceRequests} payments={paymentLinks} onSimulateClientView={() => setCurrentMode(ViewMode.CLIENT_PORTAL)} onCreatePayment={handleCreatePaymentLink} />;
      case ViewMode.CLIENT_PORTAL:
        return <ClientPortal onBack={() => setCurrentMode(ViewMode.PAYMENT_MANAGER)} onSubmitRequest={handleNewServiceRequest} pendingPayments={paymentLinks} onPay={handlePaymentUpdate} />;
      case ViewMode.MATERIAL_ESTIMATOR: 
        return <MaterialCalculator financialData={financialData} initialData={editingQuote || undefined} onSave={handleSaveQuote} onCancel={handleCancelEdit} vinylCatalog={vinylData} />;
      case ViewMode.MAP:
        return <ApplicatorMap />;
      case ViewMode.FINANCIAL_PROFILE:
        return <FinancialProfile data={financialData} onUpdate={handleFinancialUpdate} />;
      case ViewMode.PROFILE:
        return <UserProfileComponent profile={userProfile} onUpdate={handleUpdateProfile} />;
      case ViewMode.AI_ASSISTANT:
        return <AiAssistant />;
      case ViewMode.ADMIN_DASHBOARD:
        return <AdminDashboard vinylData={vinylData} onUpdateVinylData={setVinylData} />;
      default:
        return <Home userProfile={userProfile} quotes={quotes} onNavigate={setCurrentMode} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout currentMode={currentMode} onModeChange={(mode) => {
        if (mode !== ViewMode.MATERIAL_ESTIMATOR) setEditingQuote(null);
        setCurrentMode(mode);
    }} userRole={userRole}>
      {renderContent()}
    </Layout>
  );
};

export default App;
