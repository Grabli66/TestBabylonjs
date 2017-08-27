class Game {
    private readonly canvas : HTMLCanvasElement;
    private readonly engine : BABYLON.Engine;
    
    private scene : BABYLON.Scene;
    private camera : BABYLON.ArcRotateCamera;
    private light : BABYLON.HemisphericLight;

    private async loadAssets () {
        return new Promise ((res, rej) => {
            let assets = new BABYLON.AssetsManager (this.scene);
            let boneTask = assets.addTextureTask ("bone", "bone.jpg");
            let boneNormalTask = assets.addTextureTask ("boneNormal", "bonenormal.png");
            var animTask = assets.addMeshTask ("skeleton", "skelet", "", "skeleton.babylon");
            assets.onFinish = (tasks) => {
                var map = new Map<string, BABYLON.IAssetTask> ();
                map["bone.jpg"] = boneTask;
                map["bonenormal.jpg"] = boneNormalTask;
                map["skeleton.babylon"] = animTask;
                res (map);
            };
            assets.load ();
        });
    }

    constructor(canvasElement : string) {
        this.canvas = document.getElementById (canvasElement) as HTMLCanvasElement;
        this.engine = new BABYLON.Engine (this.canvas, true);
        this.createScene ();
    }
  
    async createScene () {
        this.scene = new BABYLON.Scene (this.engine);
        this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.1, 13, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, false);
        this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this.scene);        
         
        let res = await this.loadAssets ();
        
        let bonaMaterial = new BABYLON.StandardMaterial("bone1", this.scene);
        let boneTask = res["bone.jpg"] as BABYLON.ITextureAssetTask;
        let boneNormalTask = res["bonenormal.jpg"] as BABYLON.ITextureAssetTask;
        let boneTexture = boneTask.texture;
        let boneNormalTexture = boneNormalTask.texture;
        boneTexture.uScale = 3;
        boneTexture.vScale = 3;
        boneNormalTexture.uScale = 3;
        boneNormalTexture.vScale = 3;
        bonaMaterial.diffuseTexture = boneTexture;
        bonaMaterial.bumpTexture = boneNormalTexture;        

        let sceneTask = res["skeleton.babylon"] as BABYLON.MeshAssetTask;
        let player = sceneTask.loadedMeshes[0];
        player.position = new BABYLON.Vector3 (0,-2,0);
        player.material = bonaMaterial;
        this.animate ();
    }
  
    animate() : void {                        

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