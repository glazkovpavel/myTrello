import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IListTodoInterface} from "../interface/todo.interface";
import {Observable} from "rxjs";

@Injectable()
export class TodoService {
  private isUrl: string = 'http://localhost:3000'


  constructor(private http: HttpClient) { }

  public createTodo(title: string): Observable<IListTodoInterface> {
  const jwt: string = localStorage.getItem('jwt');
  const data = {titleList: title}
    return this.http.post<IListTodoInterface>(`${this.isUrl}/todo`, data, {
      headers: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
  }
  public updateTodo(todoList: IListTodoInterface): Observable<IListTodoInterface> {

    const todo: IListTodoInterface = {
      _id: todoList._id,
      titleList: todoList.titleList,
      list: todoList.list
    }

    const jwt: string = localStorage.getItem('jwt');
    return this.http.patch<IListTodoInterface>(`${this.isUrl}/todo`, todo, {
      headers: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
  }

  public getTodo(): Observable<IListTodoInterface[]> {
    const jwt: string = localStorage.getItem('jwt');
    return this.http.get<IListTodoInterface[]>(`${this.isUrl}/todos`, {
      headers: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
  }

  public deleteTodoListById(todo: IListTodoInterface): Observable<IListTodoInterface> {
    const jwt: string = localStorage.getItem('jwt');
    return this.http.delete<IListTodoInterface>(`${this.isUrl}/todo/${todo._id}`, {
      headers: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
  }
}
