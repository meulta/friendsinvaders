import { post } from 'superagent'
import { Binary, DetectConfig, FaceResult } from './types'
import { Config } from './config'

export class FaceApi {
    static baseUrl: string = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect';

    static async detect(image: Binary | string): Promise<FaceResult> {
        // determine if the image is a URL or raw data
        const binary = image.constructor !== String;

        // build the request
        let req = post(FaceApi.baseUrl)
            .set('Ocp-Apim-Subscription-Key', Config.faceKey)
            .query({'returnFaceAttributes': 'headPose,smile,emotion,age' });

        if(binary){
            req.set('Content-Type', 'application/octet-stream')
        }

        return (await req.send(binary ? image : { Url: image })).body;
    }
}