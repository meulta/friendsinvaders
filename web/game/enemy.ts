import * as BABYLON from 'babylonjs'
import { Bullet } from './bullet'

export class Enemy {
    private mesh: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private lastMoveTime: number;
    private moveLeft: boolean;
    private moveRight: boolean;
    private moveUp: boolean;
    private moveDown: boolean;
    private upLeftCorner: BABYLON.Vector2;
    private downRightCorner: BABYLON.Vector2;
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
        return this.mesh.position.x;
    }
    public set x(v: number) {
        this.mesh.position.x = v;
    }

    public get y(): number {
        return this.mesh.position.y;
    }
    public set y(v: number) {
        this.mesh.position.y = v;
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
        this.setNextDirection()
    }

    public tryShoot(): Bullet {
        if (Math.random() < 0.01) {
            return new Bullet(this.scene, new BABYLON.Vector2(this.x, this.y));
        }

        return null;
    }

    private initMesh(): void {
        this.mesh = BABYLON.Mesh.CreateSphere('sphere1', 16, 3, this.scene);
        this.y = 25;
        this.x = Math.random() * this.downRightCorner.x * 2 - this.downRightCorner.x;
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
}