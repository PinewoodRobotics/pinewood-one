"use client";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import {
  MeshStandardMaterial,
  Vector3,
  Mesh,
  PerspectiveCamera as ThreePerspectiveCamera,
} from "three";

function Model({ url }: { url: string }) {
  const meshRef = useRef<Mesh>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(0.01);
  const [rotation, setRotation] = useState(0);
  const animationComplete = useRef(false);
  const animationProgress = useRef(0);

  // Animation constants
  const targetScale = 1;
  const targetRotation = Math.PI * 2; // 360 degrees
  const animationDuration = 120; // frames

  const geometry = useLoader(
    STLLoader,
    url,
    () => {
      console.log("STL loader initialized");
    },
    (error) => {
      console.warn("Non-fatal STL loading issue:", error);
      return null;
    }
  );

  useEffect(() => {
    console.log("STL geometry loaded successfully");
    setIsLoaded(true);
  }, [geometry]);

  // Easing function (ease-out cubic)
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  useFrame(() => {
    if (isLoaded && !animationComplete.current) {
      // Update animation progress
      animationProgress.current = Math.min(
        animationProgress.current + 1 / animationDuration,
        1
      );

      // Apply easing to the progress
      const easedProgress = easeOutCubic(animationProgress.current);

      // Update scale with easing
      setScale(0.01 + (targetScale - 0.01) * easedProgress);

      // Update rotation with easing
      setRotation(targetRotation * easedProgress);

      // Check if animation is complete
      if (animationProgress.current >= 1) {
        animationComplete.current = true;
      }
    }
  });

  const material = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.3,
    emissive: 0x111111,
    flatShading: false,
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, rotation]} // Y-axis rotation is applied to Z in this orientation
      position={[0, -0.5, 0]}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
}

interface ModelViewerProps {
  modelUrl: string;
  cameraPosition?: [number, number, number];
  cameraDistance?: number;
}

export default function ModelViewer({
  modelUrl,
  cameraPosition = [-20, 3, 10],
  cameraDistance,
}: ModelViewerProps) {
  const cameraRef = useRef<ThreePerspectiveCamera>(null);
  const [isReady, setIsReady] = useState(false);
  const initialPositionRef = useRef(cameraPosition);

  // Pre-calculate the correct camera position before rendering
  useEffect(() => {
    if (cameraDistance) {
      const direction = new Vector3(
        cameraPosition[0],
        cameraPosition[1],
        cameraPosition[2]
      ).normalize();

      const newPosition: [number, number, number] = [
        direction.x * cameraDistance,
        direction.y * cameraDistance,
        direction.z * cameraDistance,
      ];

      initialPositionRef.current = newPosition;
      setIsReady(true);
    } else {
      setIsReady(true);
    }
  }, [cameraPosition, cameraDistance]);

  // If not ready, show a loading state or nothing
  if (!isReady) {
    return <div className="w-full h-full bg-black" />;
  }

  return (
    <Canvas shadows>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={initialPositionRef.current}
        fov={40}
      />

      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />
      <pointLight position={[0, 5, -5]} intensity={0.5} color="#ffffff" />

      <Suspense fallback={null}>
        <Model url={modelUrl} />
      </Suspense>
      <OrbitControls
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
