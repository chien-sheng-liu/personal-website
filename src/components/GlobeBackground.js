"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Wireframe globe that auto-rotates ── */
function Globe() {
  const groupRef = useRef();

  /* Sphere wireframe geometry */
  const wireGeo = useMemo(() => new THREE.SphereGeometry(1.8, 36, 24), []);

  /* Latitude / longitude rings for "map" feel */
  const rings = useMemo(() => {
    const lines = [];
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      const pts = [];
      for (let lng = 0; lng <= 360; lng += 5) {
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
    // Longitude lines
    for (let lng = 0; lng < 360; lng += 30) {
      const theta = lng * (Math.PI / 180);
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 5) {
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
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.1]}>
      {/* Core wireframe sphere */}
      <mesh geometry={wireGeo}>
        <meshBasicMaterial
          color="#0ea5e9"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Solid inner sphere */}
      <mesh>
        <sphereGeometry args={[1.78, 32, 24]} />
        <meshBasicMaterial
          color="#f1f5f9"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Lat/Lng grid lines */}
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
            color={i < 5 ? "#0ea5e9" : "#6366f1"}
            transparent
            opacity={0.1}
          />
        </line>
      ))}

      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[1.82, 1.88, 64]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function GlobeBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-70">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Globe />
      </Canvas>
    </div>
  );
}
