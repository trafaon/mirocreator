import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Download, Copy, Zap, Users, Target, ArrowRight, 
  CheckCircle, FileJson, ExternalLink, Image, History 
} from 'lucide-react';
import { Template } from './types';
import { saveTemplateToHistory, getTemplateHistory, clearTemplateHistory } from './utils/templateStorage';
import { exportTemplateAsImage } from './utils/imageExport';
import QuickSuggestions from './components/QuickSuggestions';
import TemplateHistory from './components/TemplateHistory';
import BoardRenderer from './components/BoardRenderer';

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
      // Simulating API call - replace with actual LLM integration
      const mockTemplate: Template = {
        id: Date.now().toString(),
        title: "Template Gerado",
        objective: "Objetivo baseado na ideia fornecida",
        participants: ["Product Owner", "Scrum Master", "Desenvolvedores"],
        duration: "90 minutos",
        materials: ["Sticky notes virtuais", "Timer", "Quadro Miro"],
        structure: {
          frames: [
            {
              name: "Preparação",
              description: "Frame inicial para contexto",
              elements: ["Objetivo da sessão", "Regras", "Agenda"]
            },
            {
              name: "Execução",
              description: "Frame principal da atividade",
              elements: ["Brainstorming", "Agrupamento", "Votação"]
            }
          ],
          connections: ["Setas conectando frames", "Linhas de fluxo"]
        },
        facilitation: [
          {
            step: 1,
            action: "Apresentar o objetivo da sessão",
            time: "5 minutos",
            coaching_tip: "Mantenha o foco no resultado esperado"
          },
          {
            step: 2,
            action: "Executar brainstorming individual",
            time: "15 minutos",
            coaching_tip: "Incentive quantidade sobre qualidade inicial"
          }
        ],
        coaching_tips: [
          "Mantenha energia alta durante toda sessão",
          "Use timeboxing rigoroso",
          "Facilite, não participe do conteúdo"
        ],
        variations: [
          "Versão remota com breakout rooms",
          "Adaptação para times grandes (15+ pessoas)",
          "Versão assíncrona"
        ],
        createdAt: new Date().toISOString()
      };

      // In a real implementation, you would call your LLM API here
      // const response = await callLLMAPI(idea);
      // const templateData = JSON.parse(response);
      
      setTemplate(mockTemplate);
      saveTemplateToHistory(mockTemplate);
      setTemplateHistory(getTemplateHistory());
      
    } catch (error) {
      console.error('Erro ao gerar template:', error);
      alert('Erro ao gerar template. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
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
      // Miro API integration would go here
      alert('Funcionalidade de integração com Miro será implementada em breve!');
    } catch (error) {
      console.error('Erro ao criar board no Miro:', error);
      alert('Erro ao criar board no Miro. Verifique o token e tente novamente.');
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