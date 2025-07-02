// src/components/STLViewer.jsx
import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

export default function STLViewer({ src = '/models/brain.stl' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ── Scene setup ─────────────────────────── */
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    /* ── Responsive sizing ───────────────────── */
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Lighting ────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(25, 50, 100).normalize();
    scene.add(light);

    /* ── Load STL ────────────────────────────── */
    const loader = new STLLoader();
    let mesh;

    loader.load(src, (geometry) => {
      const material = new THREE.MeshPhongMaterial({ color: 0xdddddd });
      mesh = new THREE.Mesh(geometry, material);

      geometry.computeBoundingBox();
      const { min, max } = geometry.boundingBox;
      mesh.position.set(
        -(min.x + max.x) / 2,
        -(min.y + max.y) / 2,
        -(min.z + max.z) / 2
      );
      mesh.rotation.x = -Math.PI / 2;

      scene.add(mesh);

      const size = Math.max(max.x - min.x, max.y - min.y, max.z - min.z);
      camera.position.set(0, 0, size * 2);
    });

    /* ── Animation ───────────────────────────── */
    let frameId;
    const animate = () => {
      if (mesh) mesh.rotation.z += 0.01;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    /* ── Cleanup ─────────────────────────────── */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [src]);

  /* ── Viewport container ───────────────────── */
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '400px', overflow: 'hidden' }}
    />
  );
}
