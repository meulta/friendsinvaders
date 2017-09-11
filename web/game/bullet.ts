import * as BABYLON from 'babylonjs'

export class Bullet {
    private mesh: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private lastMoveTime: number;
    private pace: number = 6;
    private goingUp: boolean;
    private static originalMesh: BABYLON.Mesh;
    
    constructor(scene: BABYLON.Scene, initialPosition: BABYLON.Vector2, goingUp: boolean = false) {
        this.scene = scene;
        this.goingUp = false;
        this.initMesh(initialPosition);
        this.lastMoveTime = new Date(Date.now()).getTime() / 1000;
        this.move();        
    }

    public move(): void {
        var currentTime = new Date(Date.now()).getTime() / 1000;
        var elapsedTime = currentTime - this.lastMoveTime;
        var distance = elapsedTime * this.pace;
        
        if (this.goingUp) {
            this.y += distance;
        }
        else {
            this.y -= distance;
        }
        
        this.lastMoveTime = currentTime;
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

    private initMesh(initialPosition: BABYLON.Vector2): void {
        if(Bullet.originalMesh == null){
            Bullet.originalMesh = BABYLON.Mesh.CreateSphere('box', 2, 1, this.scene);
            Bullet.originalMesh.position.x = 1000;
        }

        this.mesh = Bullet.originalMesh.clone("bullet");
        this.x = initialPosition.x;
        this.y = initialPosition.y;
    }
}