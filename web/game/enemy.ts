import * as BABYLON from 'babylonjs'
import { Bullet } from './bullet'
import { Utils } from './utils'
import { Game } from './game'

export class Enemy {
    private _mesh: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private lastMoveTime: number;
    private moveLeft: boolean;
    private moveRight: boolean;
    private moveUp: boolean;
    private moveDown: boolean;
    private upLeftCorner: BABYLON.Vector2;
    private downRightCorner: BABYLON.Vector2;
    public static pictureList: any[];
    private pace: number = 4;

    constructor(scene: BABYLON.Scene, upLeftCorner: BABYLON.Vector2, downRightCorner: BABYLON.Vector2) {
        this.scene = scene;
        this.upLeftCorner = upLeftCorner;
        this.downRightCorner = downRightCorner;
        this.lastMoveTime = new Date(Date.now()).getTime() / 1000;
        this.initMesh();
        this.move();
    }

    public get x(): number {
        return this._mesh.position.x;
    }
    public set x(v: number) {
        this._mesh.position.x = v;
    }

    public get y(): number {
        return this._mesh.position.y;
    }
    public set y(v: number) {
        this._mesh.position.y = v;
    }

    public get mesh(): BABYLON.Mesh {
        return this._mesh;
    }

    public move(): void {
        var currentTime = new Date(Date.now()).getTime() / 1000;
        var elapsedTime = currentTime - this.lastMoveTime;
        var distance = elapsedTime * this.pace;

        if (this.moveRight && this.x + distance <= this.downRightCorner.x) {
            this.x += distance;
        }
        else if (this.moveLeft && this.x - distance >= this.upLeftCorner.x) {
            this.x -= distance;
        }

        if (this.moveUp && this.y + distance <= this.upLeftCorner.y) {
            this.y += distance;
        }
        else if (this.moveDown && this.y - distance >= this.downRightCorner.y) {
            this.y -= distance;
        }

        this.lastMoveTime = currentTime;
        this.setNextDirection();
    }

    public tryShoot(): Bullet {
        if (Math.random() < 0.01) {
            return new Bullet(this.scene, new BABYLON.Vector2(this.x, this.y));
        }

        return null;
    }

    public kill(): void {
        this._mesh.dispose();
        this._mesh = null;
    }

    private async initMesh(): Promise<void> {
        this._mesh = await Utils.downloadEnemy(this.scene);
        this._mesh.position = new BABYLON.Vector3(Math.random() * this.downRightCorner.x * 2 - this.downRightCorner.x, 25, 2);
        this._mesh.rotation = new BABYLON.Vector3(-Math.PI / 6, Math.PI * 2, 0);
        this.addParticles();

    }

    private setNextDirection(): void {
        if (Math.random() > 0.05)
            return;

        if (Math.random() > 0.5) {
            this.moveRight = true;
            this.moveLeft = false;
        }
        else {
            this.moveRight = false;
            this.moveLeft = true;
        }

        if (Math.random() > 0.5) {
            this.moveUp = true;
            this.moveDown = false;
        }
        else {
            this.moveUp = false;
            this.moveDown = true;
        }
    }

    private addParticles() {
        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("artifacts/flare.png", this.scene);

        // Where the particles come from
        var emitter = BABYLON.Mesh.CreateBox('asd', 0.01, this.scene);
        emitter.parent = this._mesh;
        emitter.position.z = 0.7;
        emitter.position.y -= 0.4;
        particleSystem.emitter = emitter; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.08, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.08, 0, 0); // To...

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0, 0, 1, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0, 0, 0.8, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        particleSystem.minSize = 1;
        particleSystem.maxSize = 2;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.1;
        particleSystem.maxLifeTime = 0.2;

        // Emission rate
        particleSystem.emitRate = 250;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -2, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(0, -1, 0);
        particleSystem.direction2 = new BABYLON.Vector3(0, -1, 0);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;

        // Start the particle system
        particleSystem.start();
    }
}