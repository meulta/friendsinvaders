import * as BABYLON from 'babylonjs'
import { HeadController } from './headController'
import { Direction, Action } from '../types'
import { Enemy } from './enemy'
import { Bullet } from './bullet'
import { SpaceShip } from './spaceship'

export class Game {

    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;
    private controller: HeadController;
    private spaceship: SpaceShip;
    private running: boolean;
    private spacePT: any
    private enemies: Enemy[] = [];
    private bullets: Bullet[] = [];
    private upLeftCorner: BABYLON.Vector2;
    private downRightCorner: BABYLON.Vector2;

    constructor(canvas: HTMLCanvasElement, controller: HeadController) {
        this.canvas = canvas;
        this.controller = controller;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.upLeftCorner = new BABYLON.Vector2(-28, 30);
        this.downRightCorner = new BABYLON.Vector2(28, 10);
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
                this.spaceship.direction = this.controller.direction;
                this.spaceship.action = this.controller.action;
                this.spaceship.move();
                
                var bullet = this.spaceship.tryShoot();
                if (bullet != null) {
                    this.bullets.push(bullet);
                }
                this.spaceship.tryShoot();
                
                this.enemies.forEach((enemy: Enemy) => {
                    enemy.move();
                    var bullet = enemy.tryShoot();
                    if (bullet != null) {
                        this.bullets.push(bullet);
                    }
                });

                this.bullets.forEach((bullet: Bullet) => {
                    bullet.move();
                });
            }
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
        var spacebackground = BABYLON.Mesh.CreatePlane("spacebackground", 300, this.scene);
        spacebackground.material = new BABYLON.StandardMaterial("spacematerial", this.scene);
        this.spacePT = new (<any>BABYLON).StarfieldProceduralTexture("spacebackgroundPT", 2048, this.scene);
        (<BABYLON.StandardMaterial>spacebackground.material).diffuseTexture = this.spacePT;
        this.spacePT.refreshRate = 0;
        this.spacePT.time = Math.random() * 1000;
        spacebackground.position.z = 40;

        while (this.enemies.length < 5) {
            this.enemies.push(new Enemy(this.scene, this.upLeftCorner, this.downRightCorner));
        }

        this.spaceship = new SpaceShip(this.scene, this.upLeftCorner, this.downRightCorner);
    }
}    