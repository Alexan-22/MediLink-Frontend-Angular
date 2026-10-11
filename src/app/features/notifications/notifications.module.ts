import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationListComponent } from './notification-list/notification-list.component';

@NgModule({
  declarations: [NotificationListComponent],
  imports: [
    CommonModule,
    FormsModule,
    NotificationsRoutingModule
  ]
})
export class NotificationsModule { }