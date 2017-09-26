import { HeadController } from '../game/localHeadController'
import { Morpher } from './morpher'
import { denodeify } from 'promise'

export class App {

    private game: Morpher;
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
            var controller = new HeadController(video, tempCanvas, debug);

            var renderCanvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;

            this.game = new Morpher(renderCanvas, controller);
            await this.game.init();
        });
    }
}

const app = new App();