
import React, { useState, useEffect, useRef } from 'react';
import { Car, Ruler, Move, CheckCircle2, Scroll, Refrigerator, Plus, Trash2, Printer, FileText, AlignLeft, DollarSign, Clock, Briefcase, Percent, Receipt, Share2, Check, Edit3, CreditCard, Save, ArrowLeft, Calculator, Tag, PenTool, Phone, User, ChevronDown, Palette, Layers, MessageCircle, Paperclip, X, Image as ImageIcon, AlertTriangle, Search } from 'lucide-react';
import { VehiclePreset, BudgetItem, FinancialData, CRMQuote, VinylCatalogData } from '../types';
import QuoteCalculator from './QuoteCalculator';
import Logo from './Logo';

interface MaterialCalculatorProps {
    financialData?: FinancialData;
    initialData?: CRMQuote; // For editing mode
    onSave?: (quote: CRMQuote) => void; // Function to save back to CRM
    onCancel?: () => void; // Function to cancel editing
    vinylCatalog: VinylCatalogData; // Passed from App state
}

const MaterialCalculator: React.FC<MaterialCalculatorProps> = ({ financialData, initialData, onSave, onCancel, vinylCatalog }) => {
  const [activeTab, setActiveTab] = useState<'budget' | 'simulator'>('budget');

  const [mode, setMode] = useState<'vehicle' | 'fridge' | 'flat'>('vehicle');

  // Client Data
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [paymentCondition, setPaymentCondition] = useState('À Vista (Pix/Dinheiro)');
  const [observations, setObservations] = useState('');

  // Budget List
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // File Upload State
  const [selectedItemFile, setSelectedItemFile] = useState<{name: string, data: string, mimeType: string} | null>(null);
  const layoutInputRef = useRef<HTMLInputElement>(null);

  // UI State
  const [isCopied, setIsCopied] = useState(false);

  // Pricing Logic State
  const [workHours, setWorkHours] = useState<number>(2); 
  const [materialCostPerMeter, setMaterialCostPerMeter] = useState<number>(65);
  const [materialTax, setMaterialTax] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(40);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(0);
  
  // --- NEW VINYL SELECTION STATE ---
  const [selType, setSelType] = useState<string>('');
  const [selBrand, setSelBrand] = useState<string>('');
  const [selLine, setSelLine] = useState<string>('');
  const [selColor, setSelColor] = useState<string>('');
  const [customMaterialInput, setCustomMaterialInput] = useState<string>(''); // Fallback
  
  // New: Custom Item Name
  const [customItemName, setCustomItemName] = useState('');

  // Calculated display values
  const [displayMaterialCost, setDisplayMaterialCost] = useState<number>(0);
  const [displayTaxCost, setDisplayTaxCost] = useState<number>(0);
  const [displayPricePerSqm, setDisplayPricePerSqm] = useState<number>(0);

  // Vehicle State
  const [selectedBrand, setSelectedBrand] = useState<string>('Genéricos');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('sedan');
  const [brandFilter, setBrandFilter] = useState<string>(''); // Brand Search Filter
  
  // Fridge State
  const [selectedFridge, setSelectedFridge] = useState<string>('duplex');

  // Shared State
  const [rollWidth, setRollWidth] = useState<number>(1.52);
  
  // Flat State
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  // --- QUICK CALCULATOR STATES ---
  const [vinylInputMode, setVinylInputMode] = useState<'catalog' | 'manual'>('catalog');
  const [isCustomMeters, setIsCustomMeters] = useState(false);
  const [customMeters, setCustomMeters] = useState<number>(0);

  // --- DATABASE DE VEÍCULOS ---
  const genericPresets: VehiclePreset[] = [
    { id: 'hatch_small', name: 'Hatch Pequeno', avgMaterial: 14 },
    { id: 'hatch_med', name: 'Hatch Médio', avgMaterial: 16 },
    { id: 'sedan', name: 'Sedan Médio', avgMaterial: 18 },
    { id: 'sedan_large', name: 'Sedan Grande', avgMaterial: 20 },
    { id: 'suv_small', name: 'SUV Compacto', avgMaterial: 20 },
    { id: 'suv_large', name: 'SUV Grande', avgMaterial: 24 },
    { id: 'pickup_small', name: 'Picape Pequena', avgMaterial: 16 },
    { id: 'pickup', name: 'Picape Média', avgMaterial: 22 },
    { id: 'pickup_large', name: 'Picape Grande', avgMaterial: 26 },
  ];

  const fridgePresets: VehiclePreset[] = [
    { id: 'frigobar', name: 'Frigobar', avgMaterial: 2.5 },
    { id: 'padrao', name: 'Geladeira 1 Porta', avgMaterial: 3.5 },
    { id: 'duplex', name: 'Duplex (2 Portas)', avgMaterial: 4.8 },
    { id: 'inverse', name: 'Inverse (Freezer Embaixo)', avgMaterial: 5.0 },
    { id: 'sidebyside', name: 'Side by Side', avgMaterial: 6.5 },
    { id: 'french', name: 'French Door (3+ Portas)', avgMaterial: 8.0 },
  ];

  const carDatabase: Record<string, VehiclePreset[]> = {
    'Genéricos': genericPresets,
    'Chevrolet': [
        { id: 'gm_celta', name: 'Celta (2p/4p)', avgMaterial: 13 },
        { id: 'gm_corsa', name: 'Corsa Hatch', avgMaterial: 14 },
        { id: 'gm_onix', name: 'Onix / Joy', avgMaterial: 15 },
        { id: 'gm_prisma', name: 'Prisma / Onix Plus', avgMaterial: 17 },
        { id: 'gm_cruze_hatch', name: 'Cruze Hatch', avgMaterial: 17 },
        { id: 'gm_cruze_sedan', name: 'Cruze Sedan', avgMaterial: 19 },
        { id: 'gm_tracker', name: 'Tracker', avgMaterial: 19 },
        { id: 'gm_montana', name: 'Montana (Nova)', avgMaterial: 18 },
        { id: 'gm_s10_cd', name: 'S10 Cab. Dupla', avgMaterial: 23 },
        { id: 'gm_spin', name: 'Spin', avgMaterial: 20 },
    ],
    'Fiat': [
        { id: 'fiat_mobi', name: 'Mobi', avgMaterial: 12 },
        { id: 'fiat_uno', name: 'Uno (Novo)', avgMaterial: 13 },
        { id: 'fiat_argo', name: 'Argo', avgMaterial: 15 },
        { id: 'fiat_cronos', name: 'Cronos', avgMaterial: 17 },
        { id: 'fiat_pulse', name: 'Pulse', avgMaterial: 18 },
        { id: 'fiat_fastback', name: 'Fastback', avgMaterial: 19 },
        { id: 'fiat_strada_cd', name: 'Strada CD (Nova)', avgMaterial: 18 },
        { id: 'fiat_toro', name: 'Toro', avgMaterial: 21 },
        { id: 'fiat_fiorino', name: 'Fiorino', avgMaterial: 16 },
    ],
    'Volkswagen': [
        { id: 'vw_gol', name: 'Gol (G5/G6/G7)', avgMaterial: 14 },
        { id: 'vw_fox', name: 'Fox', avgMaterial: 15 },
        { id: 'vw_polo', name: 'Polo (Novo)', avgMaterial: 16 },
        { id: 'vw_virtus', name: 'Virtus', avgMaterial: 18 },
        { id: 'vw_golf', name: 'Golf', avgMaterial: 17 },
        { id: 'vw_jetta', name: 'Jetta', avgMaterial: 19 },
        { id: 'vw_nivus', name: 'Nivus', avgMaterial: 18 },
        { id: 'vw_tcross', name: 'T-Cross', avgMaterial: 19 },
        { id: 'vw_taos', name: 'Taos', avgMaterial: 21 },
        { id: 'vw_amarok', name: 'Amarok', avgMaterial: 24 },
        { id: 'vw_saveiro_cd', name: 'Saveiro CD', avgMaterial: 16 },
    ],
    'Hyundai': [
        { id: 'hy_hb20', name: 'HB20', avgMaterial: 15 },
        { id: 'hy_hb20s', name: 'HB20S', avgMaterial: 17 },
        { id: 'hy_creta', name: 'Creta (Novo)', avgMaterial: 20 },
        { id: 'hy_tucson', name: 'Tucson', avgMaterial: 21 },
    ],
    'Toyota': [
        { id: 'toy_etios', name: 'Etios Hatch', avgMaterial: 14 },
        { id: 'toy_yaris_hatch', name: 'Yaris Hatch', avgMaterial: 15 },
        { id: 'toy_corolla', name: 'Corolla Sedan', avgMaterial: 19 },
        { id: 'toy_corolla_cross', name: 'Corolla Cross', avgMaterial: 21 },
        { id: 'toy_hilux', name: 'Hilux CD', avgMaterial: 24 },
        { id: 'toy_sw4', name: 'SW4', avgMaterial: 25 },
    ],
    'Honda': [
        { id: 'hon_fit', name: 'Fit', avgMaterial: 16 },
        { id: 'hon_city_hatch', name: 'City Hatch', avgMaterial: 16 },
        { id: 'hon_city_sedan', name: 'City Sedan', avgMaterial: 18 },
        { id: 'hon_civic', name: 'Civic', avgMaterial: 19 },
        { id: 'hon_hrv', name: 'HR-V', avgMaterial: 20 },
    ],
    'Jeep': [
        { id: 'jeep_renegade', name: 'Renegade', avgMaterial: 19 },
        { id: 'jeep_compass', name: 'Compass', avgMaterial: 21 },
        { id: 'jeep_commander', name: 'Commander', avgMaterial: 25 },
    ],
    'Renault': [
        { id: 'ren_kwid', name: 'Kwid', avgMaterial: 12 },
        { id: 'ren_sandero', name: 'Sandero', avgMaterial: 15 },
        { id: 'ren_logan', name: 'Logan', avgMaterial: 17 },
        { id: 'ren_duster', name: 'Duster', avgMaterial: 20 },
        { id: 'ren_oroch', name: 'Oroch', avgMaterial: 21 },
        { id: 'ren_master', name: 'Master (Furgão)', avgMaterial: 28 },
    ]
  };

  const paymentOptions = [
      "À Vista (Pix/Dinheiro)",
      "Entrada 50% + 50% na Entrega",
      "Cartão de Crédito (até 3x sem juros)",
      "Cartão de Crédito (até 12x com juros)",
      "Boleto Bancário (Sob Análise)",
      "A Combinar"
  ];

  // Load Initial Data if Editing
  useEffect(() => {
      if (initialData) {
          setClientName(initialData.clientName || '');
          setClientPhone(initialData.clientPhone || '');
          setBudgetItems(initialData.items || []);
          setPaymentCondition(initialData.paymentCondition || 'À Vista (Pix/Dinheiro)');
          setObservations(initialData.observations || '');
      }
  }, [initialData]);

  // Find vehicle across all brands helper
  const getVehicleData = (id: string) => {
      for (const brand in carDatabase) {
          const found = carDatabase[brand].find(v => v.id === id);
          if (found) return { ...found, brand };
      }
      return null;
  };

  // Update Custom Item Name based on selection
  useEffect(() => {
    let name = '';
    if (mode === 'vehicle') {
        const v = getVehicleData(selectedVehicle);
        if (v) {
            name = v.brand === 'Genéricos' ? v.name : `${v.brand} ${v.name}`;
        } else {
            name = 'Veículo';
        }
    } else if (mode === 'fridge') {
        const f = fridgePresets.find(p => p.id === selectedFridge);
        name = f?.name || 'Geladeira';
    } else {
        name = 'Superfície Plana';
    }
    setCustomItemName(name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedVehicle, selectedBrand, selectedFridge]);

  // Reset Model when Brand changes
  const handleBrandChange = (newBrand: string) => {
      setSelectedBrand(newBrand);
      if (carDatabase[newBrand] && carDatabase[newBrand].length > 0) {
          setSelectedVehicle(carDatabase[newBrand][0].id);
      }
  };
  
  // --- VINYL SELECTION HANDLERS ---
  const handleTypeChange = (val: string) => {
      setSelType(val);
      setSelBrand('');
      setSelLine('');
      setSelColor('');
  };
  const handleVinBrandChange = (val: string) => {
      setSelBrand(val);
      setSelLine('');
      setSelColor('');
  };
  const handleLineChange = (val: string) => {
      setSelLine(val);
      setSelColor('');
      
      if (selType && selBrand && val && vinylCatalog[selType] && vinylCatalog[selType][selBrand] && vinylCatalog[selType][selBrand][val]) {
          const lineData = vinylCatalog[selType][selBrand][val];
          if (lineData.price) {
              setMaterialCostPerMeter(lineData.price);
          }
          // Auto-select Roll Width based on Material
          if (lineData.widths && lineData.widths.length > 0) {
              setRollWidth(lineData.widths[0]);
          }
      }
  };

  const isMaterialRecommended = (surface: string, materialKey: string) => {
      if (surface === 'vehicle') {
          if (materialKey.includes('Monomérico') || materialKey.includes('Calandrado (Geral)')) {
              return { safe: false, reason: 'Materiais Monoméricos tendem a encolher e descolar em curvas de veículos (memória elástica).' };
          }
          if (materialKey.includes('Decor') || materialKey.includes('Arquitetura')) {
              return { safe: false, reason: 'Materiais de Arquitetura são mais rígidos e podem não conformar bem em lataria.' };
          }
      }
      return { safe: true, reason: '' };
  };

  const currentRecommendation = isMaterialRecommended(mode, selType);

  const handleLayoutUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          
          if (file.size > 5 * 1024 * 1024) {
              alert("Arquivo muito grande. Máximo 5MB.");
              return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
              setSelectedItemFile({
                  name: file.name,
                  data: reader.result as string,
                  mimeType: file.type
              });
          };
          reader.readAsDataURL(file);
      }
  };

  const clearLayoutFile = () => {
      setSelectedItemFile(null);
      if (layoutInputRef.current) layoutInputRef.current.value = '';
  };

  // Load shared data from URL
  useEffect(() => {
    if (initialData) return;

    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('q');
    
    if (encodedData) {
      try {
        const jsonString = decodeURIComponent(escape(window.atob(encodedData)));
        const data = JSON.parse(jsonString);
        
        if (data) {
            if (data.c) setClientName(data.c);
            if (data.p) setClientPhone(data.p);
            if (data.o) setObservations(data.o);
            if (data.pay) setPaymentCondition(data.pay);
            if (data.i && Array.isArray(data.i)) setBudgetItems(data.i);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error("Erro ao carregar orçamento compartilhado", error);
      }
    }
  }, [initialData]);

  const calculateFlatResults = () => {
    const area = width * height * quantity;
    const wasteArea = area * 1.15; // 15% waste
    const linearMeters = (rollWidth > 0) ? wasteArea / rollWidth : 0;
    return { area, wasteArea, linearMeters };
  };

  const getCurrentMeters = () => {
      if (isCustomMeters) return customMeters;
      return getCalculatedMeters();
  };

  const getCalculatedMeters = () => {
    let baseLength = 0;
    
    if (mode === 'vehicle') {
        const v = getVehicleData(selectedVehicle);
        baseLength = v?.avgMaterial || 0;
    } else if (mode === 'fridge') {
        baseLength = fridgePresets.find(f => f.id === selectedFridge)?.avgMaterial || 0;
    } else if (mode === 'flat') {
        return calculateFlatResults().linearMeters;
    }
    
    if (rollWidth <= 0) return 0;
    const adjustedLength = baseLength * (1.52 / rollWidth);
    return adjustedLength;
  };

  // Main Calculation Effect
  useEffect(() => {
    const meters = getCurrentMeters();
    
    const baseMaterialCost = meters * materialCostPerMeter;
    const taxCost = baseMaterialCost * (materialTax / 100);
    const totalMaterialCost = baseMaterialCost + taxCost;
    
    const hourlyCost = financialData?.hourlyCost || 0;
    const laborTotalCost = workHours * hourlyCost;
    
    const totalCost = totalMaterialCost + laborTotalCost;
    
    let price = 0;
    if (profitMargin < 100) {
        price = totalCost / (1 - (profitMargin / 100));
    }
    
    setDisplayMaterialCost(baseMaterialCost);
    setDisplayTaxCost(taxCost);
    setSuggestedPrice(price);
    
    setItemPrice(Number(price.toFixed(2)));
  }, [mode, selectedVehicle, selectedFridge, width, height, quantity, rollWidth, workHours, materialCostPerMeter, materialTax, profitMargin, financialData, isCustomMeters, customMeters, vinylInputMode]);

  // New Effect: Reactive Price Per SQM based on ItemPrice (Manual or Calculated)
  useEffect(() => {
      let meters = getCurrentMeters();
      let estimatedArea = 0;

      // Re-logic for area
      if (mode === 'vehicle') {
          const v = getVehicleData(selectedVehicle);
          const baseLength = v?.avgMaterial || 0;
          // For area estimation on vehicle, roughly meters * width, but if custom meters is used, rely on that
          if (!isCustomMeters) {
             meters = rollWidth > 0 ? baseLength * (1.52 / rollWidth) : 0;
          }
      } else if (mode === 'fridge') {
          const baseLength = fridgePresets.find(f => f.id === selectedFridge)?.avgMaterial || 0;
          if (!isCustomMeters) {
             meters = rollWidth > 0 ? baseLength * (1.52 / rollWidth) : 0;
          }
      } else if (mode === 'flat') {
          const area = width * height * quantity;
          const wasteArea = area * 1.15; 
          if (!isCustomMeters) {
             meters = (rollWidth > 0) ? wasteArea / rollWidth : 0;
          }
          estimatedArea = area; // Use true area for flat
      }

      if (mode !== 'flat') {
          estimatedArea = meters * rollWidth;
      }

      const priceSqm = estimatedArea > 0 ? itemPrice / estimatedArea : 0;
      setDisplayPricePerSqm(priceSqm);
  }, [itemPrice, mode, selectedVehicle, selectedBrand, selectedFridge, width, height, quantity, rollWidth, isCustomMeters, customMeters]);


  const handleAddItem = () => {
    const meters = getCurrentMeters();
    let details = `Bobina ${rollWidth}m`;

    if (mode === 'flat') {
        details = `${quantity}x (${width}m x ${height}m) - Bobina ${rollWidth}m`;
    }

    // Construct Material Type String based on Input Mode
    let finalMaterialString = '';
    if (vinylInputMode === 'catalog') {
        if (selType && selBrand && selLine) {
            finalMaterialString = `${selBrand} ${selLine}`;
            if (selColor) finalMaterialString += ` - ${selColor}`;
            finalMaterialString += ` (${selType})`;
        } else {
            finalMaterialString = 'Vinil Selecionado (Catálogo)';
        }
    } else {
        finalMaterialString = customMaterialInput || 'Material Manual';
    }

    // Calculate Raw Cost for Simulation
    const rawCost = displayMaterialCost + displayTaxCost;

    const newItem: BudgetItem = {
        id: Date.now().toString(),
        type: mode,
        name: customItemName || 'Item Personalizado',
        details,
        materialType: finalMaterialString, // Use constructed string
        quantity: mode === 'flat' ? quantity : 1,
        linearMetersTotal: meters,
        rollWidth,
        rawMaterialCost: rawCost, // Store raw cost
        servicePrice: itemPrice > 0 ? itemPrice : undefined,
        estimatedTime: workHours > 0 ? workHours : undefined,
        pricePerSqm: displayPricePerSqm > 0 ? displayPricePerSqm : undefined,
        layoutFile: selectedItemFile || undefined
    };

    setBudgetItems([...budgetItems, newItem]);
    setItemPrice(0);
    setWorkHours(1);
    setSelectedItemFile(null); // Clear file
    if (layoutInputRef.current) layoutInputRef.current.value = '';
    
    if (mode === 'flat') {
         setWidth(0); setHeight(0);
    }
    setIsCustomMeters(false);
    setCustomMeters(0);
  };

  const handleRemoveItem = () => {
    if (itemToDelete) {
        setBudgetItems(budgetItems.filter(i => i.id !== itemToDelete));
        setItemToDelete(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const data = {
        c: clientName,
        p: clientPhone,
        o: observations,
        pay: paymentCondition,
        i: budgetItems.map(item => ({...item, layoutFile: undefined})) // Don't share big files in URL
    };

    try {
        const jsonString = JSON.stringify(data);
        const encodedData = window.btoa(unescape(encodeURIComponent(jsonString)));
        const shareUrl = `${window.location.origin}${window.location.pathname}?q=${encodedData}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    } catch (error) {
        console.error("Erro ao gerar link", error);
        alert("Não foi possível gerar o link.");
    }
  };

  const handleSendWhatsApp = () => {
      if (!clientPhone) {
          alert("Por favor, insira o telefone do cliente para enviar o WhatsApp.");
          return;
      }

      let cleanPhone = clientPhone.replace(/\D/g, '');
      if (cleanPhone.length <= 11) {
          cleanPhone = '55' + cleanPhone;
      }

      let message = `*Olá, ${clientName || 'Cliente'}!*\n\n`;
      message += `Aqui está o seu orçamento prévio:\n\n`;

      budgetItems.forEach((item, index) => {
          message += `*${index + 1}. ${item.name}*\n`;
          message += `   ${item.details}\n`;
          if (item.materialType) {
              message += `   Material: ${item.materialType}\n`;
          }
          if (item.servicePrice) {
              message += `   Valor: R$ ${item.servicePrice.toFixed(2)}\n`;
          }
          message += `\n`;
      });

      const total = budgetItems.reduce((acc, i) => acc + (i.servicePrice || 0), 0);
      message += `*Total Estimado: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}*\n\n`;

      if (paymentCondition) {
          message += `Forma de Pagamento: ${paymentCondition}\n`;
      }

      message += `\nFico à disposição para dúvidas!`;

      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  const handleSaveToCRM = () => {
      if (!clientName) {
          alert("Por favor, informe o nome do cliente.");
          return;
      }

      const totalValue = budgetItems.reduce((acc, item) => acc + (item.servicePrice || 0), 0);
      
      const quoteData: CRMQuote = {
          id: initialData?.id || Date.now().toString(),
          technicianID: 'user_123',
          clientName,
          clientPhone,
          serviceDescription: budgetItems.length > 0 ? budgetItems.map(i => i.name).join(', ') : 'Orçamento Geral',
          quotedValue: totalValue,
          items: budgetItems,
          paymentCondition,
          observations,
          dateCreated: initialData?.dateCreated || new Date(),
          currentStage: initialData?.currentStage || 'Novo',
          lastUpdated: new Date()
      };

      if (onSave) onSave(quoteData);
  };

  const openFileInNewTab = (fileData: {data: string, mimeType: string}) => {
      const win = window.open();
      if (win) {
          // Use window.Image to avoid conflict with imported Image icon
          const image = new window.Image();
          image.src = fileData.data; // base64
          image.style.maxWidth = "100%";
          win.document.write(image.outerHTML);
          win.document.body.style.backgroundColor = "#18181b";
          win.document.body.style.margin = "0";
          win.document.body.style.display = "flex";
          win.document.body.style.justifyContent = "center";
          win.document.body.style.alignItems = "center";
          win.document.body.style.height = "100vh";
      }
  };

  const totalMeters = budgetItems.reduce((acc, item) => acc + item.linearMetersTotal, 0);
  const totalServiceValue = budgetItems.reduce((acc, item) => acc + (item.servicePrice || 0), 0);
  
  const grandTotalRawMaterial = budgetItems.reduce((acc, item) => acc + (item.rawMaterialCost || 0), 0);
  const grandTotalHours = budgetItems.reduce((acc, item) => acc + (item.estimatedTime || 0), 0);

  return (
    <>
    <div className="space-y-8 max-w-5xl mx-auto print:hidden">
       
       <div className="flex justify-between items-center mb-2">
           {onSave ? (
             <button 
               onClick={onCancel} 
               className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
             >
                 <ArrowLeft className="w-5 h-5" /> Voltar para CRM
             </button>
           ) : (
             <div className="text-zinc-500 text-sm font-medium">Ferramenta de Orçamentos</div>
           )}

           {activeTab === 'budget' && onSave && (
             <button 
               onClick={handleSaveToCRM}
               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
             >
                 <Save className="w-5 h-5" /> Salvar no CRM
             </button>
           )}
       </div>

       <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-full md:w-fit mx-auto mb-6">
          <button 
            onClick={() => setActiveTab('budget')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'budget' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Orçamento
          </button>
          <button 
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'simulator' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" /> Simulador de Lucro
          </button>
       </div>

       {activeTab === 'simulator' ? (
         <div className="animate-in fade-in zoom-in duration-300">
             <QuoteCalculator 
                financialData={financialData} 
                importedData={budgetItems.length > 0 ? {
                    totalRawMaterialCost: grandTotalRawMaterial,
                    totalHours: grandTotalHours,
                    currentBudgetTotal: totalServiceValue
                } : undefined}
             />
         </div>
       ) : (
         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* CLIENT INFO SECTION */}
            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4 items-center mb-3">
                     <h3 className="text-white font-bold whitespace-nowrap flex items-center gap-2 shrink-0">
                         <div className="bg-orange-500/20 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-orange-500" />
                         </div>
                         <span className="hidden md:inline">Dados do Orçamento</span>
                         <span className="md:hidden">Dados</span>
                     </h3>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                         <div className="relative group">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <User className="w-4 h-4 text-zinc-500" />
                             </div>
                             <input 
                                 type="text" 
                                 value={clientName}
                                 onChange={(e) => setClientName(e.target.value)}
                                 placeholder="Nome do Cliente"
                                 className="w-full p-2.5 pl-10 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-orange-500 outline-none transition-all"
                             />
                         </div>
                         <div className="relative group">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Phone className="w-4 h-4 text-zinc-500" />
                             </div>
                             <input 
                                 type="text" 
                                 value={clientPhone}
                                 onChange={(e) => setClientPhone(e.target.value)}
                                 placeholder="Telefone / Contato"
                                 className="w-full p-2.5 pl-10 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-orange-500 outline-none transition-all"
                             />
                         </div>
                         <div className="relative group">
                             <div className="relative">
                                 <select
                                     value={paymentCondition}
                                     onChange={(e) => setPaymentCondition(e.target.value)}
                                     className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-orange-500 outline-none appearance-none pl-10 cursor-pointer transition-all"
                                 >
                                     {paymentOptions.map(opt => (
                                         <option key={opt} value={opt}>{opt}</option>
                                     ))}
                                 </select>
                                 <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                             </div>
                         </div>
                     </div>
                </div>

                <div className="border-t border-zinc-800 pt-3">
                    <div className="relative">
                        <AlignLeft className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                        <textarea 
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            placeholder="Observações do Orçamento (Prazos, Garantias, Detalhes Técnicos...)"
                            className="w-full p-2 pl-10 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 outline-none resize-y min-h-[80px] text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Surface Type Selector */}
                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                                {mode === 'vehicle' && <Car className="w-5 h-5 text-orange-500" />}
                                {mode === 'fridge' && <Refrigerator className="w-5 h-5 text-blue-500" />}
                                {mode === 'flat' && <Ruler className="w-5 h-5 text-emerald-500" />}
                                Tipo de Superfície
                            </h3>
                            <div className="relative">
                                <select 
                                    value={mode} 
                                    onChange={(e) => setMode(e.target.value as 'vehicle' | 'fridge' | 'flat')}
                                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-orange-500 appearance-none cursor-pointer"
                                >
                                    <option value="vehicle">Veículo (Envelopamento / Troca de Cor)</option>
                                    <option value="fridge">Geladeira / Eletrodoméstico</option>
                                    <option value="flat">Superfície Plana (Parede, Vidro, Teto)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <ChevronDown className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Model / Dimensions Selection */}
                        {(mode === 'vehicle' || mode === 'fridge') ? (
                            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    {mode === 'vehicle' ? <Car className="w-5 h-5 text-orange-500" /> : <Refrigerator className="w-5 h-5 text-orange-500" />}
                                    Selecione o Modelo
                                </h3>
                                
                                {mode === 'vehicle' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-1">Marca / Categoria</label>
                                            <div className="relative mb-2">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
                                                <input 
                                                    type="text"
                                                    value={brandFilter}
                                                    onChange={(e) => setBrandFilter(e.target.value)}
                                                    placeholder="Buscar marca..."
                                                    className="w-full p-2 pl-8 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:border-orange-500 outline-none"
                                                />
                                            </div>
                                            <div className="relative">
                                                <select
                                                    value={selectedBrand}
                                                    onChange={(e) => handleBrandChange(e.target.value)}
                                                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-orange-500 appearance-none cursor-pointer"
                                                >
                                                    {Object.keys(carDatabase)
                                                        .filter(brand => brand.toLowerCase().includes(brandFilter.toLowerCase()))
                                                        .map(brand => (
                                                            <option key={brand} value={brand}>{brand}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-1">Modelo do Veículo</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedVehicle}
                                                    onChange={(e) => setSelectedVehicle(e.target.value)}
                                                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-orange-500 appearance-none cursor-pointer"
                                                >
                                                    {carDatabase[selectedBrand]?.map(v => (
                                                        <option key={v.id} value={v.id}>{v.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">Modelo da Geladeira</label>
                                        <div className="relative">
                                            <select
                                                value={selectedFridge}
                                                onChange={(e) => setSelectedFridge(e.target.value)}
                                                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-orange-500 appearance-none cursor-pointer"
                                            >
                                                {fridgePresets.map((f) => (
                                                    <option key={f.id} value={f.id}>{f.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                                    <Ruler className="w-5 h-5 text-orange-500" /> Dimensões da Área
                                </h3>
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">Largura (m)</label>
                                        <div className="relative">
                                            <input type="number" value={width} onChange={(e) => setWidth(Math.max(0, Number(e.target.value)))}
                                                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 outline-none text-lg" />
                                            <Move className="absolute right-4 top-4 w-5 h-5 text-zinc-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">Altura (m)</label>
                                        <div className="relative">
                                            <input type="number" value={height} onChange={(e) => setHeight(Math.max(0, Number(e.target.value)))}
                                                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 outline-none text-lg" />
                                            <Move className="absolute right-4 top-4 w-5 h-5 text-zinc-600 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1">Quantidade</label>
                                    <input type="range" min="1" max="50" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                                    <div className="text-right text-orange-500 font-bold mt-1">{quantity} un.</div>
                                </div>
                            </div>
                        )}

                        {/* Item Pricing */}
                        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-500" /> Precificação do Item
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                                        <PenTool className="w-3 h-3" /> Nome da Aplicação
                                    </label>
                                    <input 
                                        type="text" 
                                        value={customItemName}
                                        onChange={(e) => setCustomItemName(e.target.value)}
                                        className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                                        placeholder="Ex: Capô Preto Fosco"
                                    />
                                </div>

                                {/* Vinyl Specification */}
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                                            <Layers className="w-3 h-3" /> Especificação do Material
                                        </label>
                                        
                                        {/* Toggle Catalog vs Manual */}
                                        <div className="flex bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                                            <button 
                                                onClick={() => setVinylInputMode('catalog')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${vinylInputMode === 'catalog' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                                Catálogo
                                            </button>
                                            <button 
                                                onClick={() => setVinylInputMode('manual')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${vinylInputMode === 'manual' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                                Manual
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {vinylInputMode === 'catalog' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <div className="relative">
                                                <select 
                                                    value={selType} 
                                                    onChange={(e) => handleTypeChange(e.target.value)}
                                                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs focus:border-orange-500 outline-none appearance-none"
                                                >
                                                    <option value="">1. Tipo de Material</option>
                                                    {Object.keys(vinylCatalog).map(k => {
                                                        const rec = isMaterialRecommended(mode, k);
                                                        return <option key={k} value={k}>{k} {rec.safe ? '' : '*'}</option>
                                                    })}
                                                    <option value="outro">Outro (Manual)</option>
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                                            </div>

                                            <div className="relative">
                                                <select 
                                                    value={selBrand} 
                                                    onChange={(e) => handleVinBrandChange(e.target.value)}
                                                    disabled={!selType || selType === 'outro'}
                                                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs focus:border-orange-500 outline-none appearance-none disabled:opacity-30"
                                                >
                                                    <option value="">2. Marca</option>
                                                    {selType && vinylCatalog[selType] ? Object.keys(vinylCatalog[selType]).map(k => <option key={k} value={k}>{k}</option>) : null}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                                            </div>

                                            <div className="relative">
                                                <select 
                                                    value={selLine} 
                                                    onChange={(e) => handleLineChange(e.target.value)}
                                                    disabled={!selBrand}
                                                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs focus:border-orange-500 outline-none appearance-none disabled:opacity-30"
                                                >
                                                    <option value="">3. Linha / Modelo</option>
                                                    {selType && selBrand && vinylCatalog[selType][selBrand] ? Object.keys(vinylCatalog[selType][selBrand]).map(k => <option key={k} value={k}>{k}</option>) : null}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                                            </div>

                                            <div className="relative">
                                                <select 
                                                    value={selColor} 
                                                    onChange={(e) => setSelColor(e.target.value)}
                                                    disabled={!selLine}
                                                    className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs focus:border-orange-500 outline-none appearance-none disabled:opacity-30"
                                                >
                                                    <option value="">4. Cor / Acabamento</option>
                                                    {selType && selBrand && selLine && vinylCatalog[selType][selBrand][selLine] 
                                                        ? vinylCatalog[selType][selBrand][selLine].colors
                                                            .map((c: string) => <option key={c} value={c}>{c}</option>) 
                                                        : null
                                                    }
                                                </select>
                                                <Palette className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-3 animate-in fade-in slide-in-from-right-2">
                                            <input 
                                                type="text"
                                                value={customMaterialInput}
                                                onChange={(e) => setCustomMaterialInput(e.target.value)}
                                                placeholder="Digite o nome do material (Ex: Vinil Preto Fosco Genérico)"
                                                className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                    )}

                                    {/* Warning Alert */}
                                    {!currentRecommendation.safe && selType && vinylInputMode === 'catalog' && (
                                        <div className="mb-3 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-400">
                                                <strong>Atenção:</strong> {currentRecommendation.reason}
                                            </p>
                                        </div>
                                    )}

                                    {/* Width Selection */}
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="relative flex items-center gap-2">
                                            <Scroll className="w-4 h-4 text-zinc-500" />
                                            <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">Largura da Bobina:</span>
                                            
                                            {vinylInputMode === 'catalog' && selType !== 'outro' && selLine && vinylCatalog[selType][selBrand][selLine]?.widths ? (
                                                <select
                                                    value={rollWidth}
                                                    onChange={(e) => setRollWidth(parseFloat(e.target.value))}
                                                    className="flex-1 p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs focus:border-orange-500 outline-none"
                                                >
                                                    {vinylCatalog[selType][selBrand][selLine].widths.map((w: number) => (
                                                        <option key={w} value={w}>{w.toFixed(2)}m</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="flex-1 relative">
                                                    <input 
                                                        type="number"
                                                        value={rollWidth}
                                                        onChange={(e) => setRollWidth(parseFloat(e.target.value))}
                                                        className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs focus:border-orange-500 outline-none"
                                                        placeholder="Largura em metros (Ex: 1.52)"
                                                        step="0.01"
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">metros</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                                        <Briefcase className="w-3 h-3" /> Custo Vinil (R$/m)
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={materialCostPerMeter}
                                            onChange={(e) => setMaterialCostPerMeter(Math.max(0, Number(e.target.value)))}
                                            className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                                        />
                                        {vinylInputMode === 'catalog' && selLine && vinylCatalog[selType] && vinylCatalog[selType][selBrand] && vinylCatalog[selType][selBrand][selLine] && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-emerald-500 font-medium">
                                                Sugerido pelo sistema
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                                        <Receipt className="w-3 h-3" /> Imposto Mat. (%)
                                    </label>
                                    <input 
                                        type="number" 
                                        value={materialTax}
                                        onChange={(e) => setMaterialTax(Math.max(0, Number(e.target.value)))}
                                        className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Horas Trabalho
                                    </label>
                                    <input 
                                        type="number" 
                                        value={workHours}
                                        step="0.5"
                                        min="0"
                                        onChange={(e) => setWorkHours(Math.max(0, Number(e.target.value)))}
                                        className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1">
                                        <Percent className="w-3 h-3" /> Margem Lucro
                                    </label>
                                    <input 
                                        type="number" 
                                        value={profitMargin}
                                        onChange={(e) => setProfitMargin(Math.max(0, Number(e.target.value)))}
                                        className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            {financialData && (
                                <div className="mt-2 text-[10px] text-zinc-500">
                                    * Custo Hora Técnico: R$ {financialData.hourlyCost?.toFixed(2)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col space-y-6">
                        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 rounded-3xl border border-zinc-700 text-center relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-yellow-500" />
                            
                            <div className="mb-6">
                                <div className="flex justify-center items-center gap-2 mb-1">
                                    <h4 className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Material Necessário</h4>
                                    <button 
                                        onClick={() => {
                                            if (!isCustomMeters) setCustomMeters(parseFloat(getCalculatedMeters().toFixed(1)));
                                            setIsCustomMeters(!isCustomMeters);
                                        }}
                                        className={`p-1 rounded hover:bg-zinc-700 transition-colors ${isCustomMeters ? 'text-orange-500' : 'text-zinc-600'}`}
                                        title="Editar metragem manualmente"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                    </button>
                                </div>
                                
                                {isCustomMeters ? (
                                    <div className="flex items-center justify-center gap-2 animate-in fade-in zoom-in">
                                        <input 
                                            type="number" 
                                            value={customMeters}
                                            onChange={(e) => setCustomMeters(Math.max(0, parseFloat(e.target.value)))}
                                            className="w-32 bg-zinc-950 border border-orange-500 rounded-lg text-3xl font-black text-white text-center focus:outline-none p-1"
                                            autoFocus
                                        />
                                        <span className="text-lg text-zinc-500 font-medium">m</span>
                                    </div>
                                ) : (
                                    <div className="text-3xl font-black text-white tracking-tight">
                                        {getCalculatedMeters().toFixed(1)} <span className="text-lg text-zinc-500 font-medium">m</span>
                                    </div>
                                )}
                                
                                <div className="text-xs text-zinc-500 mt-1">
                                    {vinylInputMode === 'catalog' && selBrand ? `${selBrand} ${selLine}` : (customMaterialInput || 'Material Manual')} • Custo: R$ {displayMaterialCost.toFixed(2)}
                                </div>
                            </div>

                            <div className="mb-6 pb-6 border-b border-zinc-700">
                                <h4 className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-1">Preço Sugerido (Final)</h4>
                                <div className="text-4xl font-black text-white tracking-tight">
                                    R$ {suggestedPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                {displayPricePerSqm > 0 && (
                                <div className="mt-2 inline-block bg-emerald-900/20 px-3 py-1 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-900/30">
                                    R$ {displayPricePerSqm.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / m²
                                </div>
                                )}
                                <p className="text-[10px] text-zinc-500 mt-2">Lucro + Custo Fixo + Material (c/ impostos)</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-700">
                                    <label className="block text-left text-xs font-medium text-zinc-400 mb-1">Tempo Est. (h)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={workHours}
                                            onChange={(e) => setWorkHours(Math.max(0, Number(e.target.value)))}
                                            step="0.5"
                                            min="0"
                                            className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center font-bold focus:border-emerald-500 outline-none text-lg"
                                        />
                                        <Clock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                                <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-700">
                                    <label className="block text-left text-xs font-medium text-zinc-400 mb-1">Valor Cobrado</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={itemPrice}
                                            onChange={(e) => setItemPrice(Math.max(0, Number(e.target.value)))}
                                            placeholder="R$ 0,00"
                                            className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center font-bold focus:border-emerald-500 outline-none text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-4">
                                <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
                                    <Paperclip className="w-3 h-3" /> Anexar Layout (JPG/PNG/PDF)
                                </label>
                                {selectedItemFile ? (
                                    <div className="flex items-center justify-between bg-zinc-800 p-2 rounded-lg border border-zinc-700">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <ImageIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                            <span className="text-xs text-white truncate max-w-[150px]">{selectedItemFile.name}</span>
                                        </div>
                                        <button onClick={clearLayoutFile} className="text-zinc-500 hover:text-red-500">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <input 
                                            type="file" 
                                            ref={layoutInputRef}
                                            onChange={handleLayoutUpload}
                                            className="hidden"
                                            accept="image/png, image/jpeg, application/pdf"
                                        />
                                        <button 
                                            onClick={() => layoutInputRef.current?.click()}
                                            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-700 transition-colors border-dashed"
                                        >
                                            Clique para selecionar arquivo
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleAddItem}
                                className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                            >
                                <Plus className="w-5 h-5" /> Adicionar ao Orçamento
                            </button>
                        </div>
                    </div>
            </div>

            {/* Budget List */}
            {budgetItems.length > 0 && (
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="text-white font-bold text-lg">Itens do Orçamento</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleSendWhatsApp}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-all shadow-lg"
                            >
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                            </button>
                            <button 
                                onClick={handleShare}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isCopied ? 'bg-blue-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                {isCopied ? 'Copiado!' : 'Link'}
                            </button>
                            <button onClick={handlePrint} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                <Printer className="w-4 h-4" /> Imprimir
                            </button>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        {budgetItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                        {item.type === 'vehicle' && <Car className="w-5 h-5 text-orange-500" />}
                                        {item.type === 'fridge' && <Refrigerator className="w-5 h-5 text-blue-400" />}
                                        {item.type === 'flat' && <Ruler className="w-5 h-5 text-emerald-500" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{item.name}</h4>
                                        <p className="text-xs text-zinc-500">
                                            {item.details} {item.quantity > 1 && `(x${item.quantity})`}
                                            {item.materialType && <span className="ml-2 text-orange-400 font-medium">• {item.materialType}</span>}
                                            {item.estimatedTime && <span className="ml-2 text-zinc-400">• Tempo Est: {item.estimatedTime}h</span>}
                                            {item.pricePerSqm && <span className="ml-2 text-zinc-400">• Ref: R$ {item.pricePerSqm.toFixed(2)}/m²</span>}
                                        </p>
                                        {item.layoutFile && (
                                            <button 
                                                onClick={() => openFileInNewTab(item.layoutFile!)}
                                                className="mt-2 flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 underline"
                                            >
                                                <ImageIcon className="w-3 h-3" /> Ver Layout ({item.layoutFile.name})
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                            <p className="text-sm font-bold text-zinc-300">{item.linearMetersTotal.toFixed(1)} m</p>
                                            {item.servicePrice ? (
                                                <p className="text-sm font-bold text-emerald-500">R$ {item.servicePrice.toFixed(2)}</p>
                                            ) : (
                                                <p className="text-[10px] text-zinc-600">--</p>
                                            )}
                                    </div>
                                    <button onClick={() => setItemToDelete(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-zinc-900 p-6 border-t border-zinc-800 flex justify-between items-center">
                        <div className="text-zinc-400 text-sm">Total de Itens: <span className="text-white font-bold">{budgetItems.length}</span></div>
                        <div className="flex gap-8">
                            <div className="text-right">
                                <p className="text-xs text-zinc-500">Total Material (Linear)</p>
                                <p className="text-2xl font-bold text-orange-500">{totalMeters.toFixed(1)} m</p>
                            </div>
                            {totalServiceValue > 0 && (
                                <div className="text-right">
                                    <p className="text-xs text-zinc-500">Total Serviços</p>
                                    <p className="text-2xl font-bold text-emerald-500">R$ {totalServiceValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
         </div>
       )}
    </div>

    {/* Delete Confirmation Modal */}
    {itemToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-500/10 p-3 rounded-full mb-4">
                        <Trash2 className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Remover Item?</h3>
                    <p className="text-sm text-zinc-400 mb-6">
                        Tem certeza que deseja remover este item do orçamento? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setItemToDelete(null)}
                            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleRemoveItem}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors"
                        >
                            Sim, Remover
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}

    {/* PRINT LAYOUT - Professional Invoice Style */}
    <div className="hidden print:block bg-white text-black p-8 max-w-[210mm] mx-auto">
        {/* Header with Logo & Title */}
        <div className="flex justify-between items-end border-b-4 border-orange-500 pb-6 mb-8">
            <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="bg-zinc-900 p-3 rounded-lg shadow-md">
                   <Logo className="w-12 h-12" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight">ORÇAMENTO</h1>
                    <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest mt-1">Aplica PRO</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-zinc-400 mb-1">Data de Emissão</p>
                <p className="text-xl font-bold text-zinc-900">{new Date().toLocaleDateString()}</p>
            </div>
        </div>

        {/* Client Info Grid */}
        <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-100 mb-8 grid grid-cols-3 gap-8">
            <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Cliente</span>
                <span className="text-xl font-bold text-zinc-900 block">{clientName || 'Nome não informado'}</span>
            </div>
            <div>
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Contato / Telefone</span>
                 <span className="text-xl font-bold text-zinc-900 block">{clientPhone || '---'}</span>
            </div>
             <div>
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Forma de Pagamento</span>
                 <span className="text-xl font-bold text-zinc-900 block">{paymentCondition}</span>
            </div>
        </div>

        {/* The Table */}
        <table className="w-full mb-8 border-collapse">
            <thead>
                <tr className="border-b-2 border-zinc-800">
                    <th className="text-left py-3 text-xs font-black text-zinc-900 uppercase tracking-wider w-1/2">Item & Detalhes</th>
                    <th className="text-center py-3 text-xs font-black text-zinc-900 uppercase tracking-wider">Qtd</th>
                    <th className="text-center py-3 text-xs font-black text-zinc-900 uppercase tracking-wider">Metragem</th>
                    {totalServiceValue > 0 && <th className="text-right py-3 text-xs font-black text-zinc-900 uppercase tracking-wider">Valor</th>}
                </tr>
            </thead>
            <tbody>
                {budgetItems.map((item, index) => (
                    <tr key={item.id} className={`border-b border-zinc-100 ${index % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}`}>
                        <td className="py-4 pr-4 align-top">
                            <div className="flex gap-4">
                                {item.layoutFile && item.layoutFile.mimeType.includes('image') && (
                                    <img src={item.layoutFile.data} className="w-16 h-16 object-cover rounded border border-zinc-200" alt="Layout" />
                                )}
                                <div>
                                    <p className="font-bold text-zinc-900 text-sm">{item.name}</p>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {item.details}
                                        {item.materialType && <span className="ml-2 text-orange-600 font-semibold">• {item.materialType}</span>}
                                        {item.estimatedTime && <span className="ml-2 text-zinc-400">• Tempo Est: {item.estimatedTime}h</span>}
                                        {item.pricePerSqm && <span className="ml-2 text-zinc-400">• Ref: R$ {item.pricePerSqm.toFixed(2)}/m²</span>}
                                        {item.layoutFile && !item.layoutFile.mimeType.includes('image') && <span className="block mt-1 text-blue-600 font-bold text-[10px]">[Layout em Anexo: PDF]</span>}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className="text-center py-4 align-top text-sm font-medium text-zinc-700">{item.quantity}</td>
                        <td className="text-center py-4 align-top text-sm font-medium text-zinc-700">{item.linearMetersTotal.toFixed(2)} m</td>
                        {totalServiceValue > 0 && (
                            <td className="text-right py-4 align-top text-sm font-bold text-zinc-900">
                                {item.servicePrice ? item.servicePrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : '-'}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end mb-12">
            <div className="w-2/3 md:w-1/2 bg-zinc-50 rounded-xl p-6 border border-zinc-100">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-zinc-500">Metragem Total Necessária</span>
                    <span className="text-lg font-bold text-zinc-700">{totalMeters.toFixed(2)} m</span>
                </div>
                {totalServiceValue > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t-2 border-zinc-200">
                        <span className="text-base font-black text-zinc-900 uppercase">Valor Total</span>
                        <span className="text-2xl font-black text-emerald-600">{totalServiceValue.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Observations */}
        {observations && (
            <div className="mb-12">
                <h4 className="text-xs font-bold text-zinc-900 uppercase border-b border-zinc-200 pb-2 mb-3">Observações & Garantias</h4>
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{observations}</p>
            </div>
        )}

        {/* Signature Lines */}
        <div className="grid grid-cols-2 gap-12 mt-auto pt-12">
            <div className="text-center">
                <div className="border-t border-zinc-300 w-full h-1 mb-2"></div>
                <p className="text-xs font-bold text-zinc-400 uppercase">Assinatura do Responsável</p>
            </div>
            <div className="text-center">
                 <div className="border-t border-zinc-300 w-full h-1 mb-2"></div>
                <p className="text-xs font-bold text-zinc-400 uppercase">De acordo do Cliente</p>
            </div>
        </div>
    </div>
    </>
  );
};

export default MaterialCalculator;
