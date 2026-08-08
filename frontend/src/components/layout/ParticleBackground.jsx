import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';

export default function ParticleBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Sparkles
          count={60}
          scale={[14, 8, 6]}
          size={4}
          speed={0.15}
          opacity={isDark ? 0.5 : 0.35}
          color={isDark ? '#D9A85C' : '#B8863B'}
        />
        <Sparkles
          count={30}
          scale={[14, 8, 6]}
          size={3}
          speed={0.1}
          opacity={isDark ? 0.3 : 0.2}
          color={isDark ? '#F3F1E8' : '#14203D'}
        />
      </Canvas>
    </div>
  );
}