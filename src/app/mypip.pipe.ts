import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mypip'
})
export class MypipPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
