import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {IdGeneratorService} from "../../shared/services/id-generator.service";
import {ISpaceInterface} from "../../interface/space.interface";
import {IUserInfoInterface} from "../../interface/user-info.interface";

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit, OnDestroy {
  public value: string = '';
  public id: string | undefined;
  @Input() public spacesArray: Observable<ISpaceInterface[]>;

  @Output() spaceItem:  EventEmitter<ISpaceInterface> = new EventEmitter();
  @Output() spaceCurrent:  EventEmitter<ISpaceInterface> = new EventEmitter();
  @Output() handleDeleteSpaceId:  EventEmitter<string> = new EventEmitter();
  private subId: Subscription;

  constructor(private idGeneratorService: IdGeneratorService) { }

  ngOnInit(): void {}

  showSpace(idSpace: ISpaceInterface){
    this.spaceCurrent.emit(idSpace);
  }

  handleSpaceId($event: string) {
    this.handleDeleteSpaceId.emit($event)
  }

  onAddSpace() {
    if(this.value){
      const holder: IUserInfoInterface = JSON.parse(localStorage.getItem('userInfo'))
      this.subId = this.idGeneratorService.onId().subscribe(
        val => this.id = val);
      this.spaceItem.emit({
        title: this.value,
        _id: this.id,
        list: [],
        owner: [],
        holder: holder._id,
      } )
      this.id = '';
      this.value = '';
    }
    return;
  }

  ngOnDestroy(): void {
    if (this.subId){
      this.subId.unsubscribe()
    }
  }

}
