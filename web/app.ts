import { HeadController } from './game/headController'
import { LocalHeadController } from './game/localHeadController'
import { denodeify } from 'promise'
import { Game } from './game/game'
import { Enemy } from './game/enemy'
//import { FaceApi } from './faceApi'

export class App {

    private game: Game;
    private startButton: HTMLButtonElement;
    private stopButton: HTMLButtonElement;

    constructor() {
        this.startButton = document.getElementById('start') as HTMLButtonElement;
        this.stopButton = document.getElementById('stop') as HTMLButtonElement;

        this.startButton.addEventListener('click', () => {
            this.game.start();
        });

        this.stopButton.addEventListener('click', () => {
            this.game.stop();
        });

        window.addEventListener('DOMContentLoaded', async () => {
            var video: HTMLVideoElement = document.querySelector('#video') as HTMLVideoElement;
            var tempCanvas: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
            var debug: HTMLParagraphElement = document.querySelector('#debug') as HTMLParagraphElement;
            var controller = new LocalHeadController(video, tempCanvas, debug);
            var friendsinput: HTMLInputElement = document.querySelector('#friends-input') as HTMLInputElement;
            var friendsImg: HTMLImageElement = document.querySelector('#friendimg') as HTMLImageElement;


            friendsinput.onchange = (event) => {
                var file = (<any>event.target).files[0];
                var reader = new FileReader();

                reader.onload = async (event) => {
                    friendsImg.onload = async () => {
                        await this.game.init(friendsImg);
                    };
                    friendsImg.src = reader.result;
                }

                reader.readAsDataURL(file);
            };

            var renderCanvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;

            this.game = new Game(renderCanvas, controller);
            await this.game.init();
        });
    }
}

const app = new App();