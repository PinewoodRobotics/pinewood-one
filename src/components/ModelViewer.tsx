"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Group, Object3D, Mesh } from "three";

function Model({
  url,
  scrollProgress = 0,
  keyframeValues,
  onLoaded,
}: {
  url: string;
  scrollProgress?: number;
  keyframeValues?: number[];
  onLoaded?: () => void;
}) {
  const groupRef = useRef<Group>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial values from the first keyframe in page.tsx
  const initialPosition = [0, -2, 0] as [number, number, number]; // Type assertion
  const initialRotation = [-Math.PI / 2 + 0.3, 0, Math.PI * 0.75] as [
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

  // Load GLTF model
  const { scene } = useGLTF(url);

  // Track if we've already called onLoaded
  const loadedCallbackFired = useRef(false);

  useEffect(() => {
    if (scene && !loadedCallbackFired.current) {
      console.log("GLB model loaded successfully");
      setIsLoaded(true);

      // Only call onLoaded once
      if (onLoaded && !loadedCallbackFired.current) {
        onLoaded();
        loadedCallbackFired.current = true;
      }

      // Log scrollProgress to prevent unused variable warning
      if (scrollProgress !== undefined) {
        console.log("Model initialized with scrollProgress:", scrollProgress);
      }
    }
  }, [scene, onLoaded, scrollProgress]);

  // Easing function
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  useFrame(() => {
    if (!groupRef.current) return;

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
      groupRef.current.rotation.set(
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
      groupRef.current.position.set(
        keyframeValues[0],
        keyframeValues[1],
        keyframeValues[2]
      );

      // Rotation (maintain the -Math.PI/2 base rotation on X axis)
      groupRef.current.rotation.set(
        -Math.PI / 2 + keyframeValues[3],
        keyframeValues[4],
        keyframeValues[5]
      );
    }
  });

  // Apply material to all meshes in the scene
  useEffect(() => {
    if (scene) {
      scene.traverse((child: Object3D) => {
        if (child instanceof Mesh) {
          // Preserve original materials instead of replacing them
          // Just add shadow properties
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return (
    <group
      ref={groupRef}
      rotation={initialRotation}
      position={initialPosition}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
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
    <div className="relative w-full h-full">
      <Canvas shadows>
        {/* Fixed camera position with logged values */}
        <PerspectiveCamera
          makeDefault
          position={effectiveCameraPos}
          fov={40}
          zoom={cameraDistance}
        />

        {/* Lights */}
        <ambientLight intensity={1} />
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
    </div>
  );
}
