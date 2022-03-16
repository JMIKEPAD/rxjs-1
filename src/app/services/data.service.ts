import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, interval, map, Observable, of, range, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public counter = new BehaviorSubject<number>(0);

  constructor() { }


  createInterval(): Observable<string>{
    return interval(1000).pipe(
      filter(number => number % 2 === 0),
      map(number => "numero " + number)
    )
  }

  createTimer(): Observable<string>{
    return timer(5000, 2000).pipe(
      filter(number => number % 2 === 0),
      map(number => "numero " + number)
    )
  }

  getObservableArray(): Observable<number[]>{
    const array = [0, 5, 8, 12, 6];
    return of(array).pipe(
      map(array => array.map(numb => numb+1))
    );
  }

  getRange(): Observable<number>{
    return range(0, 2000).pipe(
      filter(number => number % 2 === 0)
    )
  }


  getCounter(): Observable<number>{
    return this.counter.pipe(
      map(numb => numb ** numb)
    );
  }



}
