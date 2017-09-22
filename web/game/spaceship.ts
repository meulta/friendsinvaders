import * as BABYLON from 'babylonjs'
import { Bullet } from './bullet'
import { Direction, Action } from '../types'
import { Utils } from './utils'

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
        this._mesh.position = new BABYLON.Vector3(0, 3, 0);
        this._mesh.scaling = new BABYLON.Vector3(100, 100, -100);
    }
}