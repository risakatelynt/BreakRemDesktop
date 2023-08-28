import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateRemindersComponent } from './create-reminders/create-reminders.component';
import { ViewRemindersComponent } from './view-reminders/view-reminders.component';
import { ReminderIdeasComponent } from './reminder-ideas/reminder-ideas.component';
import { ThemesComponent } from './themes/themes.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home.component';
import { AnimationComponent } from './animation/animation.component';
import { ShowNotificationComponent } from './show-notification/show-notification.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: "create", component: CreateRemindersComponent },
      { path: "view", component: ViewRemindersComponent },
      { path: "ideas", component: ReminderIdeasComponent },
      { path: "animation", component: AnimationComponent },
      { path: "notification", component: ShowNotificationComponent },
      { path: "themes", component: ThemesComponent },
      { path: "settings", component: SettingsComponent },
      { path: "profile", component: ProfileComponent },
      { path: "about", component: AboutComponent },
      { path: "**", redirectTo: "view" }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
