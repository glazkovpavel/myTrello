import {SpaseChat} from "../interface/space-chat";
import {User} from "../interface/user.interface";
import {Chat} from "./chat.model";

export class ChatMainModel {
  private readonly title: string = '';
  private readonly _id: string = '';
  private users: User[] = [];
  private chats: Chat[] = [];
  private currentChat: Chat;

  constructor(res: SpaseChat) {
    this.title = res.title;
    this._id = res._id;
    this.users = res.users;
    this.chats = res.chats;

  };

  public getTitle(): string {
    return this.title;
  };

  public getChatMainId(): string {
    return this._id;
  };

  // public setChat(chats: Chat[]): ChatMainModel {
  //    this.chats = chats;
  //    return this;
  // };

  public deleteChat(_id: string): ChatMainModel {
    this.chats = this.chats.filter((item: Chat) => item.getChatId() !== _id)
    return this;
  };

  public addChat(chat: Chat): ChatMainModel {
    this.chats.push(chat);
    return this;
  }

  public deleteUser(userId: string, chatId: string): ChatMainModel {
    this.chats.find(item => item.getChatId() === chatId).deleteUserFromChat(userId);
    return this;
  };

  public addUser(userId: string, chatId: string): ChatMainModel {
    this.chats.find(item => item.getChatId() === chatId).addUserInChat(userId);
    return this;
  };

  public setCurrentChat(chat: Chat): void {
    this.currentChat = chat;
  };

  public getChats(): Chat[] {
    return this.chats;
  };

}
