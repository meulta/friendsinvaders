import * as BABYLON from 'babylonjs'
import { LocalHeadController } from '../game/localHeadController'
import { Direction, Action } from '../types'
import { SpaceShip } from '../game/spaceship'
import { Utils } from '../game/utils'
import { Game } from '../game/game'

export class Morpher {

    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;
    private controller: LocalHeadController;
    private spaceship: BABYLON.Mesh;
    private running: boolean;
    private previousRoll: number = 0;
    private t: number = 0;

    constructor(canvas: HTMLCanvasElement, controller: LocalHeadController) {
        this.canvas = canvas;
        this.controller = controller;
        this.engine = new BABYLON.Engine(this.canvas, true);
    }

    public init(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.createScene();
            this.spaceship = await Utils.downloadSpaceshit(this.scene);
            this.initGameVisuals();
            this.startRendering();

            resolve();
        });
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
            if (this.spaceship.position.y != 15) {
                this.spaceship.position.y = 15;
                this.spaceship.position.z = 50;
                Utils.lips.scaling.z *= 0.7;
                Utils.lips.scaling.y *= 0.7;
                Utils.lips.scaling.x *= 0.7;
            }

            if (this.running) {
                this.moveAll();
            }
            this.scene.render();

        });
    }

    private moveAll(): void {
        this.spaceship.rotateAround(new BABYLON.Vector3(0, 15, 0), new BABYLON.Vector3(0, 0, 1), -this.previousRoll);
        this.previousRoll = this.controller.roll;
        this.spaceship.rotateAround(new BABYLON.Vector3(0, 15, 0), new BABYLON.Vector3(0, 0, 1), this.controller.roll);
        Utils.leftbro.position.y = Utils.lefteye.position.y + this.controller.leftbroheight - 12;
        Utils.rightbro.position.y = Utils.righteye.position.y + this.controller.rightbroheight - 12;
        Utils.lips.scaling.y = 0.0001 + this.controller.lipsheight * 0.0001;
    }

    private createScene() {
        // create a basic BJS Scene object
        this.scene = new BABYLON.Scene(this.engine);

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 15, -40), this.scene);

        // target the camera to scene origin
        camera.setTarget(new BABYLON.Vector3(0, 15, 0));
        camera.attachControl(this.canvas);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.5;
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/artifacts/environment.dds", this.scene);
        hdrTexture.gammaSpace = true;
        this.scene.environmentTexture = hdrTexture;

        var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-0.2, 0.2, 1), this.scene);
        light2.position = new BABYLON.Vector3(0, 30, -120);
        light2.intensity = 0.5;

        // Shadows
        Game.shadowGenerator = new BABYLON.ShadowGenerator(2048, light2);
        Game.shadowGenerator.useExponentialShadowMap = true;
        Game.shadowGenerator.useBlurExponentialShadowMap = true;
        Game.shadowGenerator.blurScale = 10;
    }

    private initGameVisuals() {
        //background
        var spacebackground = BABYLON.Mesh.CreatePlane("spacebackground", 200, this.scene);
        spacebackground.material = new BABYLON.StandardMaterial("spacematerial", this.scene);
        spacebackground.position.z = 50;
        spacebackground.receiveShadows = true;
        (<BABYLON.StandardMaterial>spacebackground.material).diffuseTexture = new BABYLON.Texture("/artifacts/space.png", this.scene);
    }
}    