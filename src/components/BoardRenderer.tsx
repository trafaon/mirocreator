import React from 'react';

const stickyColors = [
  '#fff9b1', // Yellow
  '#fcd5ce', // Pink
  '#cdb4db', // Purple
  '#b5ead7', // Green
  '#f1fa8c', // Light Yellow
  '#ffb3ba', // Light Red
  '#bae1ff', // Light Blue
  '#ffffba', // Cream
  '#ffdfba', // Peach
  '#baffc9'  // Mint
];

type Frame = {
  name: string;
  description: string;
  elements: string[];
};

export default function BoardRenderer({ frames }: { frames: Frame[] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 min-h-[500px] overflow-auto">
      {/* Miro-like infinite canvas background */}
      <div 
        className="relative min-h-[400px] w-full"
        style={{
          backgroundImage: `
            radial-gradient(circle, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {frames.map((frame, frameIndex) => {
          const frameX = frameIndex * 400 + 50;
          const frameY = 50;
          
          return (
            <div key={frameIndex}>
              {/* Frame container - Miro style */}
              <div
                className="absolute border-2 border-blue-400 bg-blue-50/30 rounded-lg"
                style={{
                  left: `${frameX}px`,
                  top: `${frameY}px`,
                  width: '350px',
                  minHeight: '300px',
                  padding: '16px'
                }}
              >
                {/* Frame title */}
                <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-semibold mb-3 inline-block">
                  {frame.name}
                </div>
                
                {/* Frame description */}
                <div className="text-xs text-gray-600 mb-4 italic">
                  {frame.description}
                </div>
                
                {/* Sticky notes inside frame */}
                <div className="space-y-2">
                  {frame.elements.map((element, elementIndex) => {
                    const stickyX = (elementIndex % 2) * 150;
                    const stickyY = Math.floor(elementIndex / 2) * 80;
                    
                    return (
                      <div
                        key={elementIndex}
                        className="absolute transform rotate-1 hover:rotate-0 transition-transform cursor-pointer shadow-md"
                        style={{
                          left: `${stickyX + 10}px`,
                          top: `${stickyY + 60}px`,
                          width: '140px',
                          height: '60px',
                          backgroundColor: stickyColors[(frameIndex + elementIndex) % stickyColors.length],
                          transform: `rotate(${(elementIndex % 3 - 1) * 2}deg)`
                        }}
                      >
                        <div className="p-2 h-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-800 text-center leading-tight">
                            {element}
                          </span>
                        </div>
                        
                        {/* Sticky note shadow effect */}
                        <div 
                          className="absolute inset-0 bg-black/10 rounded"
                          style={{ transform: 'translate(2px, 2px)', zIndex: -1 }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Connection arrows between frames */}
              {frameIndex < frames.length - 1 && (
                <div
                  className="absolute flex items-center"
                  style={{
                    left: `${frameX + 350}px`,
                    top: `${frameY + 150}px`,
                    width: '50px',
                    height: '2px'
                  }}
                >
                  <div className="w-full h-0.5 bg-gray-400"></div>
                  <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}