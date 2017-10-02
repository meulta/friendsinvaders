import * as BABYLON from 'babylonjs'
import { Game } from './game'

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

    public static downloadSpaceship(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if (Utils.spaceship) {
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
                Utils.spaceshit = await Utils.downloadAsset("spaceshit.glb", scene);
                Utils.poop = scene.getMeshByName('mesh_id36') as BABYLON.Mesh;
                Utils.lips = scene.getMeshByName('mesh_id35') as BABYLON.Mesh;
                Utils.lefteye = scene.getMeshByName('mesh_id30') as BABYLON.Mesh;
                Utils.righteye = scene.getMeshByName('mesh_id31') as BABYLON.Mesh;
                Utils.leftbro = scene.getMeshByName('mesh_id33') as BABYLON.Mesh;
                Utils.rightbro = scene.getMeshByName('mesh_id32') as BABYLON.Mesh;
                Utils.spaceshit.rotation = new BABYLON.Vector3(0, (Math.PI * 2), 0);
                Utils.spaceshit.scaling = new BABYLON.Vector3(50, 50, -50);
                Utils.spaceshit.position.z = 0;
                resolve(Utils.spaceshit);
            }
        });
    }

    public static downloadEnemy(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if (Utils.enemy) {
                resolve(Utils.enemy.clone(""));
            }
            else {
                Utils.enemy = await Utils.downloadAsset("enemy.glb", scene);
                Utils.enemy.scaling = new BABYLON.Vector3(4, 4, -4);
                resolve(Utils.enemy);
            }
        });
    }

    public static downloadAsset(id: string, scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise((resolve, reject) => {
            var query = "../artifacts/";

            // Let's import the model
            BABYLON.SceneLoader.ImportMesh("", query, id, scene, function (meshes) {
                if (id === "spaceship.glb") {
                    meshes[0].getChildMeshes().forEach((mesh: BABYLON.Mesh) => {
                        Game.shadowGenerator.getShadowMap().renderList.push(mesh);
                    });
                    Game.shadowGenerator.getShadowMap().renderList.push(meshes[0]);
                }
                resolve(meshes[0] as BABYLON.Mesh);
            });
        });
    }

    public static ComputeDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
}