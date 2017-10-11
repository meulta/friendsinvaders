import * as BABYLON from 'babylonjs'
import { Game } from './game'
import { FaceApi } from '../faceApi'

export class Utils {

    public static spaceship: BABYLON.Mesh;
    public static corn: BABYLON.Mesh;
    public static spaceshit: BABYLON.Mesh;
    public static poopship: BABYLON.Mesh;
    public static poop: BABYLON.Mesh;
    public static lefteye: BABYLON.Mesh;
    public static righteye: BABYLON.Mesh;
    public static leftbro: BABYLON.Mesh;
    public static rightbro: BABYLON.Mesh;
    public static lips: BABYLON.Mesh;
    public static enemy: BABYLON.Mesh;
    public static enemouche: BABYLON.Mesh;
    public static friends: BABYLON.Mesh[];
    private static nextFriend: number = 0;

    public static downloadSpaceship(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if (Utils.spaceship) {
                Utils.addToShadowGenerator(Utils.spaceship);
                resolve(Utils.spaceship);
            }
            else {
                Utils.spaceship = await Utils.downloadAsset("spaceship.glb", scene);
                Utils.spaceship.scaling = new BABYLON.Vector3(10, 10, -10);
                Utils.spaceship.renderingGroupId = 2;
                resolve(Utils.spaceship);
            }
        });
    }

    public static downloadCorn(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if (Utils.corn) {
                resolve(Utils.corn.clone(""));
            }
            else {
                Utils.corn = await Utils.downloadAsset("corn.glb", scene);
                Utils.corn.scaling = new BABYLON.Vector3(2, 2, -2);
                resolve(Utils.corn);
            }
        });
    }

    public static downloadSpaceshit(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if (Utils.spaceshit) {
                resolve(Utils.spaceshit);
            }
            else {
                Utils.spaceshit = await Utils.downloadAsset("spaceshit2.glb", scene);
                Utils.poop = scene.getMeshByName('mesh_id179') as BABYLON.Mesh;
                Utils.lips = scene.getMeshByName('mesh_id305') as BABYLON.Mesh;
                Utils.lefteye = scene.getMeshByName('mesh_id168') as BABYLON.Mesh;
                Utils.righteye = scene.getMeshByName('mesh_id167') as BABYLON.Mesh;
                Utils.leftbro = scene.getMeshByName('mesh_id164') as BABYLON.Mesh;
                Utils.rightbro = scene.getMeshByName('mesh_id165') as BABYLON.Mesh;
                Utils.spaceshit.rotation = new BABYLON.Vector3(0, (Math.PI * 2), 0);
                Utils.spaceshit.scaling = new BABYLON.Vector3(50, 50, -50);
                Utils.spaceshit.position.y = 0;
                resolve(Utils.spaceshit);
            }
        });
    }


    public static get getNextFriend(): number {
        return Utils.nextFriend++;
    }


    public static downloadEnemy(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if (Utils.enemy) {
                var enemy = Utils.enemy.clone("");
                Utils.addToShadowGenerator(enemy);
                var friend = Utils.friends[Utils.getNextFriend];
                friend.parent = enemy;
                friend.position.z += 0.9;
                friend.position.y += 0.1;
                friend.position.x = 0;
                resolve(enemy);
            }
            else {
                Utils.enemy = await Utils.downloadAsset("enemy.glb", scene);
                Utils.enemy.scaling = new BABYLON.Vector3(4, 4, -4);
                resolve(Utils.enemy);
            }
        });
    }

    public static downloadEnemouche(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if (Utils.enemouche) {
                resolve(Utils.enemouche.clone(""));
            }
            else {
                Utils.enemouche = await Utils.downloadAsset("enemouche.glb", scene);
                Utils.enemouche.scaling = new BABYLON.Vector3(4, 4, -4);
                // var friend = Utils.friend.clone("");
                // Utils.enemouche.addChild(friend);
                // friend.position.z += 10;
                resolve(Utils.enemouche);
            }
        });
    }

    public static async loadFriends(scene: BABYLON.Scene, img: HTMLImageElement) {
        return new Promise(async (resolve, reject) => {
            Utils.friends = [];
            var canvas = document.getElementById("friendscanvas") as HTMLCanvasElement;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, 2048, 1536);

            var faceResult = await FaceApi.detect(await Utils.toBlob(canvas));

            faceResult.forEach((face) => {

                var attr = face.faceRectangle;
                attr.width *= 1.5;
                attr.height *= 1.5;
                attr.left -= attr.width / 4;
                attr.top -= attr.height / 4;
                if (attr.top < 0)
                    attr.top = 0;

                var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 256, scene, true);
                var dynContext = dynamicTexture.getContext();
                (<any>dynContext).drawImage(img,
                    attr.left,
                    attr.top,
                    attr.width,
                    attr.height,
                    0, 0, 256, 256);
                dynamicTexture.update();

                var friend = BABYLON.Mesh.CreatePlane("friend", 0.5, scene, true);
                friend.material = new BABYLON.StandardMaterial("friendmaterial", scene);
                (<BABYLON.StandardMaterial>friend.material).backFaceCulling = true;
                (<BABYLON.StandardMaterial>friend.material).diffuseTexture = dynamicTexture;
                (<BABYLON.StandardMaterial>friend.material).emissiveTexture = dynamicTexture;
                
                Utils.friends.push(friend);
            });

            resolve();
        });
    }

    public static async toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise<Blob>(
            (resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/png');
            });
    }

    public static downloadAsset(id: string, scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise((resolve, reject) => {
            var query = "../artifacts/";

            // Let's import the model
            BABYLON.SceneLoader.ImportMesh("", query, id, scene, function (meshes) {
                resolve(meshes[0] as BABYLON.Mesh);
            });
        });
    }

    public static addToShadowGenerator(mesh: BABYLON.Mesh) {
        mesh.getChildMeshes().forEach((submesh: BABYLON.Mesh) => {
            Game.shadowGenerator.getShadowMap().renderList.push(submesh);
        });
        Game.shadowGenerator.getShadowMap().renderList.push(mesh);
    }

    public static ComputeDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
}