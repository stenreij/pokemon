import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeaturesModule } from '@pokemon/frontend/features';

@Component({
  standalone: true,
  imports: [RouterModule, FeaturesModule],
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
}
