import { Component, OnInit } from '@angular/core';
import { spotify } from 'src/app/config/spotify-api.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  title = 'wikidata-spotify-matcher';
  username = '';

  async ngOnInit() {
    const me = await spotify.getMe();
    this.username = me.display_name;
  }

}
