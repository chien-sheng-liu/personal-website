"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Animated wireframe globe */
function Globe() {
  const groupRef = useRef();

  const wireGeo = useMemo(() => new THREE.SphereGeometry(1.8, 36, 24), []);

  const rings = useMemo(() => {
    const lines = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      const pts = [];
      for (let lng = 0; lng <= 360; lng += 6) {
        const theta = lng * (Math.PI / 180);
        pts.push(
          new THREE.Vector3(
            1.81 * Math.sin(phi) * Math.cos(theta),
            1.81 * Math.cos(phi),
            1.81 * Math.sin(phi) * Math.sin(theta)
          )
        );
      }
      lines.push(pts);
    }
    for (let lng = 0; lng < 360; lng += 30) {
      const theta = lng * (Math.PI / 180);
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 6) {
        const phi = (90 - lat) * (Math.PI / 180);
        pts.push(
          new THREE.Vector3(
            1.81 * Math.sin(phi) * Math.cos(theta),
            1.81 * Math.cos(phi),
            1.81 * Math.sin(phi) * Math.sin(theta)
          )
        );
      }
      lines.push(pts);
    }
    return lines;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.15]}>
      <mesh geometry={wireGeo}>
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.18} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.78, 32, 24]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.6} />
      </mesh>

      {rings.map((pts, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]))}
              count={pts.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={i < 5 ? "#22d3ee" : "#a78bfa"}
            transparent
            opacity={0.25}
          />
        </line>
      ))}

      <mesh>
        <ringGeometry args={[1.82, 1.9, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function GlobeBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-80">
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Globe />
      </Canvas>
    </div>
  );
}
