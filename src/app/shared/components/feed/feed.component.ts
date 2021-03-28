import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {

  @Input('data') public feed: any;
  @Input() public isFavorite: boolean = false;

  @Output('toggleFavorite') public onToggleFavorite: EventEmitter<string> = new EventEmitter();

}
