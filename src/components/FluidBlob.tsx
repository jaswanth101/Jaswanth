import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// VERTEX SHADER — simplex noise displacement on torus knot geometry
// Creates organic fluid folds like a crumpled glass sculpture
// ─────────────────────────────────────────────────────────────────────────────
const vertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  varying vec3 vObjectNormal;
  varying float vFresnel;

  // ── Ashima Simplex 3D Noise ──────────────────────────────────────────────
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x  = x_ * ns.x + ns.yyyy;
    vec4 y  = y_ * ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vObjectNormal = normal;
    vNormal = normalize(normalMatrix * normal);

    // ── Multi-octave fluid displacement — slow large folds ───────────────
    float n1 = snoise(position * 0.8 + uTime * 0.12);          // macro shape
    float n2 = snoise(position * 1.8 + uTime * 0.20) * 0.45;   // medium ripple
    float n3 = snoise(position * 3.5 - uTime * 0.10) * 0.18;   // micro detail

    float noise = n1 + n2 + n3;
    float displacement = 0.22 * noise;

    vec3 displacedPosition = position + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    vPosition = displacedPosition;
    vViewPosition = -mvPosition.xyz;

    // Pre-compute Fresnel in vertex shader for varying interpolation
    vec3 vn = normalize(normalMatrix * normal);
    vec3 vv = normalize(-mvPosition.xyz);
    vFresnel = pow(1.0 - max(0.0, dot(vn, vv)), 2.2);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// FRAGMENT SHADER — pastel iridescent glass matching the reference image
//   • Mostly white/clear glass body (near-zero alpha at center)
//   • Soft pink → cyan → lavender → mint shimmer on edges
//   • Sharp white specular highlights on ridges and folds
//   • Dark rim for total-internal-reflection illusion
// ─────────────────────────────────────────────────────────────────────────────
const fragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  varying vec3 vObjectNormal;
  varying float vFresnel;

  // ── HSL → RGB ────────────────────────────────────────────────────────────
  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0*c.z - 1.0));
  }

  void main() {
    vec3 normal  = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float NdotV  = max(0.0, dot(normal, viewDir));
    float fresnel = vFresnel;

    // ── Thin-film iridescence — pastel soap-bubble palette ───────────────
    // Hue shifts driven by: object-space normal (rotates with mesh) + position + time
    float objPhase  = dot(vObjectNormal, vec3(0.5773));
    float posPhase  = vPosition.y * 1.2 + vPosition.x * 0.7 + vPosition.z * 0.5;
    float timeFlow  = uTime * 0.07;  // very slow drift

    // Primary hue — biased toward the pink/cyan/lavender range (0.5–0.95 cycle zone)
    float hue1 = fract(objPhase * 0.30 + posPhase * 0.10 + timeFlow + 0.55);

    // Secondary — chromatic split (double refraction offset)
    float hue2 = fract(hue1 + 0.22 + sin(posPhase * 0.6 + uTime * 0.05) * 0.15);

    // Tertiary — subsurface swirl (organic variation)
    float hue3 = fract(hue1 - 0.14 + cos(objPhase * 1.0 - uTime * 0.04) * 0.10);

    // Low saturation, high brightness → pastel glass look (not garish rainbow)
    vec3 col1 = hsl2rgb(vec3(hue1, 0.65, 0.78)); // soft pink / lavender
    vec3 col2 = hsl2rgb(vec3(hue2, 0.60, 0.82)); // soft cyan / mint
    vec3 col3 = hsl2rgb(vec3(hue3, 0.55, 0.80)); // soft violet / green

    // Blend layers based on surface position
    float blend12 = sin(vPosition.z * 1.8 + uTime * 0.06) * 0.5 + 0.5;
    float blend23 = cos(posPhase * 0.7 - uTime * 0.03) * 0.5 + 0.5;
    vec3 iridColor = mix(mix(col1, col2, blend12), col3, blend23 * 0.35);

    // ── White glass base — almost pure white, slightly cool ──────────────
    vec3 glassBase = vec3(0.97, 0.975, 1.0);

    // ── Dual specular highlights (ridge glints) ──────────────────────────
    vec3 reflectDir = reflect(-viewDir, normal);

    // Primary key light — sharp, white
    float keySpec  = pow(max(0.0, dot(reflectDir, normalize(vec3(0.5, 0.9, 0.6)))), 110.0);
    // Secondary fill — softer, warm
    float fillSpec = pow(max(0.0, dot(reflectDir, normalize(vec3(-0.6, 0.2, 0.5)))),  45.0);
    // Tertiary backlight — thin rim glow
    float rimSpec  = pow(max(0.0, dot(reflectDir, normalize(vec3(0.0, -0.8, 0.3)))),  30.0);

    float totalSpec = keySpec * 1.3 + fillSpec * 0.4 + rimSpec * 0.25;

    // ── Total internal reflection darkening at grazing edges ─────────────
    float darkRim = smoothstep(0.38, 0.0, NdotV);

    // ── Assemble final color ─────────────────────────────────────────────
    // Start with glass base, inject iridescence fresnel-weighted at edges
    vec3 finalColor = mix(glassBase, iridColor, fresnel * 0.68 + 0.03);

    // Darken rim for physical glass look (total internal reflection)
    finalColor = mix(finalColor, vec3(0.06, 0.05, 0.10), darkRim * 0.50);

    // Iridescent halo bloom at rim
    finalColor += iridColor * fresnel * 1.4;

    // Bright white specular highlights on ridges
    finalColor += vec3(1.0) * totalSpec * 1.0;

    // Subtle inner translucency glow (makes the body feel lit from within)
    float innerGlow = smoothstep(0.6, 1.0, NdotV) * 0.12;
    finalColor += vec3(0.94, 0.96, 1.0) * innerGlow;

    // ── Alpha — crystal clear center, glass body at edges ────────────────
    float alpha = mix(0.0, 0.88, fresnel * fresnel * 1.1);
    alpha = clamp(alpha, 0.0, 1.0);
    // Force opaque at bright specular hits so highlights fully pop
    alpha = max(alpha, totalSpec * 0.95);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const MyShaderMaterial = shaderMaterial(
  { uTime: 0 },
  vertexShader,
  fragmentShader
);

function BlobMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const material = useMemo(() => new MyShaderMaterial(), []);

  useFrame((state) => {
    const { clock } = state;
    const t = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }

    if (meshRef.current) {
      // ── Slow continuous 3-axis rotation — floats in space like a glass sculpture
      meshRef.current.rotation.y  = t * 0.10;                          // primary spin
      meshRef.current.rotation.x  = Math.sin(t * 0.07) * 0.35 + t * 0.04;  // gentle tilt oscillation
      meshRef.current.rotation.z  = Math.cos(t * 0.05) * 0.28 + t * 0.03;  // secondary wobble
    }
  });

  return (
    <mesh ref={meshRef} scale={1.0}>
      {/*
        TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q)
        p=2, q=3 → trefoil knot — the twisted ribbon shape from the reference image
        High segment count for smooth fluid surface
      */}
      <torusKnotGeometry args={[1.0, 0.42, 220, 32, 2, 3]} />
      <primitive
        object={material}
        ref={materialRef}
        attach="material"
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export default function FluidBlob() {
  return (
    <div className="w-[95vw] h-[95vw] max-w-[680px] max-h-[680px] relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 5, 4]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-3, -1, 3]} intensity={0.7} color="#e8f0ff" />
        <directionalLight position={[0, -4, -2]} intensity={0.4} color="#ffe8f8" />
        <BlobMesh />
      </Canvas>
    </div>
  );
}
