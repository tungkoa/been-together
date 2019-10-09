import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AfterViewInit} from '@angular/core';
import {CalendarModule} from 'ion2-calendar';
import {CalendarComponentOptions} from 'ion2-calendar';
import {Back4appService} from '../api/back4app.service';
import {Renderer2} from '@angular/core';
import {DateFormatter} from '@angular/common/src/pipes/deprecated/intl';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {IonDatetime} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, AfterViewInit {
  constructor(
    private httpClient: HttpClient,
    private calendar: CalendarModule,
    private back4appService: Back4appService,
    private localNotifications: LocalNotifications
  ) {
  }

  @ViewChild('calendarRef') calendarRef: ElementRef;
  // @ViewChild('timeAlarm') timeAlarm: IonDatetime;
  type: 'time'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    monthFormat: 'MM / YYYY',
    weekdays: ['CN', 'thứ 2', 'thứ 3', 'thứ 4', 'thứ 5', 'thứ 6', 'thứ 7'],
    monthPickerFormat: ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
      'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'],
    weekStart: 1,
    color: 'danger'
  };
  public dataWeather;
  public dailyForecasts;
  public date;
  public isOpenModal = false;
  public noteName = '';
  public noteContent = '';
  public showDataNote;
  public dataNote = {
    date: null,
    noteContent: [],
    ownerId: ''
  };
  public storeAllDataNote = [];
  public timeAlarm;

  async ngOnInit() {
    await this.back4appService.getAllNote().then((res) => {
      // this.storeAllDataNote = res;
{      for (let i in res) {
        this.storeAllDataNote.push(res[i].attributes);
      }
      this.showDateHasNote();}
      console.log('res', this.storeAllDataNote, typeof (res));
    });
    // await this.getWeather();
    // this.getTemperatura();
    // this.getIconWeather();
    return Promise.resolve();
  }

  ngAfterViewInit(): void {
  }
  private showDateHasNote() {
    this.storeAllDataNote.forEach((value, index) => {
      if (value.note) {
        if (value.note.noteContent) {
          if (value.note.noteContent.length > 0) {
            const dayElement = document.getElementById(value.date);
            console.log(dayElement);
            if (dayElement) {
              dayElement.style.backgroundColor = '#a0a0a0';
              dayElement.style.borderRadius = '36px';
            }
          }
        }
      }
    });
  }

  public monthChange() {
    setTimeout(() => {
      this.showDateHasNote();
    }, 0);
  }

  public onChangeDay(event) {
    console.log(event._i);
    const dayMilliseconds = event._i;
    this.dataNote.date = dayMilliseconds;
    const time = new Date(dayMilliseconds);
    this.date = time.getDate() + '/' + time.getMonth() + '/' + time.getFullYear();
    let count = 0;
    this.storeAllDataNote.forEach((value, index) => {
      if (dayMilliseconds === value.date) {
        count++;
        console.log(value.note.noteContent);
        this.showDataNote = value.note.noteContent;
      }
      if (count === 0) {
        this.showDataNote = [];
      }
    });
  }

  public createNote() {
    this.isOpenModal = !this.isOpenModal;
  }

  public closeModal() {
    this.isOpenModal = false;
  }

  public cancelAlarm() {
    this.timeAlarm = null;
  }

  public submitCreateNote() {
    const alarm = this.timeAlarm ? this.timeAlarm : null;
    console.log(alarm);
    const note = {
      noteName: this.noteName,
      noteContent: this.noteContent,
      alarm: alarm
    };
    this.dataNote.noteContent.push(note);
    console.log(this.dataNote);
    this.closeModal();
    // console.log(this.timeAlarm.value);
    this.back4appService.createNote(this.dataNote).then(r => {
      this.back4appService.getAllNote().then(res => {
        for (let i in res) {
          this.storeAllDataNote.push(res[i].attributes);
        }
        this.showDateHasNote();
      });
    });
  }

  public checkValidate() {
    if (this.noteName && this.noteContent) {
      if (this.noteName.length > 6 && this.noteContent.length > 6) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
