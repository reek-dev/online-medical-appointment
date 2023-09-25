import { Component } from '@angular/core';
import { faCloudDownload, faDownload } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
  plusIcon = faDownload;
}
