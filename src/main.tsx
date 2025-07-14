import React from 'react'
import ReactDOM from 'react-dom/client'
import MiroTemplateGenerator from './MiroTemplateGenerator'
import './index.css'

// Mock Claude API for development
declare global {
  interface Window {
    claude: {
      complete: (prompt: string) => Promise<string>;
    };
  }
}

// Create mock Claude API if not available
if (typeof window.claude === 'undefined') {
  window.claude = {
    complete: async (prompt: string): Promise<string> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract the idea from the prompt
      const ideaMatch = prompt.match(/Ideia: "(.+?)"/);
      const idea = ideaMatch ? ideaMatch[1] : 'sessão de brainstorming';
      
      // Generate a mock template based on the idea
      const mockTemplate = {
        "title": `Template: ${idea.charAt(0).toUpperCase() + idea.slice(1)}`,
        "objective": `Facilitar uma sessão estruturada focada em: ${idea}`,
        "participants": ["Product Owner", "Scrum Master", "Desenvolvedores", "UX/UI Designer"],
        "duration": "90 minutos",
        "materials": ["Sticky notes virtuais", "Timer", "Quadro Miro", "Marcadores coloridos"],
        "structure": {
          "frames": [
            {
              "name": "Preparação",
              "description": "Frame inicial para contexto e alinhamento",
              "elements": ["Objetivo da sessão", "Regras de participação", "Agenda", "Icebreaker"]
            },
            {
              "name": "Execução Principal",
              "description": "Frame principal da atividade",
              "elements": ["Área de brainstorming", "Categorização", "Votação", "Priorização"]
            },
            {
              "name": "Síntese",
              "description": "Frame para consolidação dos resultados",
              "elements": ["Resumo das decisões", "Próximos passos", "Responsáveis", "Timeline"]
            }
          ],
          "connections": ["Setas conectando preparação → execução → síntese", "Linhas agrupando itens relacionados"]
        },
        "facilitation": [
          {
            "step": 1,
            "action": "Apresentar o objetivo e contexto da sessão",
            "time": "10 minutos",
            "coaching_tip": "Mantenha o foco no problema a ser resolvido, evite dispersão"
          },
          {
            "step": 2,
            "action": "Conduzir brainstorming individual silencioso",
            "time": "15 minutos",
            "coaching_tip": "Incentive quantidade sobre qualidade nesta fase"
          },
          {
            "step": 3,
            "action": "Compartilhamento e agrupamento das ideias",
            "time": "20 minutos",
            "coaching_tip": "Facilite a discussão sem julgar as ideias apresentadas"
          },
          {
            "step": 4,
            "action": "Votação e priorização colaborativa",
            "time": "15 minutos",
            "coaching_tip": "Use dot voting para democratizar as decisões"
          },
          {
            "step": 5,
            "action": "Definição de próximos passos e responsáveis",
            "time": "20 minutos",
            "coaching_tip": "Seja específico sobre quem fará o quê e quando"
          },
          {
            "step": 6,
            "action": "Retrospectiva rápida da sessão",
            "time": "10 minutos",
            "coaching_tip": "Colete feedback para melhorar futuras facilitações"
          }
        ],
        "coaching_tips": [
          "Mantenha energia alta com breaks regulares",
          "Use timeboxing rigoroso para manter o foco",
          "Incentive participação equilibrada de todos",
          "Documente decisões em tempo real",
          "Prepare-se para adaptar o formato conforme necessário"
        ],
        "variations": [
          "Versão remota com breakout rooms",
          "Formato assíncrono para times distribuídos",
          "Adaptação para diferentes tamanhos de grupo",
          "Integração com outras metodologias ágeis"
        ]
      };
      
      return JSON.stringify(mockTemplate);
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MiroTemplateGenerator />
  </React.StrictMode>,
)