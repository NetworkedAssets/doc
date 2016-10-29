import {PipeTransform, Pipe} from '@angular/core';


export function isString(txt: any): boolean {
  return typeof txt === 'string';
}


@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): any {
    return (isString(value)) ? value.charAt(0).toUpperCase() + value.substr(1).toLowerCase() : '';
  }
}
