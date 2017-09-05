declare global {
    interface Navigator {
        getMedia: any;
        webkitGetUserMedia: any;
        mozGetUserMedia: any;
        msGetUserMedia: any;
    }

    interface Window {
        webkitURL: any;
    }

    interface HTMLVideoElement {
        mozSrcObject: any;
    }
}

import { FaceApi } from './faceApi'
import { denodeify } from 'promise'
import { Game } from './game/game'

export class App {

    private streaming: boolean = false;
    private video: HTMLVideoElement = document.querySelector('#video') as HTMLVideoElement;
    private canvas: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
    private debug: HTMLParagraphElement = document.querySelector('#debug') as HTMLParagraphElement;
    private width: number = 320;
    private height: number = 0;
    private game: Game;

    constructor() {
        navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        var toto = navigator.getMedia(
            {
                video: true,
                audio: false
            },
            (stream: MediaStream) => {
                if (navigator.mozGetUserMedia) {
                    this.video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    this.video.src = vendorURL.createObjectURL(stream);
                }
                this.video.play();
            },
            function (err: Error) {
                console.log("An error occured! " + err);
            }
        );

        this.video.addEventListener('canplay', (ev) => {
            if (!this.streaming) {
                this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
                this.video.setAttribute('width', this.width.toString());
                this.video.setAttribute('height', this.height.toString());
                this.canvas.setAttribute('width', this.width.toString());
                this.canvas.setAttribute('height', this.height.toString());
                this.streaming = true;
                this.takepicture();
            }
        }, false);

        window.addEventListener('DOMContentLoaded', () => {
            this.game = new Game(document.getElementById('renderCanvas') as HTMLCanvasElement);
            this.game.start();
        });
    }

    private async takepicture() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.width, this.height);
        var faceResult = await FaceApi.detect(await this.toBlob(this.canvas));

        if (faceResult.length > 0) {
            var attr = faceResult[0].faceAttributes;
            this.debug.innerText = `Pitch: ${attr.headPose.pitch}, Roll: ${attr.headPose.roll}, Yaw: ${attr.headPose.yaw}, Anger: ${attr.emotion.anger}, Happiness: ${attr.emotion.happiness}, Neutral: ${attr.emotion.neutral}, Smile: ${attr.smile}, Age: ${attr.age}`;
        }
        else {
            this.debug.innerText = 'No face detected';
        }
    }

    async toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise<Blob>(
            (resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/png');
            });
    }
}

const app = new App();