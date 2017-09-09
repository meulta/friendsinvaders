import * as BABYLON from 'babylonjs'
import { HeadController } from './headController'
import { Direction, Action } from '../types'

export class Game {

    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;
    private controller: HeadController;
    private spaceship: BABYLON.Mesh;
    private running: boolean;
    private spacePT: any

    constructor(canvas: HTMLCanvasElement, controller: HeadController) {
        this.canvas = canvas;
        this.controller = controller;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.createScene();
        this.initGameVisuals();
        this.startRendering();
    }

    public start(): void {
        this.controller.start();
        this.running = true;
    }

    public stop(): void {
        this.controller.stop();
        this.running = false;
    }

    public startRendering(): void {
        this.engine.runRenderLoop(() => {
            if (this.running) {
                switch (this.controller.direction) {
                    case Direction.Left:
                        this.spaceship.position.x -= 0.1;
                        break;
                    case Direction.Right:
                        this.spaceship.position.x += 0.1;
                        break;
                }
            }
            this.spacePT.time+= 0.2;
            this.scene.render();
        });
    }

    private createScene() {
        // create a basic BJS Scene object
        this.scene = new BABYLON.Scene(this.engine);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 15, -40), this.scene);

        // target the camera to scene origin
        camera.setTarget(new BABYLON.Vector3(0, 15, 0));

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
    }

    private initGameVisuals() {
        //background
        var spacebackground = BABYLON.Mesh.CreatePlane("spacebackground", 130, this.scene);
        spacebackground.material = new BABYLON.StandardMaterial("spacematerial", this.scene);
        this.spacePT = new (<any>BABYLON).StarfieldProceduralTexture("spacebackgroundPT", 300, this.scene);
        (<BABYLON.StandardMaterial>spacebackground.material).diffuseTexture = this.spacePT;
        spacebackground.position.z = 40;

        //spacebackground.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI);

        // create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
        var enemy = BABYLON.Mesh.CreateSphere('sphere1', 16, 3, this.scene);
        enemy.position.y = 15;

        // create a built-in "ground" shape; its constructor takes 5 params: name, width, height, subdivisions and scene
        this.spaceship = BABYLON.Mesh.CreateBox("PlayerSpaceShip", 3, this.scene);
        this.spaceship.position.y = 3;
    }
}    