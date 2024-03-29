import {Injectable} from '@angular/core';
import {FormControl, ValidationErrors} from "@angular/forms";

@Injectable()
export class CheckColumnsService {

  public checkColumns(control: FormControl): ValidationErrors | null {
    if (!!control?.value) {
      const reg = /<\/p>/gi;
      const found: number | undefined = control?.value.match(reg)?.length;
      return found > 4 ? {checkColumns: 'more than 5 lines'} : null;
    } else {
      return null;
    }

  }
}
