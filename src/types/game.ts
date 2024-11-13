export type Player = {
  id: number;
  name: string;
};

export type GameScreen = "setup" | "play";

export type Category =
  | "philosophical"
  | "soundscape"
  | "compositional"
  | "experimental"
  | "performance";

export type Strategies = {
  [key in Category]: string[];
};
