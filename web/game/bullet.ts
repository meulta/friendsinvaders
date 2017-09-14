import * as BABYLON from 'babylonjs'

export class Bullet {
    private _mesh: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private lastMoveTime: number;
    private pace: number = 6;
    private _goingUp: boolean;
    private static originalMesh: BABYLON.Mesh;
    
    constructor(scene: BABYLON.Scene, initialPosition: BABYLON.Vector2, goingUp: boolean = false) {
        this.scene = scene;
        this._goingUp = goingUp;
        this.initMesh(initialPosition);
        this.lastMoveTime = new Date(Date.now()).getTime() / 1000;
        this.move();        
    }

    public move(): void {
        var currentTime = new Date(Date.now()).getTime() / 1000;
        var elapsedTime = currentTime - this.lastMoveTime;
        var distance = elapsedTime * this.pace;
        
        if (this._goingUp) {
            this.y += distance;
        }
        else {
            this.y -= distance;
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

    public destroy(): void{
        this.mesh.dispose();
    }

    public get goingUp(): boolean {
        return this._goingUp;
    }

    private initMesh(initialPosition: BABYLON.Vector2): void {
        if(Bullet.originalMesh == null){
            Bullet.originalMesh = BABYLON.Mesh.CreateSphere('box', 2, 1, this.scene);
            Bullet.originalMesh.position.x = 1000;
        }

        this._mesh = Bullet.originalMesh.clone("bullet");
        this.x = initialPosition.x;
        this.y = initialPosition.y;
    }
}