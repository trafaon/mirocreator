import React from 'react';
import { History, Trash2, Clock } from 'lucide-react';
import { Template } from '../types';

interface TemplateHistoryProps {
  history: Template[];
  onSelectTemplate: (template: Template) => void;
  onClearHistory: () => void;
}

const TemplateHistory: React.FC<TemplateHistoryProps> = ({ 
  history, 
  onSelectTemplate, 
  onClearHistory 
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">Histórico Recente</h3>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Limpar
        </button>
      </div>
      
      <div className="space-y-2">
        {history.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800 mb-1">{template.title}</div>
                <div className="text-sm text-gray-600 line-clamp-1">
                  {template.objective}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {new Date(template.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateHistory;