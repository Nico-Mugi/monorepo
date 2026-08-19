/**
 * `THREE.HTMLTexture` ships as a real export in three@0.185 (see
 * node_modules/three/src/textures/HTMLTexture.js) but @types/three hasn't
 * caught up yet - this augments the module by hand until it does.
 */
import type { Texture } from "three";

declare module "three" {
  export class HTMLTexture extends Texture {
    constructor(element?: HTMLElement);
  }
}

export {};
