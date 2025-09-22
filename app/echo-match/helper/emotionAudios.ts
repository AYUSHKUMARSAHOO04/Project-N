export type EmotionType =
  | "Happy"
  | "Sad"
  | "Love"
  | "Romantic"
  | "Heartbreak"
  | "Motivational"
  | "Chill"
  | "Angry"
  | "Party";

export const emotionAudios: Record<EmotionType, string[]> = {
  Happy: [
    "/audio-data/happy1.mp3",
    "/audio-data/happy2.mp3",
    "/audio-data/happy3.mp3",
  ],
  Sad: ["/audio-data/sad1.mp3", "/audio-data/sad2.mp3"],
  Love: ["/audio-data/love1.mp3", "/audio-data/love2.mp3"],
  Romantic: [
    "/audio-data/romantic1.mp3",
    "/audio-data/romantic2.mp3",
    "/audio-data/romantic3.mp3",
  ],
  Heartbreak: [
    "/audio-data/heartbreak1.mp3",
    "/audio-data/heartbreak2.mp3",
    "/audio-data/heartbreak3.mp3",
  ],
  Motivational: [
    "/audio-data/motivational1.mp3",
    "/audio-data/motivational2.mp3",
    "/audio-data/motivational3.mp3",
  ],
  Chill: [
    "/audio-data/chill1.mp3",
    "/audio-data/chill2.mp3",
    "/audio-data/chill3.mp3",
  ],
  Angry: [
    "/audio-data/angry1.mp3",
    "/audio-data/angry2.mp3",
    "/audio-data/angry3.mp3",
  ],
  Party: [
    "/audio-data/party1.mp3",
    "/audio-data/party2.mp3",
    "/audio-data/party3.mp3",
  ],
};
