import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'greetingPipe'
})
export class GreetingPipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return `Hello ${value}!`;
  }

}
