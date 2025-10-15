import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface MindMapModalProps {
  mermaidCode: string;
  onClose: () => void;
}

const MindMapModal: React.FC<MindMapModalProps> = ({ mermaidCode, onClose }) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const uniqueId = `mermaid-modal-${Date.now()}`;

  useEffect(() => {
    if (diagramRef.current && (window as any).mermaid) {
      try {
        // Ensure the content is set before rendering
        diagramRef.current.innerHTML = mermaidCode;
        diagramRef.current.removeAttribute('data-processed');
        (window as any).mermaid.run({
          nodes: [diagramRef.current],
        });
      } catch (e) {
        console.error("Failed to render Mermaid diagram in modal:", e);
        if (diagramRef.current) {
            diagramRef.current.innerText = "Error rendering diagram.";
        }
      }
    }
  }, [mermaidCode]);
  
  const handleDownload = async (format: 'svg' | 'png') => {
    if (!diagramRef.current) return;
    const svgElement = diagramRef.current.querySelector('svg');
    if (!svgElement) {
      alert('Could not find the diagram to download.');
      return;
    }

    // Set explicit size and styles for clean export
    const rect = svgElement.getBoundingClientRect();
    svgElement.setAttribute('width', `${rect.width}`);
    svgElement.setAttribute('height', `${rect.height}`);
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    if (format === 'svg') {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mindmap.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else { // PNG
        const canvas = document.createElement('canvas');
        // Use a multiplier for higher resolution PNG
        const scale = 2;
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const pngUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = 'mindmap.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        // Use btoa for binary data encoding which is more robust
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };


  return (
    <div 
      className="fixed inset-0 z-50 bg-bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-bg-secondary border border-border-primary rounded-lg shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-3 flex items-center justify-between border-b border-border-primary">
          <h2 className="font-bold text-lg text-text-primary">Mind Map Viewer</h2>
          <div className="flex items-center gap-2">
             <button onClick={() => handleDownload('svg')} className="flex items-center gap-2 text-sm font-semibold bg-bg-tertiary hover:bg-bg-interactive text-text-primary px-3 py-1.5 rounded-md transition-colors">
                <Icon name="download" className="w-4 h-4" />
                SVG
             </button>
             <button onClick={() => handleDownload('png')} className="flex items-center gap-2 text-sm font-semibold bg-bg-tertiary hover:bg-bg-interactive text-text-primary px-3 py-1.5 rounded-md transition-colors">
                <Icon name="download" className="w-4 h-4" />
                PNG
             </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-tertiary transition-colors">
              <Icon name="close" className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </header>
        <div className="flex-1 min-h-0 overflow-auto p-4 flex items-center justify-center bg-bg-primary/50">
            <div ref={diagramRef} id={uniqueId} className="mermaid-container w-full h-full text-white">
                {/* Mermaid diagram will be rendered here by the effect */}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MindMapModal;