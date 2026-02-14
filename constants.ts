import { WordConfig, SentencePart, HintInfo } from './types';

export const GRID_SIZE = 12;

export const WORD_LIST: WordConfig[] = [
  { word: "DHRUV", targetId: "name_me" },
  { word: "VALENTINE", targetId: "belief" },
  { word: "HELP", targetId: "help" },
  { word: "FEELING", targetId: "feeling" },
  { word: "LOYAL", targetId: "trait_1" },
  { word: "FUNNY", targetId: "trait_2" },
  { word: "DANCE", targetId: "action" },
  { word: "CUTE", targetId: "gf_trait_1" },
  { word: "SWEET", targetId: "gf_trait_2" },
  { word: "LOVE", targetId: "final_verb" },
  { word: "PRIYA", targetId: "name_her" },
];

export const WORD_HINTS: Record<string, HintInfo> = {
  "DHRUV": {
    word: "DHRUV",
    hintText: "The guy who built this because Dhruv loves this girl.",
    question: "What is one thing you appreciate about me?"
  },
  "PRIYA": {
    word: "PRIYA",
    hintText: "The girl who turned effort into meaning.",
    question: "What is your favorite quality about yourself?"
  },
  "LOYAL": {
    word: "LOYAL",
    hintText: "Being on your side always. No cheating. No switching.",
    question: "What does loyalty mean to you in one word?"
  },
  "FUNNY": {
    word: "FUNNY",
    hintText: "The one who makes me laugh.",
    question: "What is a moment we shared that made you laugh hard?"
  },
  "LOVE": {
    word: "LOVE",
    hintText: "Something we do to each other.",
    question: "How would you describe us in one word?"
  },
  "DANCE": {
    word: "DANCE",
    hintText: "You do it really, really well… on music.",
    question: "What song makes you think of me?"
  },
  "FEELING": {
    word: "FEELING",
    hintText: "Present participle of feel.",
    question: "How are you feeling right now?"
  },
  "HELP": {
    word: "HELP",
    hintText: "Four letters. What you were when I needed it most.",
    question: "What is one way you like to be supported?"
  },
  "VALENTINE": {
    word: "VALENTINE",
    hintText: "A day we don’t heavily believe in.",
    question: "What is your idea of a perfect date?"
  },
  "CUTE": {
    word: "CUTE",
    hintText: "Five letters. Starts with C. You deny it.",
    question: "What do you think is my cutest habit?"
  },
  "SWEET": {
    word: "SWEET",
    hintText: "And you smell like that.",
    question: "What is your favorite dessert?"
  }
};

export const SENTENCES: SentencePart[][] = [
  [
    { id: "s1_1", text: "As you know, I am " },
    { id: "s1_2", isBlank: true, targetId: "name_me" },
    { id: "s1_3", text: "." }
  ],
  [
    { id: "s2_1", text: "I don’t think we heavily believe in " },
    { id: "s2_2", isBlank: true, targetId: "belief" },
    { id: "s2_3", text: "." }
  ],
  [
    { id: "s3_1", text: "Firstly, thanks. You were a big " },
    { id: "s3_2", isBlank: true, targetId: "help" },
    { id: "s3_3", text: "." }
  ],
  [
    { id: "s4_1", text: "You didn’t back off when I was having a bad " },
    { id: "s4_2", isBlank: true, targetId: "feeling" },
    { id: "s4_3", text: "." }
  ],
  [
    { id: "s5_1", text: "Thanks for being so " },
    { id: "s5_2", isBlank: true, targetId: "trait_1" },
    { id: "s5_3", text: " and " },
    { id: "s5_4", isBlank: true, targetId: "trait_2" },
    { id: "s5_5", text: "." }
  ],
  [
    { id: "s6_1", text: "You " },
    { id: "s6_2", isBlank: true, targetId: "action" },
    { id: "s6_3", text: " really good." }
  ],
  [
    { id: "s7_1", text: "I’ll never find such a " },
    { id: "s7_2", isBlank: true, targetId: "gf_trait_1" },
    { id: "s7_3", text: " and " },
    { id: "s7_4", isBlank: true, targetId: "gf_trait_2" },
    { id: "s7_5", text: " girlfriend." }
  ],
  [
    { id: "s8_1", text: "I " },
    { id: "s8_2", isBlank: true, targetId: "final_verb" },
    { id: "s8_3", text: " you, " },
    { id: "s8_4", isBlank: true, targetId: "name_her" },
    { id: "s8_5", text: "." }
  ]
];