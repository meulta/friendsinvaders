import * as BABYLON from 'babylonjs'

export class Utils {

    public static spaceship: BABYLON.Mesh;
    public static enemy: BABYLON.Mesh;

    public static downloadSpaceship(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if(Utils.spaceship){
                resolve(Utils.spaceship.clone(""));
            }
            else{
                Utils.spaceship = await Utils.downloadAsset("G009SX0MWZVH", scene);
                resolve(Utils.spaceship);
            } 
        });
    }

    public static downloadEnemy(scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise(async (resolve, reject) => {
            if(Utils.spaceship){
                resolve(Utils.enemy.clone(""));
            }
            else{
                Utils.enemy = await Utils.downloadAsset("G009SX0MWZ9F", scene);
                resolve(Utils.enemy);
            } 
        });
    }

    public static downloadAsset(id: string, scene: BABYLON.Scene): Promise<BABYLON.Mesh> {
        return new Promise((resolve, reject) => {

            var query = "https://api.remix3d.com/v3/creations/" + id;

            var req = new XMLHttpRequest();
            req.addEventListener("load", function () {
                var manifest = JSON.parse(this.responseText);

                if (!manifest.manifestUris) {
                    console.warn("Unable to load " + id);
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
                        BABYLON.SceneLoader.ImportMesh("", path, filename, scene, function (meshes) {
                            resolve(meshes[0] as BABYLON.Mesh);
                        });
                    }
                }
            });
            req.open("GET", query);
            req.send();
        });


    }
}