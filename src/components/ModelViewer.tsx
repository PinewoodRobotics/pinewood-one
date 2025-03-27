"use client";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { MeshStandardMaterial, Mesh } from "three";

function Model({
  url,
  scrollProgress = 0, // Keep this parameter
  keyframeValues,
  onLoaded,
}: {
  url: string;
  scrollProgress?: number;
  keyframeValues?: number[];
  onLoaded?: () => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial values from the first keyframe in page.tsx
  const initialPosition = [0, -2, 0] as [number, number, number]; // Type assertion
  const initialRotation = [-Math.PI / 2, 0, Math.PI / 2 - 0.7] as [
    number,
    number,
    number
  ]; // Type assertion

  // Start with a small scale and animate to full size
  const [scale, setScale] = useState(0.01);
  const targetScale = 3;

  // Animation state
  const animationComplete = useRef(false);
  const animationProgress = useRef(0);
  const animationDuration = 90; // frames

  // Initial rotation value for animation
  const initialYRotation = useRef(0);

  const geometry = useLoader(STLLoader, url);

  useEffect(() => {
    console.log("STL geometry loaded successfully");
    setIsLoaded(true);
    if (onLoaded) {
      onLoaded();
    }

    // Log scrollProgress to prevent unused variable warning
    if (scrollProgress !== undefined) {
      console.log("Model initialized with scrollProgress:", scrollProgress);
    }
  }, [geometry, onLoaded, scrollProgress]);

  // Easing function
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  useFrame(() => {
    if (!meshRef.current) return;

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

      // Add a 360° rotation on Y axis during the opening animation
      const rotationAmount = Math.PI * 2 * easedProgress; // 0 to 2π (360°)
      initialYRotation.current = rotationAmount;

      // Apply the opening animation rotation
      meshRef.current.rotation.set(
        initialRotation[0],
        initialRotation[1],
        initialRotation[2] + rotationAmount
      );

      // Mark animation as complete when done
      if (animationProgress.current >= 1) {
        animationComplete.current = true;
      }
    } else if (
      animationComplete.current &&
      keyframeValues &&
      keyframeValues.length >= 6
    ) {
      // After opening animation is complete, apply scroll-based keyframe values

      // Position
      meshRef.current.position.set(
        keyframeValues[0],
        keyframeValues[1],
        keyframeValues[2]
      );

      // Rotation (maintain the -Math.PI/2 base rotation on X axis)
      meshRef.current.rotation.set(
        -Math.PI / 2 + keyframeValues[3],
        keyframeValues[4],
        keyframeValues[5]
      );
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
      rotation={initialRotation}
      position={initialPosition}
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
  scrollProgress?: number;
  keyframeValues?: number[];
  onLoaded?: () => void;
}

export default function ModelViewer({
  modelUrl,
  cameraPosition = [0, 0, 10], // Move camera back on Z axis
  cameraDistance = 3,
  scrollProgress = 0,
  keyframeValues,
  onLoaded,
}: ModelViewerProps) {
  // Add a state to track camera position
  const [effectiveCameraPos, setEffectiveCameraPos] = useState(cameraPosition);

  // Use effect to update camera position when props change
  useEffect(() => {
    console.log("Camera position set to:", cameraPosition);
    setEffectiveCameraPos(cameraPosition);
  }, [cameraPosition]);

  return (
    <Canvas shadows>
      {/* Fixed camera position with logged values */}
      <PerspectiveCamera
        makeDefault
        position={effectiveCameraPos}
        fov={40}
        zoom={cameraDistance}
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
        <Model
          url={modelUrl}
          scrollProgress={scrollProgress}
          keyframeValues={keyframeValues}
          onLoaded={onLoaded}
        />
      </Suspense>

      {/* Disable controls to prevent any interference */}
      <OrbitControls
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
