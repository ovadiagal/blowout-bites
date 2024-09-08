// randomUsername.ts

const adjectives = [
  "wacky",
  "happy",
  "fuzzy",
  "bright",
  "jolly",
  "zippy",
  "cheerful",
  "silly",
  "loyal",
  "brave",
  "quick",
  "gentle",
  "neat",
  "spunky",
  "bold",
  "shiny",
  "calm",
  "dreamy",
  "playful",
  "peppy",
  "frosty",
  "jovial",
  "glowy",
  "starry",
  "mellow",
  "twinkly",
  "cozy",
  "vivid",
  "radiant",
  "chirpy",
  "happy",
  "puffy",
  "cuddly",
  "squeaky",
  "spiky",
  "smooth",
  "crisp",
  "breezy",
  "zesty",
  "pearly",
  "bright",
  "golden",
  "cheery",
  "snappy",
  "fancy",
  "spunky",
  "bouncy",
  "soft",
];

const nouns = [
  "dodo",
  "panda",
  "bunny",
  "kitten",
  "puppy",
  "bear",
  "whale",
  "duck",
  "penguin",
  "fox",
  "owl",
  "frog",
  "seal",
  "deer",
  "hare",
  "star",
  "moon",
  "cloud",
  "mountain",
  "forest",
  "river",
  "field",
  "meadow",
  "sun",
  "wave",
  "beach",
  "hill",
  "valley",
  "storm",
  "rainbow",
  "snowflake",
  "blossom",
  "leaf",
  "flame",
  "snowman",
  "wind",
  "pebble",
  "shell",
  "twig",
  "sprout",
  "glacier",
  "canyon",
  "cave",
  "creek",
  "desert",
  "gem",
  "lake",
  "pond",
  "sunset",
  "orchid",
  "fountain",
  "grotto",
  "moss",
  "ivy",
  "moonbeam",
  "whisper",
  "echo",
];

function getRandomElement(arr: string[]): string {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function generateRandomUsername(): string {
  const adjective = getRandomElement(adjectives);
  const noun = getRandomElement(nouns);
  return `${adjective}_${noun}`;
}
