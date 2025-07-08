import React from 'react';

const colors = ['#fff9b1', '#fcd5ce', '#cdb4db', '#b5ead7', '#f1fa8c'];

type Frame = {
  name: string;
  description: string;
  elements: string[];
};

export default function BoardRenderer({ frames }: { frames: Frame[] }) {
  return (
    <div className="overflow-auto py-6">
      <div className="flex gap-8 flex-wrap justify-start">
        {frames.map((frame, i) => (
          <div key={i} className="bg-white border border-gray-300 shadow-md rounded-lg p-4 min-w-[300px] max-w-[300px]">
            <h3 className="text-lg font-bold text-blue-700 mb-1">{frame.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{frame.description}</p>
            <div className="space-y-2">
              {frame.elements.map((el, j) => (
                <div
                  key={j}
                  className="p-2 rounded text-sm font-medium shadow"
                  style={{ backgroundColor: colors[(i + j) % colors.length] }}
                >
                  {el}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}