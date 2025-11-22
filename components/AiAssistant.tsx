import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import { askAgronomist } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Fala, aplicador! Sou seu assistente especializado. Posso analisar fotos de veículos, projetos ou tirar dúvidas sobre materiais. Mande sua pergunta ou anexe uma imagem!',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState<{data: string, mimeType: string, name: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,") to get raw base64
        const base64Data = base64String.split(',')[1];
        
        setSelectedFile({
            data: base64Data,
            mimeType: file.type,
            name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
      setSelectedFile(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedFile) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText || (selectedFile ? `[Arquivo enviado: ${selectedFile.name}]` : ''),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    // Keep file data for the API call, then clear UI state
    const fileToSend = selectedFile;
    clearFile();

    try {
      const responseText = await askAgronomist(
          userMessage.text, 
          fileToSend?.data, 
          fileToSend?.mimeType
      );
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Tive um problema ao consultar a base de dados. Tente novamente.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="bg-orange-600 p-4 text-white flex items-center gap-3 shadow-md z-10">
        <div className="bg-white/20 p-2 rounded-lg">
           <Sparkles className="w-5 h-5" />
        </div>
        <div>
            <h3 className="font-bold">Assistente Técnico IA</h3>
            <p className="text-orange-100 text-xs opacity-80">Especialista em Envelopamento</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-950/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                msg.role === 'user' ? 'bg-orange-600 border-orange-500' : 'bg-zinc-800 border-zinc-700'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-orange-500" />}
              </div>

              {/* Bubble */}
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white rounded-tr-none'
                    : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-tl-none'
                } ${msg.isError ? 'bg-red-900/20 text-red-400 border-red-900' : ''}`}
              >
                {msg.role === 'model' ? (
                  <div className="prose prose-sm max-w-none prose-invert prose-p:text-zinc-300 prose-headings:text-orange-400 prose-strong:text-white">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
                <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-orange-200' : 'text-zinc-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start w-full">
             <div className="flex max-w-[85%] gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                   <Bot className="w-4 h-4 text-orange-500" />
                </div>
                <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-zinc-700 shadow-sm flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                   <span className="text-zinc-400 text-sm">Analisando dados...</span>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        
        {/* Image Preview */}
        {selectedFile && (
            <div className="flex items-center gap-3 bg-zinc-950 p-2 rounded-lg border border-zinc-800 mb-2 w-fit pr-4">
                <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-400">
                    {selectedFile.mimeType.includes('image') ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="max-w-[200px] overflow-hidden">
                    <p className="text-xs text-white truncate font-medium">{selectedFile.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase">{selectedFile.mimeType.split('/')[1]}</p>
                </div>
                <button onClick={clearFile} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white p-1 rounded-full transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}

        <div className="relative flex items-end gap-2">
            {/* File Input Hidden */}
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png, image/jpeg, application/pdf"
                className="hidden"
            />
            
            {/* Attach Button */}
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-orange-500 p-3 rounded-xl transition-colors border border-zinc-700 h-[46px] flex items-center justify-center"
                title="Anexar imagem ou PDF"
            >
                <Paperclip className="w-5 h-5" />
            </button>

            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Descreva sua dúvida ou envie uma foto..."
                className="flex-1 resize-none bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white outline-none transition max-h-32 text-sm placeholder-zinc-600 min-h-[46px]"
                rows={1}
            />
            
            <button
                onClick={handleSendMessage}
                disabled={isLoading || (!inputText.trim() && !selectedFile)}
                className="bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white p-3 rounded-xl transition h-[46px] flex items-center justify-center w-[46px]"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
        <p className="text-[10px] text-center text-zinc-600 mt-3">
          Suporta .JPG, .PNG e .PDF. A IA pode cometer erros.
        </p>
      </div>
    </div>
  );
};

export default AiAssistant;