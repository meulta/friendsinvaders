import * as BABYLON from 'babylonjs'

export class Game {

    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.createScene();
        this.initGameVisuals();
    }

    public start(){
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
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
        var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene);

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;

        // create a built-in "ground" shape; its constructor takes 5 params: name, width, height, subdivisions and scene
        var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, this.scene);
    }
}    