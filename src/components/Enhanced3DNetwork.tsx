'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Html } from '@react-three/drei';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Segment, SWOTResponse } from '@/types';
import { PROMPT_TYPES } from '@/lib/constants';
import * as THREE from 'three';

interface Enhanced3DNetworkProps {
  segments: Segment[];
  responses: SWOTResponse[];
  selectedUsers?: string[];
  onUserSelect?: (userId: string) => void;
}

// Animated sphere component
function AnimatedSphere({ 
  position, 
  color, 
  size, 
  label, 
  onClick, 
  isSelected = false 
}: {
  position: [number, number, number];
  color: string;
  size: number;
  label: string;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={isSelected ? '#ff6b6b' : color} 
          transparent 
          opacity={hovered ? 0.9 : 0.7}
          emissive={isSelected ? '#ff3333' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </Sphere>
      {(hovered || isSelected) && (
        <Html distanceFactor={10}>
          <div className="bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color={isSelected ? '#ff6b6b' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// Connection lines between nodes
function ConnectionLine({ 
  start, 
  end, 
  strength = 1 
}: {
  start: [number, number, number];
  end: [number, number, number];
  strength?: number;
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry, 
      new THREE.LineBasicMaterial({ 
        color: `hsl(${strength * 120}, 70%, 50%)`,
        transparent: true,
        opacity: 0.3 + strength * 0.4
      })
    )} />
  );
}

// Main 3D scene
function Network3DScene({ 
  segments, 
  responses, 
  selectedUsers = [], 
  onUserSelect 
}: Enhanced3DNetworkProps) {
  const [autoRotate, setAutoRotate] = useState(true);

  // Generate positions for segments in 3D space
  const getSegmentPosition = (index: number, total: number): [number, number, number] => {
    const radius = 4;
    const angle = (index / total) * Math.PI * 2;
    const height = (index % 2) * 2 - 1;
    return [
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    ];
  };

  // Generate insight positions around each segment
  const getInsightPositions = (segmentPos: [number, number, number], segmentId: string) => {
    const segmentResponses = responses.filter(r => r.segmentId === segmentId);
    return segmentResponses.map((response, index) => {
      const angle = (index / segmentResponses.length) * Math.PI * 2;
      const radius = 1.5;
      return [
        segmentPos[0] + Math.cos(angle) * radius,
        segmentPos[1] + Math.sin(angle * 0.5) * 0.5,
        segmentPos[2] + Math.sin(angle) * radius
      ] as [number, number, number];
    });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
      
      <OrbitControls enablePan enableZoom enableRotate autoRotate={autoRotate} />
      
      {/* Render segments */}
      {segments.map((segment, index) => {
        const position = getSegmentPosition(index, segments.length);
        const segmentResponses = responses.filter(r => r.segmentId === segment.id);
        const completionRate = segmentResponses.length / PROMPT_TYPES.length;
        const isSelected = selectedUsers.includes(segment.id);
        
        return (
          <group key={segment.id}>
            <AnimatedSphere
              position={position}
              color={`hsl(${200 + index * 60}, 70%, ${50 + completionRate * 30}%)`}
              size={0.3 + completionRate * 0.4}
              label={segment.name}
              onClick={() => onUserSelect?.(segment.id)}
              isSelected={isSelected}
            />
            
            {/* Render insights around segment */}
            {getInsightPositions(position, segment.id).map((insightPos, insightIndex) => {
              const response = segmentResponses[insightIndex];
              const promptType = PROMPT_TYPES.find(pt => pt.id === response.promptTypeId);
              
              return (
                <group key={`${segment.id}-${insightIndex}`}>
                  <AnimatedSphere
                    position={insightPos}
                    color={`hsl(${30 + insightIndex * 40}, 60%, 60%)`}
                    size={0.1}
                    label={promptType?.name || 'Insight'}
                  />
                  <ConnectionLine
                    start={position}
                    end={insightPos}
                    strength={completionRate}
                  />
                </group>
              );
            })}
          </group>
        );
      })}
      
      {/* Connect related segments */}
      {segments.map((segment1, i) => 
        segments.slice(i + 1).map((segment2, j) => {
          const pos1 = getSegmentPosition(i, segments.length);
          const pos2 = getSegmentPosition(i + j + 1, segments.length);
          const responses1 = responses.filter(r => r.segmentId === segment1.id);
          const responses2 = responses.filter(r => r.segmentId === segment2.id);
          
          // Calculate similarity based on shared prompt types
          const sharedPrompts = responses1.filter(r1 => 
            responses2.some(r2 => r2.promptTypeId === r1.promptTypeId)
          ).length;
          const maxPrompts = Math.max(responses1.length, responses2.length);
          const similarity = maxPrompts > 0 ? sharedPrompts / maxPrompts : 0;
          
          if (similarity > 0.3) {
            return (
              <ConnectionLine
                key={`${segment1.id}-${segment2.id}`}
                start={pos1}
                end={pos2}
                strength={similarity}
              />
            );
          }
          return null;
        })
      )}
    </>
  );
}

export function Enhanced3DNetwork({ 
  segments, 
  responses, 
  selectedUsers = [], 
  onUserSelect 
}: Enhanced3DNetworkProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState([1]);

  if (segments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3D Network Visualization</CardTitle>
          <CardDescription>
            Interactive 3D visualization of segment relationships and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <p>Select segments to see 3D network visualization</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enhanced 3D Network</CardTitle>
            <CardDescription>
              Interactive 3D visualization with {responses.length} insights across {segments.length} segments
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs">Auto Rotate:</span>
              <Switch checked={autoRotate} onCheckedChange={setAutoRotate} />
            </div>
            <Badge variant="outline">
              {selectedUsers.length} selected
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] border rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
          <Canvas camera={{ position: [8, 8, 8], fov: 60 }}>
            <Suspense fallback={null}>
              <Network3DScene
                segments={segments}
                responses={responses}
                selectedUsers={selectedUsers}
                onUserSelect={onUserSelect}
              />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Controls */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Animation Speed:</span>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              max={3}
              min={0.1}
              step={0.1}
              className="flex-1 max-w-32"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Segments
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              Insights
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              High Similarity
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              Selected
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
