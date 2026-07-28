import * as THREE from "three";

/**
 * 3D səhnənin verilən nöqtədən 360 dərəcəlik Equirectangular panorama şəklini (renderini) GPU vasitəsilə çıxarır.
 * 
 * @param renderer Mövcud WebGLRenderer instance-ı
 * @param scene Mövcud Three.js Scene instance-ı
 * @param position Renderin alınacağı yerin mövqeyi (məs. Kamera obyekti)
 * @param resolution Çıxış şəklini eni (hündürlük enin yarısı olacaq, məs. 2048x1024)
 * @returns Şəklin Data URL-i (base64 JPEG)
 */
export async function export360Panorama(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  position: THREE.Vector3 | { x: number; y: number; z: number },
  resolution: number = 2048
): Promise<string> {
  const cubeRes = resolution / 2; // Hər kub üzü üçün en/hündürlük
  
  // 1. Cubemap Render Target-i qururuq
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(cubeRes, {
    format: THREE.RGBAFormat,
    generateMipmaps: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    colorSpace: THREE.SRGBColorSpace
  });

  // 2. CubeCamera-nı qururuq və mövqeyini təyin edirik
  const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
  cubeCamera.position.set(position.x, position.y, position.z);
  scene.add(cubeCamera);

  // 3. Grid, köməkçi xətlər, transform idarələri və kameraları müvəqqəti gizlədirik
  const invisibleTargets: THREE.Object3D[] = [];
  scene.traverse((child) => {
    if (
      child.name === "grid" ||
      child.type === "Line" ||
      child.type === "GridHelper" ||
      child.type === "TransformControls" ||
      child.name.toLowerCase().includes("helper") ||
      child.name.toLowerCase().includes("kamera") || // 360 kameraları gizlət
      (child.userData && child.userData.isHelper)
    ) {
      if (child.visible) {
        child.visible = false;
        invisibleTargets.push(child);
      }
    }
  });

  // 4. Cubemap-i render edirik
  cubeCamera.update(renderer, scene);

  // Gizlədilmiş obyektləri yenidən görünən edirik
  invisibleTargets.forEach((obj) => {
    obj.visible = true;
  });

  // 5. Equirectangular Shader-i və müvəqqəti səhnəni hazırlayırıq
  const width = resolution;
  const height = resolution / 2;
  
  const equirectRenderTarget = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    colorSpace: THREE.SRGBColorSpace
  });

  const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: cubeRenderTarget.texture }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform samplerCube map;
      varying vec2 vUv;
      #define PI 3.141592653589793
      void main() {
        // UV koordinatlarını sferik bucaqlara (boylam və enlem) çeviririk
        float longitude = (vUv.x - 0.5) * 2.0 * PI;
        float latitude = (vUv.y - 0.5) * PI;

        // Sferik koordinatlardan 3D istiqamət vektorunu tapırıq
        vec3 dir;
        dir.x = cos(latitude) * sin(longitude);
        dir.y = sin(latitude);
        dir.z = cos(latitude) * cos(longitude);

        // Cubemap-dən həmin istiqamətdəki rəngi oxuyuruq
        gl_FragColor = textureCube(map, dir);
      }
    `,
    depthWrite: false,
    depthTest: false
  });

  const tempScene = new THREE.Scene();
  const quadMesh = new THREE.Mesh(quadGeometry, shaderMaterial);
  tempScene.add(quadMesh);

  // 6. Shader vasitəsilə 2D Equirectangular görüntünü render edirik
  const prevRenderTarget = renderer.getRenderTarget();
  renderer.setRenderTarget(equirectRenderTarget);
  renderer.render(tempScene, orthoCamera);
  renderer.setRenderTarget(prevRenderTarget);

  // 7. Pikselləri buffer-ə oxuyub Canvas üzərində çəkirik
  const buffer = new Uint8Array(width * height * 4);
  renderer.readRenderTargetPixels(equirectRenderTarget, 0, 0, width, height, buffer);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const imageData = ctx.createImageData(width, height);
    // Şəklin şaquli istiqamətdə tərs çevrilməsinin (flip) qarşısını almaq üçün sətirləri tərsinə kopyalayırıq
    for (let y = 0; y < height; y++) {
      const sourceRow = height - 1 - y;
      for (let x = 0; x < width; x++) {
        const targetIdx = (y * width + x) * 4;
        const sourceIdx = (sourceRow * width + x) * 4;
        imageData.data[targetIdx] = buffer[sourceIdx];
        imageData.data[targetIdx + 1] = buffer[sourceIdx + 1];
        imageData.data[targetIdx + 2] = buffer[sourceIdx + 2];
        imageData.data[targetIdx + 3] = buffer[sourceIdx + 3];
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // 8. Təmizlik (Memory leak olmasın deyə resursları boşaldırıq)
  cubeRenderTarget.dispose();
  equirectRenderTarget.dispose();
  quadGeometry.dispose();
  shaderMaterial.dispose();
  scene.remove(cubeCamera);

  // JPEG kimi base64 şəklində qaytarırıq (keyfiyyət 95%)
  return canvas.toDataURL("image/jpeg", 0.95);
}
