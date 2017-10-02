import * as BABYLON from 'babylonjs'
import { Bullet } from './bullet'
import { Direction, Action } from '../types'
import { Utils } from './utils'
import { Game } from './game'

export class SpaceShip {
    private _mesh: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private lastMoveTime: number;
    private _lastShootTime: number;
    private _direction: Direction;
    private _action: Action;
    private upLeftCorner: BABYLON.Vector2;
    private downRightCorner: BABYLON.Vector2;
    private shootIntervalInSec: number = 1;
    private pace: number = 4;

    constructor(scene: BABYLON.Scene, upLeftCorner: BABYLON.Vector2, downRightCorner: BABYLON.Vector2) {
        this.scene = scene;
        this.upLeftCorner = upLeftCorner;
        this.downRightCorner = downRightCorner;
        this.lastMoveTime = new Date(Date.now()).getTime() / 1000;
        this._lastShootTime = this.lastMoveTime;
        this.initMesh();
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

    public get direction(): Direction {
        return this._direction;
    }

    public set direction(v: Direction) {
        this._direction = v;
    }

    public get action(): Action {
        return this._action;
    }

    public set action(v: Action) {
        this._action = v;
    }

    public get mesh(): BABYLON.Mesh {
        return this._mesh;
    }

    public move(): void {
        var currentTime = new Date(Date.now()).getTime() / 1000;
        var elapsedTime = currentTime - this.lastMoveTime;
        var distance = elapsedTime * this.pace;

        if (this.direction == Direction.Right && this.x + distance <= this.downRightCorner.x) {
            this.x += distance;
        }
        else if (this.direction == Direction.Left && this.x - distance >= this.upLeftCorner.x) {
            this.x -= distance;
        }

        this.lastMoveTime = currentTime;
    }

    public tryShoot(): Bullet {
        var currentTime = new Date(Date.now()).getTime() / 1000;
        if (this.action == Action.Shoot && currentTime > this._lastShootTime + this.shootIntervalInSec) {
            this._lastShootTime = currentTime;
            return new Bullet(this.scene, new BABYLON.Vector2(this.x, this.y), true);
        }

        return null;
    }

    private async initMesh(): Promise<void> {
        this._mesh = await Utils.downloadSpaceship(this.scene);
        Game.shadowGenerator.getShadowMap().renderList.push(this._mesh);
        this._mesh.position = new BABYLON.Vector3(0, 3, -3);
        this.addParticles();
    }

    private addParticles() {
        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("artifacts/flare.png", this.scene);

        // Where the particles come from
        var emitter = BABYLON.Mesh.CreateBox('asd', 0.01, this.scene);
        emitter.parent = this._mesh;
        emitter.position.z = 0.5;
        emitter.position.y -= 0.3;
        particleSystem.emitter = emitter; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.12, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.12, 0, 0); // To...

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(1, 1, 0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0.2, 0.2, 0, 0.0);

        // Size of each particle (random between...
        particleSystem.minSize = 2;
        particleSystem.maxSize = 4;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1;

        // Emission rate
        particleSystem.emitRate = 250;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -1, 0);

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