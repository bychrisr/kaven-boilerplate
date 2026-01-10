'use client';

import React, { useRef } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Cor do spotlight (padrão: branco sutil) */
  spotlightColor?: string;
}

export function SpotlightCard({ 
  children, 
  className = "", 
  spotlightColor = "rgba(255, 255, 255, 0.08)",
  ...props 
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    // Calcula a posição relativa do mouse dentro do card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Atualiza as variáveis CSS diretamente no elemento (Zero React Re-renders)
    div.style.setProperty('--mouse-x', `${x}px`);
    div.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`
        group relative rounded-xl glass-panel transition-all duration-300
        hover:border-foreground/20 overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* Camada 1: O Brilho do Spotlight (Controlado via CSS) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${spotlightColor || 'var(--spotlight-color)'}, transparent 40%)`,
        }}
      />

      {/* Camada 2: Noise Texture (Sutil) */}
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none mix-blend-overlay" />

      {/* Conteúdo */}
      <div className="relative h-full z-10">
        {children}
      </div>
    </div>
  );
}
