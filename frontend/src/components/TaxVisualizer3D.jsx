import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';

function Bar({ position, height, color, label, value }) {
  const meshRef = useRef();
  const targetHeight = Math.max(height, 0.2);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // grow-in animation
      meshRef.current.scale.y += (targetHeight - meshRef.current.scale.y) * delta * 3;
      meshRef.current.position.y = meshRef.current.scale.y / 2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={[1, 0.01, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.28}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, targetHeight + 0.5, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {`₹${(value / 100000).toFixed(1)}L`}
      </Text>
    </group>
  );
}

export default function TaxVisualizer3D({ result }) {
  if (!result) return null;

  const { grossSalary, totalTax, netTakeHome } = result;

  const scale = useMemo(() => {
    const max = grossSalary;
    return {
      gross: (grossSalary / max) * 4,
      tax: (totalTax / max) * 4,
      take: (netTakeHome / max) * 4,
    };
  }, [grossSalary, totalTax, netTakeHome]);

  return (
    <div className="visualizer-3d" style={{ height: '360px', width: '100%', marginTop: '24px' }}>
      <Canvas camera={{ position: [4, 3, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
          <Bar position={[-1.5, 0, 0]} height={scale.take} color="#16a34a" label="Take-Home" value={netTakeHome} />
          <Bar position={[0, 0, 0]} height={scale.tax} color="#dc2626" label="Tax" value={totalTax} />
          <Bar position={[1.5, 0, 0]} height={scale.gross} color="#4f46e5" label="Gross" value={grossSalary} />
        </Float>

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={1.2}
        />
      </Canvas>
    </div>
  );
}