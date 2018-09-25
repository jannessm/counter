import { Component, OnInit } from '@angular/core';
import { formatDate, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import * as Moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  startTime = Moment('8:00', 'H:mm');
  end = Moment();
  duration:number = 8;
  start:string = '';
  endTime:string = '';
  countdown:string = '';
  negative:boolean = false;

  constructor(){
    registerLocaleData(localeDe, 'de');
  }

  ngOnInit(){
    this.start = formatDate(this.startTime.toString(), 'H:mm', 'de');
    this.updateEnd();
    let that = this;
    setInterval(() => {
      if(that.end){
        let endBuffer = Moment(that.end);
        let ms = endBuffer.diff(Moment().toObject());
        let minus = '';
        if (ms < 0){
          ms = ms*-1;
          minus = '-';
          this.negative = true;
        }else{
          this.negative = false;
        }
        let milli = ms%1000;
        let sec = parseInt( ""+((ms/1000)       % 60));
        let min = parseInt( ""+((ms/(60*1000))  % 60));
        let h = parseInt( ""+(ms/(60*60*1000)   % 24));
        that.countdown = minus+formatDate( Moment([h,min,sec,milli].join(':'), 'H:mm:ss:SSS').toDate(), 'H:mm:ss.SS', 'de');
      }
    }, 10);
  }

  updateStart(time){
    if(/:/g.test(time)){
      this.startTime = Moment(time, 'H:mm');
      this.start = formatDate(this.startTime.toString(), 'H:mm', 'de');
      this.updateEnd();
    }
  }
  updateDuration(time){
    const duration = parseFloat(time);
    if(duration){
      this.duration = duration;
      this.updateEnd()
    }
  }

  private updateEnd(){
    let d = this.duration;
    if(this.duration > 6){
      d = d + 0.5;
    }
    if(this.duration > 9){
      d = d + 0.25;
    }
    const dH = parseInt(''+d);
    const dm = parseInt(''+(d%1*60));
    let timeBuffer = Moment(this.startTime);
    timeBuffer.add(dH, 'h').add(dm, 'm');
    this.end = timeBuffer;
    this.endTime = formatDate( this.end.toString() , 'H:mm', 'de');
  }
}
