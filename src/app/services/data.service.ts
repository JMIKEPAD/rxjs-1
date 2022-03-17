import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  interval,
  map,
  Observable,
  of,
  range,
  timer,
} from 'rxjs';
import { SeaData } from '../model/sea-data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly API_URL =
    'https://erddap.emodnet-physics.eu/erddap/tabledap/EP_ERD_INT_RVFL_AL_TS_NRT.csv0?time%2CRVFL%2CRVFL_QC&EP_PLATFORM_ID=%223130579%22';

  public counter = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getSeaLevelData(): Observable<SeaData[]> {
    return this.http
      .get<string>(this.API_URL, { responseType: 'text' as 'json' }).pipe(
        map((data) => this.parseCSV(data)), 
        map((data) => this.assignIcon2(data)),
        map((data) => data.sort((d1, d2) => d1.date.getTime() - d2.date.getTime()))
      );
  }

  parseCSV(csv: string): SeaData[] {
    const seaDataArray: SeaData[] = [];

    const lines = csv.split(/\r?\n/);

    for (const line of lines) {
      if (line !== '') {
        const seaData = {} as SeaData;
        const words = line.split(',');

        const date = new Date(words[0]);
        const value = parseFloat(words[1]);

        seaData.date = date;
        seaData.value = value;

        seaDataArray.push(seaData);
      }
    }

    return seaDataArray;
  }

  assignIcon(seaDataArray: SeaData[]): SeaData[] {
    for (let i = 0; i < seaDataArray.length; i++) {
      const element = seaDataArray[i];
      if (i === 0) {
        element.iconName = 'start';
      } else {
        const previous = seaDataArray[i - 1];
        if (element.value > previous.value) {
          element.iconName = 'up';
        } else if (element.value < previous.value) {
          element.iconName = 'down';
        } else {
          element.iconName = 'equal';
        }
      }
    }
    return seaDataArray;
  }

  assignIcon2(seaDataArray: SeaData[]): SeaData[] {
    const mean = this.calculateMean(seaDataArray);

    for (let i = 0; i < seaDataArray.length; i++) {
      const element = seaDataArray[i];
      if (element.value > mean) {
        element.iconName = 'up';
      } else if (element.value < mean) {
        element.iconName = 'down';
      } else {
        element.iconName = 'equal';
      }
    }
    return seaDataArray;
  }

  calculateMean(seaDataArray: SeaData[]): number {
    const mean = seaDataArray.reduce((p, c) => p + c.value, 0) / seaDataArray.length;
    return this.roundTo(mean, 1);
  }

  roundTo(numberToRound:number, decimals: number){
    const tenPow = 10 ** decimals;
    const roundedInt = Math.round(numberToRound * tenPow);
    return roundedInt / tenPow;
  }

  createInterval(): Observable<string> {
    return interval(1000).pipe(
      filter((number) => number % 2 === 0),
      map((number) => 'numero ' + number)
    );
  }

  createTimer(): Observable<string> {
    return timer(5000, 2000).pipe(
      filter((number) => number % 2 === 0),
      map((number) => 'numero ' + number)
    );
  }

  getObservableArray(): Observable<number[]> {
    const array = [0, 5, 8, 12, 6];
    return of(array).pipe(map((array) => array.map((numb) => numb + 1)));
  }

  getRange(): Observable<number> {
    return range(0, 2000).pipe(filter((number) => number % 2 === 0));
  }

  getCounter(): Observable<number> {
    return this.counter.pipe(map((numb) => numb ** numb));
  }
}
