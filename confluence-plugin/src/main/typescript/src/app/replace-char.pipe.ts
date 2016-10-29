import {PipeTransform, Pipe} from '@angular/core';

// Check if the value is supported for the pipe
export function isString(txt: any): boolean {
  return typeof txt === 'string';
}


@Pipe({
  name: 'replace'
})
export class ReplaceCharPipe implements PipeTransform {
  transform(value: string, what: string, withWhat: string): any {
    return value.split(what).join(withWhat);
  }
}
