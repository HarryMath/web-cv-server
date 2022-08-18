import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CutBodyPipe implements PipeTransform {

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type === 'body') {
      this.cutNullValues(value);
    }
    return value;
  }

  private cutNullValues(o: unknown): void {
    if (o === null || typeof o !== 'object' || Array.isArray(o)) {
      return;
    }
    Object.keys(o).forEach(key => {
      if (o[key] === null || o[key] === undefined) {
        delete o[key];
      }
    });
  }
}
