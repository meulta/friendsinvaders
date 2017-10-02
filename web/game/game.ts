import * as BABYLON from 'babylonjs'
import { HeadController } from './headController'
import { Direction, Action } from '../types'
import { Enemy } from './enemy'
import { Bullet } from './bullet'
import { SpaceShip } from './spaceship'
import { SpaceShit } from './spaceshit'
import { LocalHeadController } from './localHeadController'
import { Utils } from './utils'

export class Game {

    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;
    private controller: HeadController | LocalHeadController;
    private spaceship: SpaceShip | SpaceShit;
    private running: boolean;
    private spacePT: any
    private enemies: Enemy[] = [];
    private bullets: Bullet[] = [];
    private upLeftCorner: BABYLON.Vector2;
    private downRightCorner: BABYLON.Vector2;
    public static shadowGenerator: BABYLON.ShadowGenerator;

    constructor(canvas: HTMLCanvasElement, controller: HeadController | LocalHeadController) {
        this.canvas = canvas;
        this.controller = controller;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.upLeftCorner = new BABYLON.Vector2(-28, 30);
        this.downRightCorner = new BABYLON.Vector2(28, 10);
    }

    public init(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.createScene();

            var cacheEnemy = await Utils.downloadEnemy(this.scene);
            var cacheSpaceship = await Utils.downloadSpaceship(this.scene);
            var cacheSpaceshit = await Utils.downloadSpaceshit(this.scene);
            var cacheCorn = await Utils.downloadCorn(this.scene);
            cacheEnemy.position.y = 1000;
            cacheSpaceship.position.y = 1000;
            cacheSpaceshit.position.y = 1000;
            cacheCorn.position.y = 1000;

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
            if (this.running) {
                this.moveAll();
                this.tryShootAll();
                this.hitTest();
                this.clean();
            }
            this.scene.render();
        });
    }

    private hitTest(): void {
        this.bullets.forEach((bullet: Bullet) => {
            this.enemies.forEach((enemy: Enemy, enemyIndex: number) => {
                console.log(bullet.mesh);
                if (bullet.mesh && enemy.mesh && bullet.goingUp && bullet.mesh.intersectsMesh(enemy.mesh, true)) {
                    console.log('HIT');
                    enemy.kill();
                    bullet.destroy();
                }
            });
        });
    }

    private clean(): void {
        this.bullets.forEach((bullet: Bullet, index: number) => {
            if (!bullet.mesh) {
                this.bullets.splice(index, 1);
                console.log('delete bullet');
            }
        });

        this.enemies.forEach((enemy: Enemy, index: number) => {
            if (!enemy.mesh) {
                this.enemies.splice(index, 1);
                console.log('delete enemy');
            }
        });
    }

    private moveAll(): void {
        this.spaceship.direction = this.controller.direction;
        this.spaceship.action = this.controller.action;
        if (this.controller instanceof LocalHeadController && this.spaceship instanceof SpaceShit) {
            this.spaceship.roll = this.controller.roll;
            this.spaceship.leftbroheight = this.controller.leftbroheight;
            this.spaceship.rightbroheight = this.controller.rightbroheight;
            this.spaceship.lipsheight = this.controller.lipsheight;
        }
        this.spaceship.move();

        this.enemies.forEach((enemy: Enemy) => {
            enemy.move();
        });

        this.bullets.forEach((bullet: Bullet) => {
            bullet.move();
        });
    }

    private tryShootAll(): void {
        var bullet = this.spaceship.tryShoot();
        if (bullet) {
            this.bullets.push(bullet);
        }

        this.enemies.forEach((enemy: Enemy) => {
            var bullet = enemy.tryShoot();
            if (bullet != null) {
                this.bullets.push(bullet);
            }
        });
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
        light.intensity = 1.5;
        var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-0.2, -0.2, 1), this.scene);
        light2.position = new BABYLON.Vector3(0, 15, -2);
        light2.intensity = 0.5;
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/artifacts/environment.dds", this.scene);
        hdrTexture.gammaSpace = true;
        this.scene.environmentTexture = hdrTexture;

        // Shadows
        Game.shadowGenerator = new BABYLON.ShadowGenerator(512, light2);
        Game.shadowGenerator.useBlurExponentialShadowMap = true;
    }

    private initGameVisuals() {
        //background
        var spacebackground = BABYLON.Mesh.CreatePlane("spacebackground", 200, this.scene);
        spacebackground.material = new BABYLON.StandardMaterial("spacematerial", this.scene);
        spacebackground.position.z = 6;
        (<BABYLON.StandardMaterial>spacebackground.material).diffuseTexture = new BABYLON.Texture("/artifacts/space.png", this.scene);
        spacebackground.receiveShadows = true;

        while (this.enemies.length < 5) {
            this.enemies.push(new Enemy(this.scene, this.upLeftCorner, this.downRightCorner));
        }

        this.spaceship = new SpaceShit(this.scene, this.upLeftCorner, this.downRightCorner);
    }
}    