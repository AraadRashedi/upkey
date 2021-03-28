import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input() public users: any[] = [];

  @Output() public select: EventEmitter<any> = new EventEmitter();
  @Output() public loadAllFeeds: EventEmitter<void> = new EventEmitter();

  private activeUserId: number | null = null;


  constructor() { }


  public selectUser(user: any): void {
    if (this.activeUserId === user.id) {
      return;
    }

    this.select.emit(user);
    this.activeUserId = user.id;
  }

  public trackByFn = (index: number, _: any): number => _.id || index;
}
