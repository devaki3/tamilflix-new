import type { QuizQuestion } from '../types/movie';

/**
 * The exact 8 questions / option values from the existing project's `quiz.js`.
 * Values must stay identical — the recommendation scoring (client fallback and
 * server `/api/movies/recommend`) keys off them.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
{
  key: 'mood',
  question: 'What mood are you in tonight?',
  options: [
  { value: 'excited', emoji: '⚡', text: 'Excited & Pumped Up', desc: 'Ready for adrenaline' },
  { value: 'romantic', emoji: '❤️', text: 'Romantic & Dreamy', desc: 'In the mood for love' },
  { value: 'funny', emoji: '😂', text: 'Want to Laugh', desc: 'Need some comedy' },
  { value: 'sad', emoji: '😢', text: 'Emotional & Reflective', desc: 'Ready to feel deeply' },
  { value: 'scared', emoji: '😱', text: 'Thrill & Fright', desc: 'Love being scared' },
  { value: 'inspired', emoji: '✨', text: 'Need Inspiration', desc: 'Looking for motivation' }]

},
{
  key: 'storyType',
  question: 'What type of story do you prefer?',
  options: [
  { value: 'love', emoji: '💕', text: 'Love Story', desc: 'Romance and relationships' },
  { value: 'action', emoji: '🥊', text: 'Action & Adventure', desc: 'Fights and thrills' },
  { value: 'social', emoji: '🌍', text: 'Social Drama', desc: 'Real issues, powerful messages' },
  { value: 'comedy', emoji: '🎪', text: 'Pure Comedy', desc: 'Non-stop laughs' },
  { value: 'horror', emoji: '💀', text: 'Horror & Mystery', desc: 'Supernatural and scary' },
  { value: 'classic', emoji: '🏛️', text: 'Classic Tamil Cinema', desc: 'Golden era films' }]

},
{
  key: 'preference',
  question: 'Action-packed or emotionally driven?',
  options: [
  { value: 'action', emoji: '💥', text: 'Full-on Action', desc: 'Give me fights and chases' },
  { value: 'emotional', emoji: '💧', text: 'Deep Emotions', desc: 'Stories that touch my heart' },
  { value: 'both', emoji: '⚖️', text: 'A Mix of Both', desc: 'Action with emotional depth' },
  { value: 'neither', emoji: '😌', text: 'Light & Easy', desc: 'Something fun and breezy' }]

},
{
  key: 'pace',
  question: 'What movie pace do you enjoy?',
  options: [
  { value: 'fast', emoji: '🚀', text: 'Fast-Paced', desc: 'Non-stop, edge of my seat' },
  { value: 'medium', emoji: '🚗', text: 'Medium Pace', desc: 'Balanced storytelling' },
  { value: 'slow', emoji: '🌅', text: 'Slow & Thoughtful', desc: 'Deep, immersive experience' }]

},
{
  key: 'ending',
  question: 'What kind of ending do you prefer?',
  options: [
  { value: 'happy', emoji: '😄', text: 'Happy Ending', desc: 'Feel good finale' },
  { value: 'triumphant', emoji: '🏆', text: 'Triumphant Victory', desc: 'Hero wins, justice served' },
  { value: 'bittersweet', emoji: '🌸', text: 'Bittersweet', desc: 'Beautiful but melancholic' },
  { value: 'twist', emoji: '🌀', text: 'Shocking Twist', desc: 'Surprise me!' }]

},
{
  key: 'heroType',
  question: 'What type of hero do you love?',
  options: [
  { value: 'mass', emoji: '🔥', text: 'Mass Hero', desc: 'Rajini, Vijay style — pure mass' },
  { value: 'common', emoji: '👨', text: 'Common Man', desc: 'Realistic, relatable hero' },
  { value: 'sensitive', emoji: '🌺', text: 'Sensitive & Deep', desc: 'Complex, emotional character' },
  { value: 'any', emoji: '🎭', text: "Doesn't Matter", desc: 'Just give me a great film' }]

},
{
  key: 'tone',
  question: 'Comedy or intense drama?',
  options: [
  { value: 'comedy', emoji: '😆', text: 'Comedy All the Way', desc: 'Laughter is the best medicine' },
  { value: 'drama', emoji: '🎭', text: 'Intense Drama', desc: 'Serious, gripping storytelling' },
  { value: 'mix', emoji: '🎪', text: 'Mix of Comedy & Drama', desc: 'Balance of both worlds' }]

},
{
  key: 'watchTime',
  question: 'When and how are you watching?',
  options: [
  { value: 'night', emoji: '🌙', text: 'Late Night Alone', desc: 'Perfect for thrillers / horror' },
  { value: 'family', emoji: '👨‍👩‍👧', text: 'With Family', desc: 'Family-friendly film' },
  { value: 'alone', emoji: '🎧', text: 'Alone & Cozy', desc: 'Emotional / romantic film' },
  { value: 'friends', emoji: '🍿', text: 'With Friends', desc: 'Fun, entertaining film' }]

}];