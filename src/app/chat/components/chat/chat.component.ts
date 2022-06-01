import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Action} from "../../enum/action";
import {Event} from "../../enum/event";
import {SocketService} from "../../services/socket.service";
import {Messages} from "../interface/messages.interface";
import {User} from "../interface/user.interface";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DialogUserComponent} from "../dialog-user/dialog-user.component";
import {DialogUserType} from "../../enum/dialog-user-type";
import {MatList, MatListItem} from "@angular/material/list";
import {StoreUserService} from "../../services/store-user-service";
import {Message} from "../../models/message.model";

const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  action = Action;
  user: User;
  messages: Messages[] = [];
  messageContent: string;
  ioConnection: any;
  storedUserName: string;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      title_pt: 'Bem-vindo',
      dialogType: DialogUserType.NEW
    }
  };

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, {read: ElementRef, static: true}) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, {read: ElementRef}) matListItems: QueryList<MatListItem>;

  constructor(private socketService: SocketService,
              private storedUser: StoreUserService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    this.initModel();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.openUserPopup(this.defaultDialogUserParams);
    }, 0);
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initModel(): void {
    const randomId: number = this.getRandomId();
    this.user = {
      id: randomId,
      avatar: `${AVATAR_URL}/${randomId}.png`
    };
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });


    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        title_pt: 'Alterar',
        dialogType: DialogUserType.EDIT
      }
    });
  }

  private openUserPopup(params: MatDialogConfig<any>): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }
      this.storedUserName = this.storedUser.getStoredUser();

      this.user.name = paramsDialog.username;

      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.storedUser.storeUser(this.user.name);
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.storedUser.storeUser(this.user.name);
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: message
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action
      };
    } else if (action === Action.RENAME) {
      message = {
        action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    }

    this.socketService.send(message);
  }

}
// @Component({
//   selector: 'app-components',
//   templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.scss']
// })
// export class ChatComponent implements OnInit {
//
//   action = Action;
//   user: User;
//   messages: Message[] = [];
//   messageContent: string;
//   ioConnection: any;
//
//   constructor(private socketService: SocketService) { }
//
//   ngOnInit(): void {
//     this.initIoConnection();
//   }
//
//   private initIoConnection(): void {
//     this.socketService.initSocket();
//
//     this.ioConnection = this.socketService.onMessage()
//       .subscribe((message: Message) => {
//         this.messages.push(message);
//       });
//
//     this.socketService.onEvent(Event.CONNECT)
//       .subscribe(() => {
//         console.log('connected');
//       });
//
//     this.socketService.onEvent(Event.DISCONNECT)
//       .subscribe(() => {
//         console.log('disconnected');
//       });
//   }
//
//   // public sendMessage(message: string): void {
//   //   if (!message) {
//   //     return;
//   //   }
//   //
//   //   this.socketService.send({
//   //     from: this.user,
//   //     content: message
//   //   });
//   //   this.messageContent = null;
//   // }
//   //
//   // public sendNotification(params: any, action: Action): void {
//   //   let message: Message;
//   //
//   //   if (action === Action.JOINED) {
//   //     message = {
//   //       from: this.user,
//   //       action: action
//   //     }
//   //   } else if (action === Action.RENAME) {
//   //     message = {
//   //       action: action,
//   //       content: {
//   //         username: this.user.name,
//   //         previousUsername: params.previousUsername
//   //       }
//   //     };
//   //   }
//   //
//   //   this.socketService.send(message);
//   // }
//
// }
