import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpace'
})
export class RemoveSpacePipe implements PipeTransform {

  transform(value: string): string {
    if(value === undefined){
      return 'undefined';
    }
    return value.replace(/\s/g, "");
  }

}
