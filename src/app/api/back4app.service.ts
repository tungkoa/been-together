import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class Back4appService {

  constructor() {
    const appId = 'qaAA03vibNKC4SLsewm1XjxSFiHrGUVEIFnJdSm9';
    const jsKey = 'PydF91rn3TfQzkVKyCxJJFGwXzGVobpX3H3eko2K';
    Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
    Parse.initialize(appId, jsKey);
  }

  public createNote(note) {
    const dateNoteTable = Parse.Object.extend('dateNote');
    const dateNote = new dateNoteTable();
    dateNote.set('note', note);
    dateNote.set('date', note.date);
    return new Promise((rs, rj) => {
      dateNote.save().then(
        (result) => {
          rs(result);
          console.log('cập nhật thành công');
        },
        (error) => {
          console.error('Error while creating ParseObject');
        }
      );
    });

  }
  public getNote(date) {
    const dateNoteTable = Parse.Object.extend('dateNote');
    const query = new Parse.Query(dateNoteTable);
    query.equalTo('date', date);
    query.find().then((results) => {
      console.log('dateNote found', results);
    }, (error) => {
      console.error('Error while fetching dateNote', error);
    });
  }

  public getAllNote() {
    const dateNote = Parse.Object.extend('dateNote');
    const query = new Parse.Query(dateNote);
    return new Promise((rs, rj) => {
      query.find().then((results) => {
        rs(results);
        console.log('dateNote found', results);
      }, (error) => {
        console.error('Error while fetching dateNote', error);
      });
    });
  }

  public createFeedback(feedbackContent) {
    const feedBackTable = Parse.Object.extend('feedBack');
    const feedBack = new feedBackTable();
    return new Promise((rs, rj) => {
      feedBack.set('feedback', feedbackContent);
      feedBack.save().then(
        (result) => {
          rs();
          console.log('cập nhật thành công');
        },
        (error) => {
          console.error('Error while creating ParseObject');
        }
      );
    });

  }

  public getAllFb() {
    const feedBackTable = Parse.Object.extend('feedBack');
    const query = new Parse.Query(feedBackTable);
    return new Promise((rs, rj) => {
      query.find().then((results) => {
        rs(results);
        console.log('fb found', results);
      }, (error) => {
        console.error('Error while fetching dateNote', error);
      });
    });
  }

  public deleteFb(id) {
    const feedBack = Parse.Object.extend('feedBack');
    const query = new Parse.Query(feedBack);
// here you put the objectId that you want to delete
    return new Promise((rs, rj) => {
      query.get(id).then((object) => {
        object.destroy().then((response) => {
          rs();
          console.log('Deleted feedBack', response);
        }, (error) => {
          console.error('Error while deleting feedBack', error);
        });
      });
    });

  }
}
