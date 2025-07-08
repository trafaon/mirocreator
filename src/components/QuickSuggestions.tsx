import React from 'react';
import { Zap } from 'lucide-react';
import { quickSuggestions } from '../data/quickSuggestions';

interface QuickSuggestionsProps {
  onSelectSuggestion: (idea: string) => void;
}

const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ onSelectSuggestion }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-gray-800">Sugestões Rápidas</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {quickSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion.idea)}
            className="text-left p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-all duration-200 text-sm"
          >
            <div className="font-medium text-gray-800 mb-1">{suggestion.title}</div>
            <div className="text-gray-600 text-xs line-clamp-2">
              {suggestion.idea.substring(0, 80)}...
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;