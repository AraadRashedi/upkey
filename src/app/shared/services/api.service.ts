import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

import { IFeed, IFeeds } from '../models/feed.model';
import { IUser, IUsers } from '../models/user.model';
import { randomNumber } from '../utils/random.util';
import datetime from '../vendor/datetime.vendor';


const fieldsHandler: Record<string, (_: any, __:any) => string> = {
  'USERNAME': (username: string) => username,
  'ANOTHER': (username: string, usernames: string[]) => usernames.filter(u => u !== username)[ randomNumber(usernames.length - 1) ],
  'NUMBER': () => randomNumber(9) + '',
};


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private usernames: string[] = [];
  private rawFeeds: string[] = [];


  constructor(private _http: HttpClient) {
    //
    // pre required data to generate random and dynamic feeds
    this.initPreRequiredAssets();
  }


  private initPreRequiredAssets(): void {
    //
    // data from https://www.mockaroo.com/
    this._http.get<string[]>(`../../../assets/data/feeds.data.json`)
      .pipe(catchError(this.handleError))
      .subscribe(feeds => this.rawFeeds = feeds);
    //
    // data from https://www.mockaroo.com/
    this._http.get<string[]>(`../../../assets/data/usernames.data.json`)
      .pipe(catchError(this.handleError))
      .subscribe(usernames => this.usernames = usernames);
  }

  public getUsers(): Observable<IUsers> {
    //
    // data from https://www.mockaroo.com/
    return this._http.get<IUsers>(`../../../assets/data/users.data.json`).pipe(
      catchError(this.handleError),
      map(users => this.initUsersFeeds(users))
    );
  }

  private initUsersFeeds(users: IUsers): IUsers {
    return users.map(({ feeds, firstName, lastName, ...rest }: IUser) => ({
      ...rest,
      firstName,
      lastName,
      feeds: feeds?.map(feed => this.addRawFeedsToUser(feed))
                   .map(feed => this.addGenericFieldsIntoFeeds(feed, firstName + ' ' + lastName)),
    }));
  }

  private addRawFeedsToUser(feed: IFeed): IFeed {
    return ({
      ...feed,
      content: this.rawFeeds[ randomNumber(this.rawFeeds.length) - 1 ],
    });
  }

  private addGenericFieldsIntoFeeds({ content, ...rest }: IFeed, username: string): IFeed {
    return ({
      ...rest,
      content: content.split(/%*%/g).map(slice => fieldsHandler[ slice ]?.(username, this.usernames) || slice).join(''),
    });
  }
  
  public getUser(id: string): Observable<IUser> {
    return this.getUsers().pipe(
      catchError(this.handleError),
      map(users => users.find(u => u.id === id) ?? {} as IUser),
      map(user => ({ ...user, feeds: this.sortFeeds(user.feeds || []) })),
      delay(randomNumber(9) * 100),
    );
  }

  public getAllFeeds(): Observable<IFeeds> {
    return this.getUsers().pipe(
      catchError(this.handleError),
      map(users => this.serializeFeeds(users)),
      map(feeds => this.sortFeeds(feeds)),
      delay(randomNumber(9) * 100),
    );
  }

  private serializeFeeds(users: IUsers): IFeeds {
    return users.reduce((allFeeds: IFeeds, user: IUser) => {

      const { feeds, ...owner } = user;
      return [ ...allFeeds, ...(feeds || []).map<IFeed>(p => ({ ...p, owner })) ];

    }, []);
  }

  private sortFeeds(feeds: IFeeds): IFeeds {
    //
    // sort feeds based on createdAt filed
    // new feeds come first
    return feeds.sort((f1: IFeed, f2: IFeed) => datetime(f2.createdAt).diff(datetime(f1.createdAt)));
  }

  private handleError = (reject: HttpErrorResponse): Observable<never> => {
    return throwError(reject)
  }
}
