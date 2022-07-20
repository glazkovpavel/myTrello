import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Action, Store} from "@ngrx/store";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {addTodo, loadTodoList, loadTodoListSuccess, updateCurrentTodoList} from "../actions/todo.action";
import {map, switchMap, withLatestFrom} from "rxjs/operators";
import {TodoService} from "../../services/todo.service";
import {IListTodoInterface, ITodoInterface} from "../../interface/todo.interface";
import {getCurrentTodoListSelector} from "../selectors/todo.selectors";

@Injectable()
export class TodoEffect {
  public listLoad$: Observable<Action> = createEffect(
    () => this.actions
      .pipe(
        ofType(loadTodoList),
        switchMap(() => this.todoService.getTodo().pipe(
          map((list: IListTodoInterface[]) => loadTodoListSuccess({list}))
        ))
      )
  )

  public addTodo$: Observable<Action> = createEffect(
    () => this.actions
      .pipe(
        ofType(addTodo),
        withLatestFrom(this.store.select(getCurrentTodoListSelector)),
        switchMap(([{todo}, currentList]: [{ todo: ITodoInterface }, IListTodoInterface]) => {
          const arara = currentList.list.concat()
          arara.unshift(todo)
          const array = {
            ...currentList,
            list: arara
          }
          return this.todoService.updateTodo(array).pipe(
            map((currentList: IListTodoInterface) => updateCurrentTodoList({currentList}))
          );
        })
      )
  )

  // public updateList$: Observable<Action> = createEffect(
  //   () => this.actions.pipe(
  //     ofType(updateCurrentTodoList),
  //     map
  //   )
  // )

  constructor(
    private actions: Actions,
    private todoService: TodoService,
    private store: Store
  ) {
  }
}