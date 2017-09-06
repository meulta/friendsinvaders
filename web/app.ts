import { HeadController } from './game/headController'
import { denodeify } from 'promise'
import { Game } from './game/game'

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

        window.addEventListener('DOMContentLoaded', () => {

            var video: HTMLVideoElement = document.querySelector('#video') as HTMLVideoElement;
            var tempCanvas: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
            var debug: HTMLParagraphElement = document.querySelector('#debug') as HTMLParagraphElement;
            var controller = new HeadController(video, tempCanvas, debug);

            var renderCanvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;

            this.game = new Game(renderCanvas, controller);
        });
    }
}

const app = new App();