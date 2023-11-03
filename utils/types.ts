export enum PageType {
  Conversation = "Conversation",
  Code = "Code",
  Image = "Image",
  Music = "Music",
  Video = "Video",
}

export interface IMessage {
  role: "user" | "assistant";
  content: string | string[];
}
