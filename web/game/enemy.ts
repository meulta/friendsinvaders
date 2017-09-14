import * as BABYLON from 'babylonjs'
import { Bullet } from './bullet'

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
        this.setNextDirection()
    }

    public tryShoot(): Bullet {
        if (Math.random() < 0.01) {
            return new Bullet(this.scene, new BABYLON.Vector2(this.x, this.y));
        }

        return null;
    }

    public kill(): void {
        this.mesh.dispose();

    }

    private initMesh(): void {

        var query = "https://api.remix3d.com/v3/creations/G009SX0MWZ9F";

        var req = new XMLHttpRequest();
        var that = this;
        req.addEventListener("load", function () {
            var manifest = JSON.parse(this.responseText);

            if (!manifest.manifestUris) {
                console.warn("Unable to load G009SX0MWZ9F");
                return;
            }

            for (var index = 0; index < manifest.manifestUris.length; index++) {
                var manifestUri = manifest.manifestUris[index];

                // We want the viewable gltf
                if (manifestUri.usage === "View") {
                    var uri = manifestUri.uri;
                    var fileIndex = uri.lastIndexOf("/");
                    var path = uri.substring(0, fileIndex + 1);
                    var filename = uri.substring(fileIndex + 1);

                    // Let's import the model
                    BABYLON.SceneLoader.ImportMesh("", path, filename, that.scene, function (meshes) {
                        var mesh = meshes[0] as BABYLON.Mesh;
                        mesh.position = BABYLON.Vector3.Zero();
                        mesh.scaling = new BABYLON.Vector3(1.5, 1.5, -1.5);
                        that._mesh = mesh;
                        that.y = 25;
                        that.x = Math.random() * that.downRightCorner.x * 2 - that.downRightCorner.x;
                        that.mesh.rotation = new BABYLON.Vector3(-Math.PI / 6, Math.PI * 2,  0);
                    });
                    return;
                }
            }
        });
        req.open("GET", query);
        req.send();
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