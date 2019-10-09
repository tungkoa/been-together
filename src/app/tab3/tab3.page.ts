import { Component , OnInit} from '@angular/core';
import {Back4appService} from '../api/back4app.service';
import { AppAvailability } from '@ionic-native/app-availability/';
import {Device} from '@ionic-native/device/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public isOpenFeedBack = false;
  public feedBackContent = '';
  public listShowFb: any = [];
  constructor(
    private back4appService: Back4appService,
    private inAppBrowser: InAppBrowser
  ) {}

  async ngOnInit() {
    await this.back4appService.getAllFb().then((res) => {
      this.listShowFb = res;
    });
  }

  public feedBack(option) {
    if (option === 'open') {
      this.isOpenFeedBack = true;
    } else {
      this.isOpenFeedBack = false;
    }
  }

  public createFeedBack(fb) {
    this.back4appService.createFeedback(fb).then(r => {
      this.back4appService.getAllFb().then((res) => {
        this.listShowFb = res;
      });
    });
    this.feedBack('close');
  }

  public deleteFb(id) {
    this.listShowFb.forEach((item, index) => {
      if (item.id === id) {
        this.listShowFb.splice(index, 1);
      }
    });
    this.back4appService.deleteFb(id);
  }

  public launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string, username: string) {
    const app = androidPackageName;
    // if (Device.platform === 'iOS') {
    //   app = iosSchemaName;
    // } else if (Device.platform === 'Android') {
    //   app = androidPackageName;
    // } else {
    //   let browser = new InAppBrowser(httpUrl + username, '_system');
    //   return;
    // }

    AppAvailability.check(app).then(
      () => { // success callback
        const browser = this.inAppBrowser.create(appUrl + username, '_system');
      },
      () => { // error callback
        const browser = this.inAppBrowser.create(httpUrl + username, '_system');
      }
    );
  }

  public openFacebook(username: string) {
    this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://page/', 'https://www.facebook.com/', username);
  }
}
