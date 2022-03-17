import { Component, Injectable, OnInit} from '@angular/core';
import {IListInterface} from "../interface/list.interface";
import {ISpaceInterface} from "../interface/space.interface";
import {WorkSpaceService} from "../shared/services/work-space.service";
import {map, switchMap} from "rxjs/operators";
import {UsersService} from "../shared/services/users.service";
import {IUserInfoInterface} from "../interface/user-info.interface";
import {Observable} from "rxjs";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
@Injectable({
  providedIn: 'root'
})
export class FieldComponent implements OnInit {

  public spaces: ISpaceInterface[] = [];
  public currentSpace: ISpaceInterface;
  public usersWorkSpaceOwner$: Observable<IUserInfoInterface[]>;
  private idSpace: string;

  constructor(private readonly workSpaceService: WorkSpaceService,
              private readonly usersService: UsersService) {}

  ngOnInit(): void {

    this.workSpaceService.getWorkSave().pipe(
      map((value: ISpaceInterface[]) => {
        this.spaces = value;
        this.currentSpace = this.spaces[0];
        this.usersWorkSpaceOwner$ = this.usersService.searchUsersWorkSpace(this.currentSpace)
      } )).subscribe();

  }

  onAddList($event: IListInterface) {
     this.currentSpace.list.push($event)
    this.spacesAdd();
  }

  handleDeleteList($eventId: string | undefined) {
    this.currentSpace.list = this.currentSpace.list.filter(item => item._id !== $eventId);
    this.spacesAdd();
  }

  handleSpaceItem($event: ISpaceInterface) {
    this.spaces.push($event)
    this.spacesAdd();
  }

  spaceShow(space: ISpaceInterface) {
    this.searchUsersWorkSpace(space)
    console.log(space.owner)
    this.idSpace = '';
    this.currentSpace = this.spaces.find(item => item._id === space._id);
    this.idSpace = space._id;
    this.spacesAdd();
  }

  private searchUsersWorkSpace(space: ISpaceInterface) {
   this.usersWorkSpaceOwner$ = this.usersService.searchUsersWorkSpace(space)
  }

  spacesAdd() {
    const space: ISpaceInterface = {
      _id: this.currentSpace?._id,
      title: this.currentSpace?.title,
      list: this.currentSpace?.list,
      owner: this.currentSpace?.owner.length ? this.currentSpace?.owner : [JSON.parse(localStorage.getItem('userInfo'))._id],
    }
    this.workSpaceService.saveWorkSpace(space);
  }

  handleDeleteSpaceId(id: string) {
    this.workSpaceService.deleteWorkSpace(id).subscribe(
      () => {
        this.spaces = this.spaces.filter(item => item._id !== id);
      }
    )
  }

  //тут сделать запрос юзеров
  handleAddWorkspaceOwner($event: IUserInfoInterface) {
    this.currentSpace?.owner.push($event._id);
    this.workSpaceService.updateWorkSpaceOwner($event._id,  this.currentSpace._id)
      .pipe(
        switchMap((data: ISpaceInterface) => {
          return this.usersWorkSpaceOwner$ = this.usersService.searchUsersWorkSpace(data)
        }),

      ).subscribe()
  }

  handleDeletedWorkspaceOwner($event: IUserInfoInterface) {

    if(JSON.parse(localStorage.getItem('userInfo'))._id === this.currentSpace?.holder) {
      this.workSpaceService.deleteUserWorkSpace($event._id,  this.currentSpace._id)
        .subscribe(
          () => {
            this.currentSpace.owner = this.currentSpace?.owner.filter((val) => val !== $event._id)
            this.usersWorkSpaceOwner$ = this.usersWorkSpaceOwner$.pipe(map((value: IUserInfoInterface[]) => {
              return value.filter((item: IUserInfoInterface) => item._id !== $event._id)
            }))
          }
        )
    } else {
      console.log('Нельзя удалять пользователей если вы не владелец данного рабочего пространства');
    }
  }

}
