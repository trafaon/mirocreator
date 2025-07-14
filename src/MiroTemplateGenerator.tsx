import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Download, Copy, Zap, Users, Target, ArrowRight, 
  CheckCircle, FileJson, ExternalLink, Image, History 
} from 'lucide-react';
import { Template } from './types';
import { saveTemplateToHistory, getTemplateHistory, clearTemplateHistory } from './utils/templateStorage';
import { exportTemplateAsImage } from './utils/imageExport';
import { callClaudeApi, ClaudeApiError } from './utils/claudeApi';
import QuickSuggestions from './components/QuickSuggestions';
import TemplateHistory from './components/TemplateHistory';
import BoardRenderer from './components/BoardRenderer';
import { createBoardFromTemplate } from './utils/miroApi';

const MiroTemplateGenerator = () => {
  const [idea, setIdea] = useState('');
  const [template, setTemplate] = useState<Template | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAPISettings, setShowAPISettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [miroToken, setMiroToken] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [templateHistory, setTemplateHistory] = useState<Template[]>([]);

  useEffect(() => {
    setTemplateHistory(getTemplateHistory());
  }, []);

  const generateTemplate = async () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Primeiro, vamos tentar usar a API real do Claude
      const prompt = `Você é um especialista em facilitação ágil e design de workshops. Com base na ideia fornecida, crie um template estruturado para o Miro que ajude agile coaches a facilitar sessões eficazes.

Ideia: "${idea}"

Retorne APENAS um JSON válido (sem backticks ou texto adicional) seguindo exatamente esta estrutura:

{
  "title": "Nome do Template",
  "objective": "Objetivo claro da sessão",
  "participants": ["Tipo de participante 1", "Tipo de participante 2"],
  "duration": "Tempo estimado",
  "materials": ["Material 1", "Material 2"],
  "structure": {
    "frames": [
      {
        "name": "Nome do Frame",
        "description": "Descrição do que vai neste frame",
        "elements": ["Elemento 1", "Elemento 2", "Elemento 3"]
      }
    ],
    "connections": ["Conexão 1", "Conexão 2"]
  },
  "facilitation": [
    {
      "step": 1,
      "action": "Ação a ser realizada",
      "time": "Tempo para esta etapa",
      "coaching_tip": "Dica para o facilitador"
    }
  ],
  "coaching_tips": ["Dica 1", "Dica 2"],
  "variations": ["Variação 1", "Variação 2"]
}`;

      let templateData: any;
      
      try {
        // Tentar usar a API real do Claude primeiro
        const response = await callClaudeApi(prompt, {
          max_tokens: 4000,
          temperature: 0.7
        });
        
        if (!response) {
          throw new Error('Resposta vazia da API do Claude');
        }
        
        templateData = JSON.parse(response);
        
      } catch (claudeError: any) {
        console.warn('Claude API não disponível, usando fallback inteligente:', claudeError);
        
        // Fallback inteligente baseado na sua lógica
        templateData = generateIntelligentFallback(idea);
      }
      
      // Add metadata to the template
      const completeTemplate: Template = {
        ...templateData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      setTemplate(completeTemplate);
      saveTemplateToHistory(completeTemplate);
      setTemplateHistory(getTemplateHistory());
      
    } catch (error: any) {
      console.error('Erro ao gerar template:', error);
      alert('Erro ao gerar template. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Função de fallback inteligente baseada na sua lógica
  const generateIntelligentFallback = (idea: string): Omit<Template, 'id' | 'createdAt'> => {
    const lowerIdea = idea.toLowerCase();

    // Análise de Riscos
    if (lowerIdea.includes("risco") || lowerIdea.includes("mitigação") || lowerIdea.includes("risk")) {
      return {
        title: "Análise de Riscos do Projeto",
        objective: "Identificar e avaliar os principais riscos do projeto, bem como definir planos de mitigação",
        participants: ["Gerentes de Projeto", "Líderes Técnicos", "Stakeholders-Chave"],
        duration: "2-3 horas",
        materials: ["Quadro Miro", "Post-its virtuais", "Timer"],
        structure: {
          frames: [
            {
              name: "Matriz de Probabilidade vs Impacto",
              description: "Quadrante dividido em 4 áreas: baixo risco, risco moderado, alto risco e risco crítico",
              elements: ["Eixo X: Probabilidade", "Eixo Y: Impacto", "Área de Quadrantes", "Legenda de Cores"]
            },
            {
              name: "Riscos Identificados",
              description: "Lista de riscos identificados com detalhes",
              elements: ["Sticky Notes de Riscos", "Categorias", "Responsáveis"]
            },
            {
              name: "Planos de Mitigação",
              description: "Ações específicas para cada risco prioritário",
              elements: ["Ações de Mitigação", "Prazos", "Responsáveis", "Status"]
            }
          ],
          connections: ["Setas conectando matriz aos riscos", "Linhas ligando riscos aos planos"]
        },
        facilitation: [
          {
            step: 1,
            action: "Apresentar o objetivo da sessão e explicar a matriz de probabilidade vs impacto",
            time: "10 minutos",
            coaching_tip: "Use exemplos práticos para explicar a matriz. Certifique-se de que todos entendam antes de prosseguir"
          },
          {
            step: 2,
            action: "Brainstorming de riscos - cada participante adiciona riscos em sticky notes",
            time: "30 minutos",
            coaching_tip: "Encoraje pensamento divergente. Não julgue ou filtre nesta etapa. Capture todos os riscos mencionados"
          },
          {
            step: 3,
            action: "Categorizar e agrupar riscos similares",
            time: "15 minutos",
            coaching_tip: "Facilite discussões para agrupar riscos relacionados. Evite debates longos sobre categorização"
          },
          {
            step: 4,
            action: "Avaliar probabilidade e impacto de cada risco e posicionar na matriz",
            time: "45 minutos",
            coaching_tip: "Facilite discussões e busque consenso. Use votação se necessário para resolver impasses"
          },
          {
            step: 5,
            action: "Priorizar riscos críticos e de alto impacto",
            time: "15 minutos",
            coaching_tip: "Foque nos riscos do quadrante superior direito. Limite a 5-7 riscos prioritários"
          },
          {
            step: 6,
            action: "Definir planos de mitigação para riscos prioritários",
            time: "45 minutos",
            coaching_tip: "Garanta que os planos sejam específicos, mensuráveis e acionáveis. Defina responsáveis e prazos"
          }
        ],
        coaching_tips: [
          "Mantenha a energia alta com timeboxing rigoroso",
          "Encoraje participação equilibrada de todos os membros",
          "Use técnicas de facilitação como 'fist to five' para medir consenso",
          "Documente decisões e próximos passos claramente",
          "Prepare-se para mediar conflitos sobre priorização de riscos"
        ],
        variations: [
          "Adicionar uma etapa de análise de impacto financeiro dos riscos",
          "Incluir análise de oportunidades (riscos positivos)",
          "Dividir em duas sessões: identificação e avaliação/mitigação",
          "Usar técnica de 'Pre-mortem' para identificar riscos",
          "Adicionar revisão de riscos de projetos anteriores"
        ]
      };
    }

    // Retrospectiva
    if (lowerIdea.includes("retrospectiva") || lowerIdea.includes("retro") || lowerIdea.includes("sprint review")) {
      return {
        title: "Retrospectiva de Sprint",
        objective: "Refletir sobre o sprint anterior e identificar melhorias para o próximo ciclo",
        participants: ["Scrum Master", "Product Owner", "Desenvolvedores", "QA"],
        duration: "1.5-2 horas",
        materials: ["Quadro Miro", "Timer", "Post-its virtuais"],
        structure: {
          frames: [
            {
              name: "What Went Well",
              description: "Aspectos positivos do sprint",
              elements: ["Sticky notes verdes", "Agrupamento por temas", "Votação de prioridade"]
            },
            {
              name: "What Could Be Improved",
              description: "Pontos de melhoria identificados",
              elements: ["Sticky notes amarelos", "Categorização", "Root cause analysis"]
            },
            {
              name: "Action Items",
              description: "Ações concretas para o próximo sprint",
              elements: ["Tasks específicas", "Responsáveis", "Prazos", "Critérios de sucesso"]
            }
          ],
          connections: ["Setas dos problemas para as ações", "Agrupamentos temáticos"]
        },
        facilitation: [
          {
            step: 1,
            action: "Check-in e definição do tom da retrospectiva",
            time: "10 minutos",
            coaching_tip: "Crie um ambiente seguro. Use uma atividade quebra-gelo se necessário"
          },
          {
            step: 2,
            action: "Coleta individual de pontos positivos (What Went Well)",
            time: "15 minutos",
            coaching_tip: "Comece sempre pelo positivo. Encoraje especificidade nos comentários"
          },
          {
            step: 3,
            action: "Compartilhamento e agrupamento dos pontos positivos",
            time: "15 minutos",
            coaching_tip: "Celebre os sucessos. Identifique padrões que podem ser replicados"
          },
          {
            step: 4,
            action: "Coleta de pontos de melhoria (What Could Be Improved)",
            time: "20 minutos",
            coaching_tip: "Foque em fatos, não pessoas. Encoraje linguagem construtiva"
          },
          {
            step: 5,
            action: "Discussão e priorização dos pontos de melhoria",
            time: "25 minutos",
            coaching_tip: "Use dot voting para priorizar. Limite a 3-5 itens principais"
          },
          {
            step: 6,
            action: "Definição de action items específicos",
            time: "20 minutos",
            coaching_tip: "Garanta que cada ação tenha responsável, prazo e critério de sucesso definidos"
          },
          {
            step: 7,
            action: "Check-out e próximos passos",
            time: "5 minutos",
            coaching_tip: "Confirme compromissos e agende follow-ups se necessário"
          }
        ],
        coaching_tips: [
          "Mantenha foco em melhorias controláveis pelo time",
          "Evite que a sessão vire sessão de reclamações",
          "Use a regra 'Vegas': o que acontece na retro, fica na retro",
          "Varie o formato das retrospectivas para manter engajamento",
          "Acompanhe o progresso dos action items do sprint anterior"
        ],
        variations: [
          "Usar formato 'Start, Stop, Continue'",
          "Aplicar técnica '4Ls: Liked, Learned, Lacked, Longed for'",
          "Retrospectiva temática (foco em qualidade, comunicação, etc.)",
          "Timeline retrospective para sprints longos",
          "Mad, Sad, Glad format para times mais maduros"
        ]
      };
    }

    // Planning Poker
    if (lowerIdea.includes("planning poker") || lowerIdea.includes("estimativa") || lowerIdea.includes("story points")) {
      return {
        title: "Planning Poker Session",
        objective: "Estimar user stories usando técnica colaborativa de Planning Poker",
        participants: ["Product Owner", "Scrum Master", "Desenvolvedores", "QA", "UX Designer"],
        duration: "2-4 horas",
        materials: ["Cartas de Planning Poker", "Backlog refinado", "Timer"],
        structure: {
          frames: [
            {
              name: "Product Backlog",
              description: "Lista de user stories a serem estimadas",
              elements: ["User Stories", "Critérios de Aceitação", "Prioridade", "Dependências"]
            },
            {
              name: "Estimation Board",
              description: "Área para discussão e votação",
              elements: ["Story em discussão", "Cartas reveladas", "Consenso", "Notas de discussão"]
            },
            {
              name: "Estimated Stories",
              description: "Stories já estimadas com story points",
              elements: ["Stories finalizadas", "Story Points", "Observações", "Riscos identificados"]
            }
          ],
          connections: ["Fluxo do backlog para estimação", "Stories estimadas movem para área final"]
        },
        facilitation: [
          {
            step: 1,
            action: "Explicar o processo de Planning Poker e revisar escala de pontos",
            time: "15 minutos",
            coaching_tip: "Certifique-se de que todos entendem a escala Fibonacci e o conceito de story points"
          },
          {
            step: 2,
            action: "Product Owner apresenta a primeira user story",
            time: "5-10 minutos por story",
            coaching_tip: "Encoraje perguntas de esclarecimento. Garanta que todos entendam os critérios de aceitação"
          },
          {
            step: 3,
            action: "Discussão técnica e esclarecimento de dúvidas",
            time: "5-15 minutos por story",
            coaching_tip: "Facilite discussões técnicas. Evite soluções detalhadas - foque no entendimento"
          },
          {
            step: 4,
            action: "Votação simultânea com cartas de Planning Poker",
            time: "2 minutos por rodada",
            coaching_tip: "Garanta que todos votem simultaneamente. Não permita influência entre votos"
          },
          {
            step: 5,
            action: "Discussão de discrepâncias nas estimativas",
            time: "5-10 minutos",
            coaching_tip: "Foque nas estimativas mais altas e baixas. Busque entender as diferentes perspectivas"
          },
          {
            step: 6,
            action: "Nova rodada de votação até consenso",
            time: "Variável",
            coaching_tip: "Limite a 3 rodadas por story. Se não houver consenso, use a média ou adie a story"
          }
        ],
        coaching_tips: [
          "Mantenha o foco na estimativa relativa, não absoluta",
          "Evite que desenvolvedores seniores dominem as discussões",
          "Use timeboxing rigoroso para evitar over-analysis",
          "Documente assumptions importantes feitas durante estimação",
          "Celebre quando o time alcança consenso rapidamente"
        ],
        variations: [
          "Usar T-shirt sizing (XS, S, M, L, XL) em vez de Fibonacci",
          "Planning Poker assíncrono para times distribuídos",
          "Incluir estimativa de risco além de complexidade",
          "Usar referência de stories já implementadas",
          "Combinar com técnica de Three-Point Estimation"
        ]
      };
    }

    // Template genérico para outras ideias
    return {
      title: "Workshop Colaborativo",
      objective: `Facilitar uma sessão colaborativa baseada na ideia: ${idea}`,
      participants: ["Facilitador", "Stakeholders", "Equipe"],
      duration: "2-3 horas",
      materials: ["Quadro Miro", "Post-its virtuais", "Timer"],
      structure: {
        frames: [
          {
            name: "Contexto e Objetivo",
            description: "Definição clara do problema e objetivos da sessão",
            elements: ["Problema definido", "Objetivos SMART", "Critérios de sucesso"]
          },
          {
            name: "Ideação e Discussão",
            description: "Espaço para brainstorming e desenvolvimento de ideias",
            elements: ["Ideias geradas", "Agrupamentos", "Discussões"]
          },
          {
            name: "Decisões e Próximos Passos",
            description: "Consolidação de decisões e definição de ações",
            elements: ["Decisões tomadas", "Action items", "Responsáveis", "Prazos"]
          }
        ],
        connections: ["Fluxo do contexto para ideação", "Das ideias para as decisões"]
      },
      facilitation: [
        {
          step: 1,
          action: "Apresentar contexto e objetivos da sessão",
          time: "15 minutos",
          coaching_tip: "Garanta alinhamento sobre o propósito antes de começar"
        },
        {
          step: 2,
          action: "Facilitar brainstorming de ideias",
          time: "45 minutos",
          coaching_tip: "Encoraje participação de todos. Use técnicas de pensamento divergente"
        },
        {
          step: 3,
          action: "Agrupar e priorizar ideias",
          time: "30 minutos",
          coaching_tip: "Use dot voting ou outras técnicas de priorização colaborativa"
        },
        {
          step: 4,
          action: "Definir próximos passos e responsabilidades",
          time: "30 minutos",
          coaching_tip: "Garanta que cada ação tenha responsável e prazo definidos"
        }
      ],
      coaching_tips: [
        "Mantenha energia alta com timeboxing",
        "Facilite participação equilibrada",
        "Documente decisões claramente",
        "Foque em resultados acionáveis"
      ],
      variations: [
        "Adaptar duração conforme complexidade",
        "Incluir breakout rooms para grupos menores",
        "Adicionar etapas de validação das ideias"
      ]
    };
  };

  const copyToClipboard = () => {
    if (!template) return;
    
    const formattedTemplate = `
# ${template.title}

## 🎯 Objetivo
${template.objective}

## 👥 Participantes
${template.participants.join(', ')}

## ⏱️ Duração
${template.duration}

## 📋 Materiais
${template.materials.map(m => `• ${m}`).join('\n')}

## 🎨 Estrutura Visual

### Frames:
${template.structure.frames.map(frame => `
**${frame.name}**
${frame.description}
Elementos: ${frame.elements.join(', ')}
`).join('\n')}

### Conexões:
${template.structure.connections.map(c => `• ${c}`).join('\n')}

## 🎪 Facilitação Passo a Passo

${template.facilitation.map(step => `
**Passo ${step.step}**: ${step.action}
⏱️ Tempo: ${step.time}
💡 Dica: ${step.coaching_tip}
`).join('\n')}

## 🚀 Dicas para Agile Coach
${template.coaching_tips.map(tip => `• ${tip}`).join('\n')}

## 🔄 Variações Possíveis
${template.variations.map(v => `• ${v}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(formattedTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTemplate = () => {
    if (!template) return;
    
    const content = `# ${template.title}

## 🎯 Objetivo
${template.objective}

## 👥 Participantes
${template.participants.join(', ')}

## ⏱️ Duração
${template.duration}

## 📋 Materiais
${template.materials.map(m => `• ${m}`).join('\n')}

## 🎨 Estrutura Visual

### Frames:
${template.structure.frames.map(frame => `
**${frame.name}**
${frame.description}
Elementos: ${frame.elements.join(', ')}
`).join('\n')}

### Conexões:
${template.structure.connections.map(c => `• ${c}`).join('\n')}

## 🎪 Facilitação Passo a Passo

${template.facilitation.map(step => `
**Passo ${step.step}**: ${step.action}
⏱️ Tempo: ${step.time}
💡 Dica: ${step.coaching_tip}
`).join('\n')}

## 🚀 Dicas para Agile Coach
${template.coaching_tips.map(tip => `• ${tip}`).join('\n')}

## 🔄 Variações Possíveis
${template.variations.map(v => `• ${v}`).join('\n')}`;

    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.title.replace(/[^a-zA-Z0-9]/g, '_')}_template.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro no download:', error);
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(`<pre>${content}</pre>`);
      newWindow?.document.close();
    }
  };

  const exportJSON = () => {
    if (!template) return;
    
    const jsonContent = JSON.stringify(template, null, 2);
    
    try {
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.title.replace(/[^a-zA-Z0-9]/g, '_')}_template.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro no export JSON:', error);
      const newWindow = window.open('', '_blank');
      newWindow?.document.write(`<pre>${jsonContent}</pre>`);
      newWindow?.document.close();
    }
  };

  const exportAsImage = async () => {
    if (!template) return;
    
    setIsExportingImage(true);
    try {
      await exportTemplateAsImage('template-display', template.title.replace(/[^a-zA-Z0-9]/g, '_'));
    } catch (error) {
      console.error('Erro ao exportar imagem:', error);
      alert('Erro ao exportar imagem. Tente novamente.');
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleSelectSuggestion = (suggestionIdea: string) => {
    setIdea(suggestionIdea);
  };

  const handleSelectFromHistory = (historicalTemplate: Template) => {
    setTemplate(historicalTemplate);
    setIdea(''); // Clear the idea input when loading from history
  };

  const handleClearHistory = () => {
    clearTemplateHistory();
    setTemplateHistory([]);
  };

  const createMiroBoard = async () => {
    if (!template || !miroToken) {
      alert('Configure o token do Miro primeiro');
      return;
    }
    
    setIsCreatingBoard(true);
    
    try {
      const newBoard = await createBoardFromTemplate(miroToken, template);
      alert(`Board '${newBoard.name}' criado com sucesso! Link: ${newBoard.viewLink}`);
    } catch (error) {
      console.error("Erro ao criar board no Miro:", error);
      alert(`Erro ao criar board no Miro: ${error.message}. Verifique o token e tente novamente.`);
    } finally {
      setIsCreatingBoard(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">Gerador de Templates Miro</h1>
            <Zap className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-600 text-lg">Transforme suas ideias em templates estruturados para facilitar sessões ágeis</p>
        </div>

        {/* Quick Suggestions */}
        <QuickSuggestions onSelectSuggestion={handleSelectSuggestion} />

        {/* Template History */}
        {showHistory && (
          <TemplateHistory 
            history={templateHistory}
            onSelectTemplate={handleSelectFromHistory}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Descreva sua ideia</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                <History className="w-4 h-4" />
                Histórico ({templateHistory.length})
              </button>
              <button
                onClick={() => setShowAPISettings(!showAPISettings)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                ⚙️ Configurar APIs
              </button>
            </div>
          </div>
          
          {showAPISettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token do Miro (opcional)
                </label>
                <input
                  type="password"
                  value={miroToken}
                  onChange={(e) => setMiroToken(e.target.value)}
                  placeholder="Token da API do Miro"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para criar boards automaticamente no Miro
                </p>
              </div>
            </div>
          )}
          
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Ex: Quero criar uma retrospectiva focada em melhorias de processo para times distribuídos..."
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={generateTemplate}
              disabled={!idea.trim() || isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Gerando Template...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Gerar Template
                </>
              )}
            </button>
          </div>
        </div>

        {/* Template Display */}
        {template && (
          <div id="template-display" className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Template Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{template.title}</h2>
                  <p className="text-blue-100">{template.objective}</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button
                    onClick={exportJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <FileJson className="w-5 h-5" />
                    JSON
                  </button>
                  <button
                    onClick={exportAsImage}
                    disabled={isExportingImage}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isExportingImage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Image className="w-5 h-5" />
                    )}
                    {isExportingImage ? 'Exportando...' : 'Imagem'}
                  </button>
                  {miroToken && (
                    <button
                      onClick={createMiroBoard}
                      disabled={isCreatingBoard}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isCreatingBoard ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <ExternalLink className="w-5 h-5" />
                      )}
                      {isCreatingBoard ? 'Criando...' : 'Criar no Miro'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Participants & Duration */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold text-gray-800">Participantes</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.participants.map((participant, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {participant}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Duração:</strong> {template.duration}
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">📋 Materiais Necessários</h3>
                    <ul className="space-y-2">
                      {template.materials.map((material, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Structure */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">🎨 Estrutura Visual</h3>
                    <div className="space-y-3">
                      {template.structure.frames.map((frame, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-2">{frame.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{frame.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {frame.elements.map((element, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {element}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Facilitation Steps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">🎪 Facilitação Passo a Passo</h3>
                    <div className="space-y-3">
                      {template.facilitation.map((step, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 mb-1">{step.action}</p>
                              <p className="text-sm text-blue-600 mb-2">⏱️ {step.time}</p>
                              <p className="text-sm text-gray-600 italic">💡 {step.coaching_tip}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coaching Tips */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">🚀 Dicas para Agile Coach</h3>
                    <ul className="space-y-2">
                      {template.coaching_tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Variations */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">🔄 Variações Possíveis</h3>
                    <ul className="space-y-2">
                      {template.variations.map((variation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          {variation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Visual Board Preview */}
              {template && template.structure && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">🧩 Preview Visual do Board</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <BoardRenderer frames={template.structure.frames} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiroTemplateGenerator;