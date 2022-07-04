import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatMainModel} from "../../../models/chat-main.model";
import {HttpChatService} from "../../../services/http-chat.service";
import {ChatService} from "../../../services/chat.service";
import {ErrorModel} from "../../../../shared/error/models/error.model";
import {Chat} from "../../../models/chat.model";

@Component({
  selector: 'app-chat-cards-item',
  templateUrl: './chat-cards-item.component.html',
  styleUrls: ['./chat-cards-item.component.scss']
})
export class ChatCardsItemComponent implements OnInit {

  @Input() public chat: Chat;
  @Output() onChoose: EventEmitter<Chat> = new EventEmitter();
  public title: string;

  constructor(
    private httpChatService: HttpChatService,
    private chatService: ChatService) {
  }
  ngOnInit(): void {
    this.title = this.chat?.getChatTitle();
  }

  public edit() {

  }

  public choose(chat: Chat) {
    this.onChoose.emit(chat);
  }

  public deleteChatSpace(chat: Chat) {
    // const idChatSpace: string = chat.getChatMainId();
    // this.httpChatService.deleteChatSpace(idChatSpace).subscribe(
    //   () => {
    //     this.chatService.deleteChatSpace(idChatSpace);
    //   },
    //   (err: ErrorModel) => {
    //     console.log('Упал deleteChatSpace', err);
    //   }
    // );
  }
}