'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Button } from '@/components/ui/button';

interface Dice3DProps {
  onRollComplete: (result: number) => void;
  disabled?: boolean;
}

export default function Dice3D({ onRollComplete, disabled = false }: Dice3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  // Three.jsとCannon.jsの参照
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const worldRef = useRef<CANNON.World | null>(null);
  const diceBodyRef = useRef<CANNON.Body | null>(null);
  const diceMeshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Three.jsのセットアップ
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a472a); // 緑のテーブルと同じ色
    sceneRef.current = scene;

    // Orthographicカメラ（真上から見下ろす、確実にサイコロが見える）
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const frustumSize = 6;
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(2, 8, 2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera as any;

    // レンダラー
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Cannon.jsの物理世界
    const world = new CANNON.World();
    world.gravity.set(0, -20, 0); // 適度な重力でしっかり転がる
    worldRef.current = world;

    // 床（物理）
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({ mass: 0 });
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    // 床の材質（反発係数と摩擦を設定）
    const floorMaterial = new CANNON.Material('floor');
    floorBody.material = floorMaterial;

    world.addBody(floorBody);

    // 壁を追加してサイコロが画面外に出ないようにする
    const wallMaterial = new CANNON.Material('wall');
    const wallSize = 2.5;

    // 4つの壁
    const walls = [
      { pos: [wallSize, 2, 0], rot: [0, Math.PI / 2, 0] }, // 右
      { pos: [-wallSize, 2, 0], rot: [0, -Math.PI / 2, 0] }, // 左
      { pos: [0, 2, wallSize], rot: [0, 0, 0] }, // 前
      { pos: [0, 2, -wallSize], rot: [0, Math.PI, 0] }, // 後
    ];

    walls.forEach(({ pos, rot }) => {
      const wallShape = new CANNON.Plane();
      const wallBody = new CANNON.Body({ mass: 0 });
      wallBody.addShape(wallShape);
      wallBody.position.set(pos[0], pos[1], pos[2]);
      wallBody.quaternion.setFromEuler(rot[0], rot[1], rot[2]);
      wallBody.material = wallMaterial;
      world.addBody(wallBody);
    });

    // 床（視覚）- コンパクトなテーブル
    const floorGeometry = new THREE.PlaneGeometry(6, 6);
    const floorMeshMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a472a,
      roughness: 0.8
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMeshMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // サイコロの作成
    createDice();

    // アニメーションループ
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (worldRef.current && diceMeshRef.current && diceBodyRef.current) {
        // 物理演算を更新
        worldRef.current.step(1 / 60);

        // サイコロのメッシュを物理ボディと同期
        diceMeshRef.current.position.copy(diceBodyRef.current.position as any);
        diceMeshRef.current.quaternion.copy(diceBodyRef.current.quaternion as any);

        // サイコロの速度チェック（停止判定）
        // isRollingはstateなので、useRefで管理する
        const velocity = diceBodyRef.current.velocity;
        const angularVelocity = diceBodyRef.current.angularVelocity;
        const speed = Math.sqrt(
          velocity.x * velocity.x +
          velocity.y * velocity.y +
          velocity.z * velocity.z
        );
        const angularSpeed = Math.sqrt(
          angularVelocity.x * angularVelocity.x +
          angularVelocity.y * angularVelocity.y +
          angularVelocity.z * angularVelocity.z
        );

        // 速度が十分に遅くなり、床の上にあったら停止と判定
        if (speed < 0.05 && angularSpeed < 0.05 && diceBodyRef.current.position.y < 1.5 && diceBodyRef.current.position.y > 0.5) {
          // 速度を完全に止める
          diceBodyRef.current.velocity.set(0, 0, 0);
          diceBodyRef.current.angularVelocity.set(0, 0, 0);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // クリーンアップ
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const createDice = () => {
    if (!sceneRef.current || !worldRef.current) return;

    // サイコロのジオメトリ（大きく見やすく）
    const diceSize = 1.5;
    const geometry = new THREE.BoxGeometry(diceSize, diceSize, diceSize);

    // サイコロの面のマテリアル（1-6の目）
    const materials = [
      createDiceFaceMaterial(1), // 右
      createDiceFaceMaterial(6), // 左
      createDiceFaceMaterial(2), // 上
      createDiceFaceMaterial(5), // 下
      createDiceFaceMaterial(3), // 前
      createDiceFaceMaterial(4), // 後
    ];

    const diceMesh = new THREE.Mesh(geometry, materials);
    diceMesh.castShadow = true;
    diceMesh.position.set(0, -100, 0); // 初期状態は画面外
    sceneRef.current.add(diceMesh);
    diceMeshRef.current = diceMesh;

    // 物理ボディ
    const shape = new CANNON.Box(new CANNON.Vec3(diceSize / 2, diceSize / 2, diceSize / 2));

    // サイコロの材質
    const diceMaterial = new CANNON.Material('dice');
    const body = new CANNON.Body({
      mass: 1,
      shape: shape,
      position: new CANNON.Vec3(0, -100, 0), // 初期状態は画面外
      linearDamping: 0.3,
      angularDamping: 0.3,
      material: diceMaterial,
    });

    // 床とサイコロの接触材質を設定（反発と摩擦）
    const floorMaterial = new CANNON.Material('floor');
    const contactMaterial = new CANNON.ContactMaterial(floorMaterial, diceMaterial, {
      friction: 0.5, // 摩擦係数（適度に転がる）
      restitution: 0.3, // 反発係数（適度にバウンドする）
    });
    worldRef.current.addContactMaterial(contactMaterial);

    worldRef.current.addBody(body);
    diceBodyRef.current = body;
  };

  const createDiceFaceMaterial = (number: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // 背景（白）
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 256);

    // 枠
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 256, 256);

    // 目（黒い円）
    ctx.fillStyle = '#000000';
    const dotSize = 20;
    const positions = getDotPositions(number);

    positions.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ map: texture });
  };

  const getDotPositions = (number: number): [number, number][] => {
    const center = 128;
    const offset = 50;

    const positions: Record<number, [number, number][]> = {
      1: [[center, center]],
      2: [[center - offset, center - offset], [center + offset, center + offset]],
      3: [[center - offset, center - offset], [center, center], [center + offset, center + offset]],
      4: [
        [center - offset, center - offset],
        [center + offset, center - offset],
        [center - offset, center + offset],
        [center + offset, center + offset],
      ],
      5: [
        [center - offset, center - offset],
        [center + offset, center - offset],
        [center, center],
        [center - offset, center + offset],
        [center + offset, center + offset],
      ],
      6: [
        [center - offset, center - offset],
        [center + offset, center - offset],
        [center - offset, center],
        [center + offset, center],
        [center - offset, center + offset],
        [center + offset, center + offset],
      ],
    };

    return positions[number] || [];
  };

  const rollDice = () => {
    if (isRolling || disabled || !diceBodyRef.current) return;

    setIsRolling(true);
    setResult(null);

    // サイコロをリセット（中央上部から投げる）
    diceBodyRef.current.position.set(
      (Math.random() - 0.5) * 0.3, // 横方向のランダム性を最小限に
      3, // 高めの位置から
      (Math.random() - 0.5) * 0.3
    );

    // ランダムな初速度を与える
    diceBodyRef.current.velocity.set(
      (Math.random() - 0.5) * 2, // 水平方向の速度を抑える
      0, // 上向きには投げない（落とすだけ）
      (Math.random() - 0.5) * 2
    );

    diceBodyRef.current.angularVelocity.set(
      (Math.random() - 0.5) * 20, // 回転速度
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );

    // 2.5秒後に結果を判定
    setTimeout(() => {
      if (diceBodyRef.current) {
        diceBodyRef.current.velocity.set(0, 0, 0);
        diceBodyRef.current.angularVelocity.set(0, 0, 0);
      }
      const diceResult = getDiceResult();
      setResult(diceResult);
      setIsRolling(false);
      onRollComplete(diceResult);
    }, 2500);
  };

  const getDiceResult = (): number => {
    if (!diceMeshRef.current) return 1;

    // サイコロの上面を判定
    const upVector = new THREE.Vector3(0, 1, 0);
    const faces = [
      { face: 1, normal: new THREE.Vector3(1, 0, 0) },   // 右
      { face: 6, normal: new THREE.Vector3(-1, 0, 0) },  // 左
      { face: 2, normal: new THREE.Vector3(0, 1, 0) },   // 上
      { face: 5, normal: new THREE.Vector3(0, -1, 0) },  // 下
      { face: 3, normal: new THREE.Vector3(0, 0, 1) },   // 前
      { face: 4, normal: new THREE.Vector3(0, 0, -1) },  // 後
    ];

    let maxDot = -1;
    let resultFace = 1;

    faces.forEach(({ face, normal }) => {
      const worldNormal = normal.clone().applyQuaternion(diceMeshRef.current!.quaternion);
      const dot = worldNormal.dot(upVector);
      if (dot > maxDot) {
        maxDot = dot;
        resultFace = face;
      }
    });

    return resultFace;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* ボタン - 最上部に配置 */}
      <Button
        onClick={rollDice}
        disabled={isRolling || disabled}
        size="lg"
        className="touch-target text-2xl font-bold px-12 py-6 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 text-white shadow-2xl transform transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-yellow-400"
      >
        🎲 サイコロを振る
      </Button>

      {/* 3Dビューポート */}
      <div
        ref={containerRef}
        className="relative border-4 border-amber-700 rounded-lg shadow-2xl"
        style={{ width: '300px', height: '250px' }}
      />

      {/* 結果表示 */}
      {result !== null && !isRolling && (
        <div className="animate-fade-in">
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white px-8 py-4 rounded-xl shadow-xl border-4 border-yellow-400">
            <p className="text-2xl font-bold">
              🎯 {result}マス進む！
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
