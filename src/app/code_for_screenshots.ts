import { first, firstValueFrom, from, lastValueFrom, take } from 'rxjs';

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});

const observable = from(promise);

const promiseFromFirstValue = firstValueFrom(observable);
const promiseFromLastValue = lastValueFrom(observable);

const justEmitOnce = observable.pipe(take(1));
// OR (subtle difference not part of this lesson)
const justEmitOnce2 = observable.pipe(first());
