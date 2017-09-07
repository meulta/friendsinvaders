import * as BABYLON from 'babylonjs'
import { HeadController } from './headController'
import { Direction, Action } from '../types'

export class Game {

    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;
    private controller: HeadController;
    private spaceship: BABYLON.Mesh;

    constructor(canvas: HTMLCanvasElement, controller: HeadController) {
        this.canvas = canvas;
        this.controller = controller;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.createScene();
        this.initGameVisuals();
    }

    public start() {
        this.controller.start();
        
        this.engine.runRenderLoop(() => {
            switch(this.controller.direction){
                case Direction.Left:
                    this.spaceship.position.x -= 0.02;
                break;
                case Direction.Right:
                    this.spaceship.position.x += 0.02;
                    break;
            }

            this.scene.render();
        });
    }

    public stop() {
        this.controller.stop();
        this.engine.stopRenderLoop();
    }

    private createScene() {
        // create a basic BJS Scene object
        this.scene = new BABYLON.Scene(this.engine);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
    }

    private initGameVisuals() {
        // create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
        this.spaceship = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene);

        // move the sphere upward 1/2 of its height
        this.spaceship.position.y = 1;

        // create a built-in "ground" shape; its constructor takes 5 params: name, width, height, subdivisions and scene
        var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene);
    }
}    