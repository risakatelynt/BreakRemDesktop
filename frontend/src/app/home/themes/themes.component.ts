import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent {
  themes = [{ name: 'Purple Lake', value: 'default' }, { name: 'Sanguine', value: 'sanguine' }, { name: 'Ocean Blue', value: 'ocean-blue' },
  { name: 'Fake Plant', value: 'fake-plant' }, { name: 'Plum Plate', value: 'plum-plate' }, { name: 'Yosemite', value: 'yosemite' }, { name: 'Antarctica', value: 'antarctica' },
  { name: 'White', value: 'white' }];

  constructor(private themeService: ThemeService) { }

  // set selected theme
  setTheme(theme: string) {
    this.themeService.setThemeService(theme).subscribe(
      (response) => {
        if (response['resp'] == 'success') {
          this.themeService.setTheme(theme);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}