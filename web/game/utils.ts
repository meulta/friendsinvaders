import * as BABYLON from 'babylonjs'

export class Utils {

    public static spaceship: BABYLON.Mesh;
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
                resolve(Utils.spaceship);
            }
        });
    }

    public static downloadSpaceshit(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if (Utils.spaceship) {
                resolve(Utils.spaceship);
            }
            else {
                Utils.spaceship = await Utils.downloadAsset("spaceshit.glb", scene);
                Utils.poop = scene.getMeshByName('mesh_id36') as BABYLON.Mesh;
                Utils.lips = scene.getMeshByName('mesh_id35') as BABYLON.Mesh;
                Utils.lefteye = scene.getMeshByName('mesh_id30') as BABYLON.Mesh;
                Utils.righteye = scene.getMeshByName('mesh_id31') as BABYLON.Mesh;
                Utils.leftbro = scene.getMeshByName('mesh_id33') as BABYLON.Mesh;
                Utils.rightbro = scene.getMeshByName('mesh_id32') as BABYLON.Mesh;
                Utils.spaceship.rotation = new BABYLON.Vector3(0, (Math.PI * 2), 0);
                Utils.spaceship.scaling = new BABYLON.Vector3(10, 100, 100);
                resolve(Utils.spaceship);
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
            // var req = new XMLHttpRequest();
            // req.addEventListener("load", function () {
            // var manifest = JSON.parse(this.responseText);

            // if (!manifest.manifestUris) {
            //     console.warn("Unable to load " + id);
            //     return;
            // }

            // for (var index = 0; index < manifest.manifestUris.length; index++) {
            //     var manifestUri = manifest.manifestUris[index];

            //     // We want the viewable gltf
            //     if (manifestUri.usage === "View") {
            //         var uri = manifestUri.uri;
            //         var fileIndex = uri.lastIndexOf("/");
            //         var path = uri.substring(0, fileIndex + 1);
            //         var filename = uri.substring(fileIndex + 1);

            // Let's import the model
            BABYLON.SceneLoader.ImportMesh("", query, id, scene, function (meshes) {
                resolve(meshes[0] as BABYLON.Mesh);
            });
            //}
            // }
            // });
            // req.open("GET", query);
            // req.send();
        });
    }

    public static ComputeDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
}