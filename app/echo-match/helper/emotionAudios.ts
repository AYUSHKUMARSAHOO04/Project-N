export type EmotionType = 'Happy' | 'Sad' | 'Love'|'Dark'|'Spiritual'|'Energetic'|'Melancholic'|'Uplifting'|'Relaxing';;

export const emotionAudios: Record<EmotionType, string[]> = {
  Happy: [
    '/audio-data/happy1.mp3',
    '/audio-data/happy2.mp3',
    '/audio-data/happy3.mp3'
  ],
  Sad: [
    '/audio-data/sad1.mp3',
    '/audio-data/sad2.mp3'
  ],
  Love: [
    '/audio-data/love1.mp3',
    '/audio-data/love2.mp3'
  ],
  Dark:[
    '/audio-data/dark1.mp3',
    '/audio-data/dark2.mp3',
    '/audio-data/dark3.mp3'
  ],
  Spiritual:[
    '/audio-data/spiritual1.mp3',
    '/audio-data/spiritual2.mp3',
    '/audio-data/spiritual3.mp3',
  ],
  Energetic:[
    '/audio-data/energetic1.mp3',
    '/audio-data/energetic2.mp3',
    '/audio-data/energetic3.mp3',
  ],
  Melancholic:[
    './audio-data/melancholic1.mp3',
    './audio-data/melancholic2.mp3',
    './audio-data/melancholic3.mp3',
  ],
  Uplifting:[
    './audio-data/uplifting1.mp3',
    './audio-data/uplifting.mp3',
    './audio-data/uplifting.mp3',
  ],
  Relaxing:[
    './audio-data/relaxing1.mp3',
    './audio-data/relaxing2.mp3',
    './audio-data/relaxing3.mp3',


  ],
};
