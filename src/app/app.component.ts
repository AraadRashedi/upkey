import { Component } from '@angular/core';

import { ApiService } from './shared/services/api.service';
import { IFeeds, IFeed } from './shared/models/feed.model';
import { IUser, IUsers } from './shared/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  public header: { user: IUser | null; title: string | null } = { user: null, title: null };
  public users: IUsers = [];
  public selections: IFeeds = [];
  public isLoading: boolean = false;
  public favorites: Map<string, Set<string>> = new Map();

  
  constructor(private _api: ApiService) { }
  
  ngOnInit(): void {
    this.initUsers();
  }


  private initUsers(): void {
    this.isLoading = true;

    this._api.getUsers().subscribe(users => {
      this.users = users;
      this.isLoading = false;
    });
  }

  public onSelectUser(user: any): void {
    this.initHeaderSection(user);
    this.initUserPosts(user);
  }

  private initHeaderSection(user: any, title?: string): void {
    this.header = {
      user,
      title: title ?? (user.firstName + ' ' + user.lastName),
    };
  }

  private initUserPosts(user: any): void {
    this.isLoading = true;
    this.selections = [];

    this._api.getUser(user.id).subscribe(user => {
      const { feeds, ...owner } = user;

      this.selections = (feeds || []).map<IFeed>(p => ({ ...p, owner }));
      this.isLoading = false;
    });
  }

  public onLoadAllFeeds(): void {
    this.isLoading = true;
    this.selections = [];
    this.initHeaderSection(null, 'All');

    this._api.getAllFeeds().subscribe(feeds => {
      this.selections = feeds;
      this.isLoading = false;
    });
  }

  public toggleFavoriteFeed(ownerId: string, feedId: string): void {
    //
    // check having a favorite list for the selected user
    if (this.favorites.has(ownerId)) {
      //
      // check selected feed is in the favorite list
      this.favorites.get(ownerId)?.has(feedId) ?
        //
        // get the list and delete selected feed from the list 
        this.favorites.get(ownerId)?.delete(feedId) :
        //
        // get the list and add selected feed to the list
        this.favorites.get(ownerId)?.add(feedId);
    } else {
      //
      // create a new list for the selected user
      this.favorites.set(ownerId, new Set([ feedId ]));
    }
    
    //
    // clean empty favorite list
    if (this.favorites.get(ownerId)?.size === 0) {
      this.favorites.delete(ownerId);
    }
  }

  public isFavoriteFeed(ownerId: string, feedId: string): boolean {
    return !!this.favorites.get(ownerId)?.has(feedId);
  }

  public get isAnyUserSelected(): boolean {
    return this.isLoading || !!this.selections.length;
  }

  public trackByFn = (index: number, _: any): number => _.id || index;
}
