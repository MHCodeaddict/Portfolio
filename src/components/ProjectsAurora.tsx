import { useEffect, useRef } from 'react';

// Declare vanta types
declare global {
  interface Window {
    VANTA: {
      FOG: (options: VantaFogOptions) => VantaEffect;
    };
  }
}

interface VantaEffect {
  destroy: () => void;
  resize: () => void;
}

interface VantaFogOptions {
  el: HTMLElement;
  mouseControls: boolean;
  touchControls: boolean;
  gyroControls: boolean;
  minHeight: number;
  minWidth: number;
  highlightColor: number;
  midtoneColor: number;
  lowlightColor: number;
  baseColor: number;
  blurFactor: number;
  speed: number;
  zoom: number;
  scale?: number;
  scaleMobile?: number;
  backgroundAlpha?: number;
}

const ProjectsAurora = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<VantaEffect | null>(null);

  useEffect(() => {
    // Dynamically import THREE and Vanta
    const loadVanta = async () => {
      if (vantaRef.current && !vantaEffect.current) {
        // Import THREE first
        const THREE = await import('three');
        
        // Make THREE globally available for Vanta
        (window as any).THREE = THREE;
        
        // Import Vanta FOG effect
        await import('vanta/dist/vanta.fog.min');

        // Initialize Vanta effect with your custom settings
        vantaEffect.current = window.VANTA.FOG({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0xffffff,
          midtoneColor: 0xdbeafe,
          lowlightColor: 0x2b00ff,
          baseColor: 0xffffff,
          blurFactor: 0.4,
          speed: 0.55,
          zoom: 1.00,
          scale: 2.00,
          scaleMobile: 4.00,
          backgroundAlpha: 1.00
        });
      }
    };

    loadVanta();

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
};

export default ProjectsAurora;