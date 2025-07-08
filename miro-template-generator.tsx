import React, { useState } from 'react';
import { Lightbulb, Download, Copy, Zap, Users, Target, ArrowRight, CheckCircle, FileJson, ExternalLink, Github } from 'lucide-react';

const MiroTemplateGenerator = () => {
  const [idea, setIdea] = useState('');
  const [template, setTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAPISettings, setShowAPISettings] = useState(false);
  const [miroToken, setMiroToken] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isUploadingGithub, setIsUploadingGithub] = useState(false);

  const generateTemplate = async () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const prompt = `Como agile coach especialista, transforme a seguinte ideia em um template estruturado para Miro:

"${idea}"

Crie um template que inclua:
1. Título do template
2. Objetivo principal
3. Participantes sugeridos
4. Duração estimada
5. Materiais necessários
6. Estrutura visual detalhada (frames, sticky notes, conectores)
7. Facilitação passo a passo
8. Dicas para o agile coach
9. Possíveis variações

Responda APENAS com um JSON válido no seguinte formato:
{
  "title": "Nome do Template",
  "objective": "Objetivo principal do template",
  "participants": ["Participante 1", "Participante 2"],
  "duration": "Duração estimada",
  "materials": ["Material 1", "Material 2"],
  "structure": {
    "frames": [
      {
        "name": "Nome do Frame",
        "description": "Descrição do frame",
        "elements": ["Elemento 1", "Elemento 2"]
      }
    ],
    "connections": ["Conexão 1", "Conexão 2"]
  },
  "facilitation": [
    {
      "step": 1,
      "action": "Ação a ser executada",
      "time": "Tempo estimado",
      "coaching_tip": "Dica para o coach"
    }
  ],
  "coaching_tips": ["Dica 1", "Dica 2"],
  "variations": ["Variação 1", "Variação 2"]
}

NÃO INCLUA NADA ALÉM DO JSON VÁLIDO. NÃO USE BACKTICKS.`;

      const response = await window.claude.complete(prompt);
      const templateData = JSON.parse(response);
      setTemplate(templateData);
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
      // Fallback: abrir em nova janela
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`<pre>${content}</pre>`);
      newWindow.document.close();
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
      // Fallback: abrir em nova janela
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`<pre>${jsonContent}</pre>`);
      newWindow.document.close();
    }
  };

  const createMiroBoard = async () => {
    if (!template || !miroToken) {
      alert('Configure o token do Miro primeiro');
      return;
    }
    
    setIsCreatingBoard(true);
    
    try {
      // Criar board no Miro
      const boardResponse = await fetch('https://api.miro.com/v2/boards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${miroToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: template.title,
          description: template.objective,
          policy: {
            permissionsPolicy: {
              collaborationToolsStartAccess: 'all_editors',
              copyAccess: 'anyone',
              sharingAccess: 'team_members_with_editing_rights'
            }
          }
        })
      });
      
      if (!boardResponse.ok) {
        throw new Error(`Erro ao criar board: ${boardResponse.status}`);
      }
      
      const board = await boardResponse.json();
      
      // Criar frames e sticky notes baseados no template
      const items = [];
      
      // Criar frames para cada seção
      template.structure.frames.forEach((frame, index) => {
        const yPosition = index * 600; // Espaçamento vertical
        
        // Frame principal
        items.push({
          type: 'frame',
          data: {
            title: frame.name,
            format: 'custom'
          },
          position: { x: 0, y: yPosition },
          geometry: { width: 800, height: 500 }
        });
        
        // Sticky notes para elementos do frame
        frame.elements.forEach((element, elemIndex) => {
          items.push({
            type: 'sticky_note',
            data: {
              content: element,
              shape: 'square'
            },
            position: { 
              x: 50 + (elemIndex * 150), 
              y: yPosition + 100 
            },
            style: {
              fillColor: '#fff9b1',
              textAlign: 'center'
            }
          });
        });
      });
      
      // Adicionar sticky note com objetivo
      items.push({
        type: 'sticky_note',
        data: {
          content: `🎯 OBJETIVO: ${template.objective}`,
          shape: 'rectangle'
        },
        position: { x: 0, y: -200 },
        style: {
          fillColor: '#f5f5f5',
          textAlign: 'center'
        }
      });
      
      // Criar todos os items no board
      for (const item of items) {
        await fetch(`https://api.miro.com/v2/boards/${board.id}/items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${miroToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(item)
        });
      }
      
      alert(`Board criado com sucesso! Abra: ${board.viewLink}`);
      window.open(board.viewLink, '_blank');
      
    } catch (error) {
      console.error('Erro ao criar board no Miro:', error);
      alert('Erro ao criar board no Miro. Verifique o token e tente novamente.');
    } finally {
      setIsCreatingBoard(false);
    }
  };

  const uploadToGithub = async () => {
    if (!template || !githubToken || !githubRepo) {
      alert('Configure o token do GitHub e repositório primeiro');
      return;
    }
    
    setIsUploadingGithub(true);
    
    try {
      const fileName = `${template.title.replace(/[^a-zA-Z0-9]/g, '_')}_template.md`;
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

      const base64Content = btoa(unescape(encodeURIComponent(content)));
      
      const response = await fetch(`https://api.github.com/repos/${githubRepo}/contents/templates/${fileName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify({
          message: `Add template: ${template.title}`,
          content: base64Content,
          committer: {
            name: 'Template Generator',
            email: 'template@generator.com'
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro no GitHub: ${response.status}`);
      }
      
      const result = await response.json();
      alert(`Template enviado para GitHub! URL: ${result.content.html_url}`);
      window.open(result.content.html_url, '_blank');
      
    } catch (error) {
      console.error('Erro ao enviar para GitHub:', error);
      alert('Erro ao enviar para GitHub. Verifique o token e repositório.');
    } finally {
      setIsUploadingGithub(false);
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

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Descreva sua ideia</h2>
            </div>
            <button
              onClick={() => setShowAPISettings(!showAPISettings)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              ⚙️ Configurar APIs
            </button>
          </div>
          
          {showAPISettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token do GitHub (opcional)
                  </label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="Token do GitHub"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para salvar templates no GitHub
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repositório GitHub (formato: user/repo)
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="ex: meuuser/meus-templates"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Template Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{template.title}</h2>
                  <p className="text-blue-100">{template.objective}</p>
                </div>
                <div className="flex gap-3">
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
                  {githubToken && githubRepo && (
                    <button
                      onClick={uploadToGithub}
                      disabled={isUploadingGithub}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isUploadingGithub ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Github className="w-5 h-5" />
                      )}
                      {isUploadingGithub ? 'Enviando...' : 'Salvar no GitHub'}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiroTemplateGenerator;
