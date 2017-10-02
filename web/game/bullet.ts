import * as BABYLON from 'babylonjs'
import { Utils } from './utils'

export class Bullet {
    private _mesh: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private lastMoveTime: number;
    private pace: number = 6;
    private _goingUp: boolean;
    private _isCorn: boolean;
    private static originalMeshDown: BABYLON.Mesh;
    private static originalMeshUp: BABYLON.Mesh;
    private static hl: BABYLON.HighlightLayer;

    constructor(scene: BABYLON.Scene, initialPosition: BABYLON.Vector2, goingUp: boolean = false, corn:boolean = false) {
        this.scene = scene;
        this._goingUp = goingUp;
        this._isCorn = corn;
        this.initMesh(initialPosition);
        this.lastMoveTime = new Date(Date.now()).getTime() / 1000;
        this.move();
    }

    public move(): void {
        if (!this._mesh) return;

        var currentTime = new Date(Date.now()).getTime() / 1000;
        var elapsedTime = currentTime - this.lastMoveTime;
        var distance = elapsedTime * this.pace;

        if (this._goingUp) {
            this.y += distance;
        }
        else {
            this.y -= distance;
        }

        if (this.y < 0 || this.y > 35) {
            this.destroy();
        }

        this.lastMoveTime = currentTime;
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

    public destroy(): void {
        Bullet.hl.removeMesh(this._mesh);
        this.mesh.dispose();
        this._mesh = null;
    }

    public get goingUp(): boolean {
        return this._goingUp;
    }

    private async initMesh(initialPosition: BABYLON.Vector2) {
        var bulletMesh = null;
        if (!this._goingUp) {
            if (Bullet.originalMeshDown == null) {
                Bullet.originalMeshDown = BABYLON.Mesh.CreateBox('box', 1.5, this.scene);
                Bullet.originalMeshDown.scaling.x = 0.20;
                Bullet.originalMeshDown.scaling.z = 0.10;
                Bullet.originalMeshDown.position.x = 1000;
                var material = new BABYLON.StandardMaterial("texture2", this.scene);
                material.diffuseColor = new BABYLON.Color3(1, 0, 0); //Red
                Bullet.originalMeshDown.material = material;
            }
            this._mesh = Bullet.originalMeshDown.clone("bullet");
        }
        else if (this._isCorn) {
            if (Bullet.originalMeshUp == null) {
                Bullet.originalMeshUp = Utils.corn;
                Bullet.originalMeshUp.scaling.y *= 4;
                Bullet.originalMeshUp.scaling.x *= 4;
                Bullet.originalMeshUp.position.z += 1;
                Bullet.originalMeshUp.position.x = 1000;
            }
            this._mesh = Bullet.originalMeshUp.clone("bullet");
        }
        else {
            if (Bullet.originalMeshUp == null) {
                Bullet.originalMeshUp = BABYLON.Mesh.CreateBox('box', 1.5, this.scene);
                Bullet.originalMeshUp.scaling.x = 0.20;
                Bullet.originalMeshUp.position.x = 1000;
                var material = new BABYLON.StandardMaterial("texture2", this.scene);
                material.diffuseColor = new BABYLON.Color3(0, 1, 0);
                Bullet.originalMeshUp.material = material;
            }
            this._mesh = Bullet.originalMeshUp.clone("bullet");
        }

        if (!Bullet.hl) {
            Bullet.hl = new BABYLON.HighlightLayer("hl", this.scene, { mainTextureFixedSize: 512, blurHorizontalSize: 1, blurVerticalSize: 1 });
        }
        Bullet.hl.addMesh(this._mesh, BABYLON.Color3.White());
        this.x = initialPosition.x;
        this.y = initialPosition.y;
    }
}