import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import { InteractionManager } from "three/addons/interaction/InteractionManager.js";
import { Badge, Button } from "@repo/ui";
import { m } from "~/lib/paraglide/messages";

const TEXTURE_SIZE = 512;

/**
 * This mounts as a real React root inside the texture source element, not a
 * static HTML string - the whole point of the native API is that the source
 * stays live DOM (interactive, accessible), so a real `@repo/ui` `Button`
 * with real state proves that survives being painted into the 3D texture.
 */
function TextureCard() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 bg-card p-12 text-card-foreground">
      <Badge className="self-start">{m.html_in_canvas_demo_badge()}</Badge>
      <h2 className="text-4xl font-bold">{m.html_in_canvas_demo_heading()}</h2>
      <p className="text-lg leading-relaxed text-muted-foreground">
        {m.html_in_canvas_demo_body()}
      </p>
      <Button
        size="lg"
        className="self-start"
        onClick={() => setCount((c) => c + 1)}
      >
        {m.html_in_canvas_demo_button_cta()}
      </Button>
      <p className="text-sm text-muted-foreground/70">
        {m.html_in_canvas_demo_button_count({ count })}
      </p>
    </div>
  );
}

function createTextureElement() {
  const element = document.createElement("div");
  element.style.width = `${TEXTURE_SIZE}px`;
  element.style.height = `${TEXTURE_SIZE}px`;
  return element;
}

/**
 * Renders a wobbling plane whose face is a live, Paraglide-translated DOM
 * element uploaded as a WebGL texture via THREE.HTMLTexture - the element
 * stays real (interactive, accessible), three.js just keeps re-painting it
 * into the texture on the browser's own paint events.
 *
 * A flat plane (not a cube) that stays mostly camera-facing is deliberate:
 * InteractionManager only tracks one geometry face, computing a per-frame
 * CSS matrix3d transform so the real element stays pixel-aligned with
 * wherever that face is currently drawn - a fully-spinning cube would only
 * be clickable on whichever side started facing the camera.
 */
export function ThreeHtmlTextureDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientWidth);
    // InteractionManager positions the real interactive element with
    // `position: absolute; left: 0; top: 0` relative to the canvas - without
    // this, the browser anchors that to the nearest positioned ancestor up
    // the page instead, and the click target ends up nowhere near the plane.
    renderer.domElement.style.position = "relative";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const directional = new THREE.DirectionalLight(0xffffff, 1.6);
    directional.position.set(2, 2, 3);
    scene.add(directional);

    const element = createTextureElement();
    const root = createRoot(element);
    root.render(<TextureCard />);

    const texture = new THREE.HTMLTexture(element);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
    const geometry = new THREE.PlaneGeometry(1.8, 1.8);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const interactions = new InteractionManager();
    interactions.connect(renderer, camera);
    interactions.add(mesh);

    let frame = 0;
    let raf = 0;
    let warned = false;
    const animate = () => {
      frame += 1;
      // Wobble, don't spin: stays within roughly +/-25deg on each axis so
      // the plane never turns edge-on or away from the camera, keeping
      // InteractionManager's single-face tracking valid at all times.
      mesh.rotation.y = Math.sin(frame * 0.012) * 0.45;
      mesh.rotation.x = Math.sin(frame * 0.008) * 0.2;
      interactions.update();
      try {
        renderer.render(scene, camera);
      } catch (err) {
        // three.js re-uploads the HTMLTexture on the frame right after it
        // first appends `element` to the canvas, but the browser produces
        // that element's "paint record" asynchronously - a render on an
        // early frame can race ahead of it and throw. The content here
        // never changes after mount, so once one upload lands, three clears
        // needsUpdate and stops retrying; skipping the losing frame(s) and
        // trying again next tick is enough to recover.
        if (!warned) {
          warned = true;
          console.warn(
            "HTML-in-Canvas texture upload not ready yet, retrying:",
            err,
          );
        }
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      interactions.remove(mesh);
      interactions.disconnect();
      root.unmount();
      texture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      element.remove();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-2xl border border-border"
    />
  );
}
