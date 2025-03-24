"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

interface ModelProps {
  model_path: string;
  scale: number;
  position_scene: [number, number, number];
  rotation_x: number;
  rotation_y: number;
  rotation_z: number;
  is_interactive: boolean;
  light_position: [number, number, number];
  className: string;
}

export function Model({
  model_path,
  scale = 1,
  position_scene = [0, 0, 0],
  rotation_x = 0,
  rotation_y = 0,
  rotation_z = 0,
  is_interactive = false,
  light_position = [10, 10, 10],
  className = "",
}: ModelProps) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(model_path);

  return (
    <Canvas
      className={className}
      style={{ pointerEvents: is_interactive ? "auto" : "none" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={light_position} />
      <Suspense fallback={null}>
        <primitive
          ref={ref}
          object={scene}
          scale={scale}
          position={position_scene}
          rotation={[rotation_x, rotation_y, rotation_z]}
        />
      </Suspense>
      {is_interactive && <OrbitControls />}
    </Canvas>
  );
}
