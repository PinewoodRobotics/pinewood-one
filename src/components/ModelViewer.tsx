"use client";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import {
  MeshStandardMaterial,
  Vector3,
  Mesh,
  PerspectiveCamera as ThreePerspectiveCamera,
} from "three";

function Model({
  url,
  scrollProgress = 0,
  keyframeValues,
}: {
  url: string;
  scrollProgress?: number;
  keyframeValues?: number[];
}) {
  const meshRef = useRef<Mesh>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(0.01);
  const [rotation, setRotation] = useState(0);
  const animationComplete = useRef(false);
  const animationProgress = useRef(0);
  const finalAnimationRotation = useRef(0);

  // Get initial position from first keyframe if available
  const initialPosition =
    keyframeValues && keyframeValues.length >= 3
      ? [keyframeValues[0], keyframeValues[1], keyframeValues[2]]
      : [0, -0.5, 0];

  // Animation constants
  const targetScale = 3;
  const targetRotation = Math.PI * 2; // 360 degrees
  const animationDuration = 120; // frames

  const geometry = useLoader(STLLoader, url);

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
      const currentRotation = targetRotation * easedProgress;
      setRotation(currentRotation);

      // Store the final rotation when animation completes
      if (animationProgress.current >= 1) {
        finalAnimationRotation.current = currentRotation;
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

  // Calculate model position based on keyframe values
  let modelPosition = initialPosition;

  // Initialize model rotation
  let modelRotation = [-Math.PI / 2, 0, rotation];

  // After animation completes, use keyframe values for position and rotation if available
  if (
    animationComplete.current &&
    keyframeValues &&
    keyframeValues.length >= 6
  ) {
    // Use keyframe values directly for position
    modelPosition = [keyframeValues[0], keyframeValues[1], keyframeValues[2]];

    modelRotation = [
      -Math.PI / 2 + keyframeValues[3],
      keyframeValues[4],
      finalAnimationRotation.current + keyframeValues[5],
    ];
  } else if (animationComplete.current) {
    // Use scroll-based rotation only
    modelRotation = [
      -Math.PI / 2,
      0,
      finalAnimationRotation.current + scrollProgress * Math.PI,
    ];
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={modelRotation}
      position={modelPosition}
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
}

export default function ModelViewer({
  modelUrl,
  cameraPosition = [-20, 3, 10],
  cameraDistance = 3,
  scrollProgress = 0,
  keyframeValues,
}: ModelViewerProps) {
  return (
    <Canvas shadows>
      {/* Fixed camera position */}
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
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
