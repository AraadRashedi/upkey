import { IFeeds } from './feed.model';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  feeds?: IFeeds;
}

export type IUsers = IUser[];