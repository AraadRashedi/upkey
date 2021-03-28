import { IUser } from './user.model';

export interface IFeed {
  id: string;
  content: string;
  createdAt: string;
  owner: IUser;
}

export type IFeeds = IFeed[];