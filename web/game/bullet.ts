import * as BABYLON from 'babylonjs'

export class Bullet {
    private _mesh: BABYLON.Mesh;
    private scene: BABYLON.Scene;
    private lastMoveTime: number;
    private pace: number = 6;
    private _goingUp: boolean;
    private static originalMesh: BABYLON.Mesh;
    private hl: BABYLON.HighlightLayer;
    
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

        if(this.y < 0){
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

    public destroy(): void{
        this.mesh.dispose();
    }

    public get goingUp(): boolean {
        return this._goingUp;
    }

    private initMesh(initialPosition: BABYLON.Vector2): void {
        if(Bullet.originalMesh == null){
            Bullet.originalMesh = BABYLON.Mesh.CreateBox('box', 1, this.scene);
            Bullet.originalMesh.scaling.x = 0.5;
            Bullet.originalMesh.scaling.z = 0.5;
            var material = new BABYLON.StandardMaterial("texture2", this.scene);
            material.diffuseColor = new BABYLON.Color3(1, 0, 0); //Red
            Bullet.originalMesh.material = material;
            Bullet.originalMesh.position.x = 1000;
        }

        this._mesh = Bullet.originalMesh.clone("bullet");
        // if(!this.hl){
        //     this.hl = new BABYLON.HighlightLayer("hl1", this.scene);
        // }
        // this.hl.addMesh(this._mesh , BABYLON.Color3.White());
        this.x = initialPosition.x;
        this.y = initialPosition.y;
    }
}