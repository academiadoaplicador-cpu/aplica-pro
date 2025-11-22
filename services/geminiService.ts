import { GoogleGenAI } from "@google/genai";

export const askAgronomist = async (question: string, imageBase64?: string, mimeType?: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Erro: Chave de API não configurada. O assistente não pode responder.";
  }

  try {
    // Initialize strictly inside the function call to prevent "Illegal constructor" errors during app load
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash";
    const systemInstruction = `Você é um especialista sênior em Envelopamento Automotivo e Comunicação Visual (Aplica PRO).

    Suas responsabilidades:
    1. Ajudar aplicadores a calcular metragem de material para carros, geladeiras, móveis e paredes.
    2. Tirar dúvidas técnicas sobre tipos de vinil (Cast, Polimérico, Monomérico), marcas e durabilidade.
    3. **ANÁLISE VISUAL:** Se o usuário enviar uma imagem (foto de carro, geladeira, planta baixa ou rascunho), analise a geometria, estime as dimensões baseadas em referências visuais e sugira a quantidade de material necessária considerando margens de segurança.
    4. Ajudar a justificar preços para clientes e evitar prejuízos no orçamento.
    
    Diretrizes de resposta:
    - Seja direto, "chão de fábrica", use a gíria profissional correta mas mantenha o profissionalismo.
    - Em cálculos, sempre sugira uma margem de erro/perda (safety margin) de pelo menos 15-20%.
    - Se perguntarem sobre preços, dê faixas estimadas mas enfatize que depende da região e custo fixo do aplicador.
    - Formate a resposta com Markdown (negrito para pontos importantes).`;

    // Prepare content parts
    const parts: any[] = [{ text: question }];

    // Add image/pdf part if provided
    if (imageBase64 && mimeType) {
        parts.push({
            inlineData: {
                mimeType: mimeType,
                data: imageBase64
            }
        });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts }, // Correct structure for @google/genai
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      }
    });

    return response.text || "Não foi possível gerar uma resposta no momento.";
  } catch (error) {
    console.error("Error querying Gemini:", error);
    return "Desculpe, ocorreu um erro ao consultar o assistente. Verifique sua conexão ou se o arquivo é suportado.";
  }
};