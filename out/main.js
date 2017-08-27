var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Game {
    loadAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                let assets = new BABYLON.AssetsManager(this.scene);
                let boneTask = assets.addTextureTask("bone", "bone.jpg");
                let boneNormalTask = assets.addTextureTask("boneNormal", "bonenormal.png");
                var animTask = assets.addMeshTask("skeleton", "skelet", "", "skeleton.babylon");
                assets.onFinish = (tasks) => {
                    var map = new Map();
                    map["bone.jpg"] = boneTask;
                    map["bonenormal.jpg"] = boneNormalTask;
                    map["skeleton.babylon"] = animTask;
                    res(map);
                };
                assets.load();
            });
        });
    }
    constructor(canvasElement) {
        this.canvas = document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.createScene();
    }
    createScene() {
        return __awaiter(this, void 0, void 0, function* () {
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.1, 13, BABYLON.Vector3.Zero(), this.scene);
            this.camera.attachControl(this.canvas, false);
            this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
            let res = yield this.loadAssets();
            let bonaMaterial = new BABYLON.StandardMaterial("bone1", this.scene);
            let boneTask = res["bone.jpg"];
            let boneNormalTask = res["bonenormal.jpg"];
            let boneTexture = boneTask.texture;
            let boneNormalTexture = boneNormalTask.texture;
            boneTexture.uScale = 3;
            boneTexture.vScale = 3;
            boneNormalTexture.uScale = 3;
            boneNormalTexture.vScale = 3;
            bonaMaterial.diffuseTexture = boneTexture;
            bonaMaterial.bumpTexture = boneNormalTexture;
            let sceneTask = res["skeleton.babylon"];
            let player = sceneTask.loadedMeshes[0];
            player.position = new BABYLON.Vector3(0, -2, 0);
            player.material = bonaMaterial;
            this.animate();
        });
    }
    animate() {
        // run the render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}
window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'
    let game = new Game('renderCanvas');
    // start animation
    game.animate();
});
//# sourceMappingURL=main.js.map