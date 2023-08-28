import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { CreateRemindersComponent } from './create-reminders/create-reminders.component';
import { ViewRemindersComponent } from './view-reminders/view-reminders.component';
import { ReminderIdeasComponent } from './reminder-ideas/reminder-ideas.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { InnerSpinnerComponent } from './inner-spinner/inner-spinner.component';
import { ModalComponent } from './modal/modal.component';
import { NavigationPanelComponent } from './navigation-panel/navigation-panel.component';
import { AnimationComponent } from './animation/animation.component';
import { ShowNotificationComponent } from './show-notification/show-notification.component';
import { ThemesComponent } from './themes/themes.component';

@NgModule({
  declarations: [
    HomeComponent,
    CreateRemindersComponent,
    ViewRemindersComponent,
    SettingsComponent,
    AboutComponent,
    ProfileComponent,
    InnerSpinnerComponent,
    ModalComponent,
    ReminderIdeasComponent,
    NavigationPanelComponent,
    AnimationComponent,
    ShowNotificationComponent,
    ThemesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
