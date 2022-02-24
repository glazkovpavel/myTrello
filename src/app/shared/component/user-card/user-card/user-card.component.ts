import { Component, OnInit, Input } from '@angular/core';
import {IUserInfoInterface} from "../../../../interface/user-info.interface";

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() public userData: IUserInfoInterface;

  constructor() { }

  ngOnInit(): void {
  }

}