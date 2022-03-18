import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

const baconIpsum = [
  'Tail leberkas boudin swine burgdoggen meatball pork loin chicken venison shankle shank beef spare ribs filet mignon tri-tip',
  ' Turkey leberkas swine, meatball corned beef strip steak doner cow. Alcatra ribeye chicken prosciutto, leberkas salami pork belly shankle short loin',
  '  Porchetta pancetta landjaeger, t-bone biltong beef boudin picanha chuck swine',
  '  Filet mignon flank ribeye, beef short loin shankle swine kevin landjaeger sirloin buffalo short ribs alcatra',
  '  Tri-tip turkey salami spare ribs, hamburger andouille pork loin chicken sirloin cow burgdoggen',
  '  Leberkas doner jerky landjaeger, ham hock pork belly sirloin shoulder swine spare ribs ball tip',
  '  Swine short loin pastrami doner, prosciutto hamburger pork spare ribs pork belly brisket chicken rump fatback meatloaf',
  '  Tongue pork chop filet mignon shankle',
  '  Sirloin bacon short loin pork, biltong turducken porchetta t-bone short ribs tongue',
];

@Component({
  selector: 'webstore-quotable',
  templateUrl: './quotable.component.html',
  styleUrls: ['./quotable.component.scss'],
})
export class QuotableComponent implements OnInit {
  constructor(private http: HttpClient) {}

  quote = 'Yeet';

  ngOnInit() {
    this.quote = baconIpsum[Math.floor(Math.random() * baconIpsum.length)];
  }
}
