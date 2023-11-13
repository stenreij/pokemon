import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { FeaturesModule } from '@pokemon/frontend/features';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, FeaturesModule],
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
}
