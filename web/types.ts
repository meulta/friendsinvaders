/* Face API types */

export interface FaceResult {
    faceId: string
    faceRectangle: FaceRectangle
    faceLandmarks: FaceLandmarks
    faceAttributes: FaceAttributes
}

export type Binary = Blob | Buffer

export interface Config {
    subscriptionKey: string
}

export interface DetectConfig {
    faceKey: string
    returnFaceId: boolean
    returnFaceLandmarks: boolean
    returnFaceAttributes: string
}

export interface FaceRectangle {
    width: number
    height: number
    left: number
    top: number
}

export interface Coordinates {
    x: number
    y: number
}

export interface FaceLandmarks {
    pupilLeft: Coordinates
    pupilRight: Coordinates
    noseTip: Coordinates
    mouthRight: Coordinates
    eyebrowLeftOuter: Coordinates
    eyebrowLeftInner: Coordinates
    eyeLeftOuter: Coordinates
    eyeLeftTop: Coordinates
    eyeLeftBottom: Coordinates
    eyeLeftInner: Coordinates
    eyebrowRightInner: Coordinates
    eyebrowRightOuter: Coordinates
    eyeRightInner: Coordinates
    eyeRightTop: Coordinates
    eyeRightBottom: Coordinates
    eyeRightOuter: Coordinates
    noseRootLeft: Coordinates
    noseRootRight: Coordinates
    noseLeftAlarTop: Coordinates
    noseRightAlarTop: Coordinates
    noseLeftAlarOutTip: Coordinates
    noseRightAlarOutTip: Coordinates
    upperLipTop: Coordinates
    upperLipBottom: Coordinates
    underLipTop: Coordinates
    underLipBottom: Coordinates
}

export interface FaceAttributes {
    age: number
    gender: string
    smile: number
    facialHair: FacialHair
    glasses: 'NoGlasses' | 'ReadingGlasses' | 'Sunglasses' | 'SwimmingGoggles'
    headPose: Orientation
    emotion: Emotion,
    hair: Hair,
    makeup: MakeUp,
    occlusion: Occlusion,
    accessories: FaceAccessory[],
    blur: PictureBlur,
    exposure: PictureExposure,
    noise: PictureNoise
}

export interface FacialHair {
    moustache: number
    beard: number
    sideburns: number
}

export interface Orientation {
    roll: number
    yaw: number
    pitch: number
}

export interface Emotion {
    anger: number
    contempt: number
    disgust: number
    fear: number
    happiness: number
    neutral: number
    sadness: number
    surprise: number
}

export interface ColorResult {
    color: string
    confidence: number
}

export interface Hair {
    bald: number
    invisible: boolean
    hairColor: ColorResult[]
}

export interface MakeUp {
    eyeMakeup: boolean
    lipMakeUp: boolean
}

export interface Occlusion {
    foreheadOccluded: boolean
    eyeOccluded: boolean
    mouthOccluded: boolean
}

export interface FaceAccessory {
    type: string
    confidence: number
}

export interface PictureBlur {
    blurLevel: 'Low' | 'Medium' | 'High'
    value: number
}

export interface PictureExposure {
    exposureLevel: 'GoodExposure' | 'OverExposure' | 'UnderExposure'
    value: number
}

export interface PictureNoise {
    noiseLevel: 'Low' | 'Medium' | 'High'
    value: number
}