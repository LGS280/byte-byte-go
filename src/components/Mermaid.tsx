import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    fontFamily: 'Inter, sans-serif',
    primaryColor: '#1e293b',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#475569',
    lineColor: '#818cf8',
    secondaryColor: '#0f172a',
    tertiaryColor: '#334155',
    clusterBkg: '#1e293b',
    clusterBorder: '#475569',
    nodeBorder: '#6366f1',
    mainBkg: '#1e293b',
    textColor: '#f8fafc',
  },
  securityLevel: 'loose',
});

export const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (ref.current) {
        ref.current.innerHTML = '';
        try {
          const id = `mermaid-${Math.random().toString(36).substring(7)}`;
          const { svg } = await mermaid.render(id, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (error) {
          console.error("Mermaid rendering failed", error);
        }
      }
    };
    renderChart();
  }, [chart]);

  return <div ref={ref} className="flex justify-center my-4 w-full" />;
};
