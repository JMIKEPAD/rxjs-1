import { Component, OnInit } from '@angular/core';
import { SeaData } from './model/sea-data';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  public seaDataArray: SeaData[] = [];

  constructor(private dataServ: DataService){

  }

  ngOnInit(): void{
    // this.dataServ.createInterval().subscribe(number => console.log(number))

    // this.dataServ.createTimer().subscribe(number => console.log('timer',number))

    // this.dataServ.getObservableArray().subscribe(data => console.log(data));

    // this.dataServ.getRange().subscribe(number => console.log(number))

    // this.dataServ.getCounter().subscribe(count => console.log(count));

    this.dataServ.getSeaLevelData().subscribe(data => this.seaDataArray = data);



    
  }

  incrementCounter():void{
    this.dataServ.counter.next(this.dataServ.counter.value + 1);
  }


}
