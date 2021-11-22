## How google analytics works

Since angular is a single page application, I implemented router checking. So when a user activates the Router function, it is recorded as visiting a new part of the page.

For optimal user tracking and continued work on Treecreate.dk after we have launched, it is important that we work eventEmitters into the more important actions of our users. ex:

1. How long they spend creating a design
2. How many designs they create
3. How go from one page to the other

When you are working on an important action for the page like: sign in, create account etc, please add a google event emitter, so we can track usage.

## how to use the EVENT EMITTER for google analytics

I have created a google-analytics.service.ts file that you can use to trigger events. We should only use this for events we believe can bring us valuable insight from our users. Here is an example of an add_to_cart event:

```ts
import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';

@Component({
  selector: 'google-button-test',
  templateUrl: './google-button-test.component.html',
  styleUrls: ['./google-button-test.component.css'],
})
export class GoogleButtonTestComponent {
  constructor(public googleAnalyticsService: GoogleAnalyticsService) {}

  testGoogleEventEmitter() {
    console.log('testing google event emitter');
    this.googleAnalyticsService.eventEmitter('add_to_cart', 'shop', 'cart', 'click', 1);
  }
}
```

As you can see, you need to do the following:

1. import GoogleAnalyticsService
2. add it in the constroctor -> public googleAnalyticsService: GoogleAnalyticsService
3. add a line of code specifying what kind of event it is, that should trigger when the event happens.
   -> this.googleAnalyticsService.eventEmitter( "add_to_cart", "shop", "cart", "click", 1 );

## How to write the correct event for .eventEmitter()

To add an eventEmitter you must add a line of code in the beginning of the method that you want to trigger an event. Here is an example:

googleAnalyticsService.eventEmitter( "eventName", "eventCategory", "eventAction", "eventLabel", "eventValue" );

This is how the constructor is built:

```ts
    eventName: string,                  //Just a name for the event: drag_box, add_to_cart, close_page

    eventCategory: string,              //Categories are chosen like: profile, shop, home

    eventAction: string,                //Action describes what user is doing, example: click, drag, close

    eventLabel: string = null,          //Basic label that you choose: 'happy_customer', 'chose_large'

    eventValue: number = null           //Is the value that it saves in the event emitter: 1, 100 (integer)

    //(could be used for saved money, amount purchased or time spent in a place. ex. when page is opened timer is set. when user leaves, the time is recorded. )
```

You can create your own event or use one of googles pre set events. For a full list of events created by [google:](https://developers.google.com/analytics/devguides/collection/gtagjs/events)

[Github source:](https://github.com/dottedsquirrel/AngularGoogleAnalytics)

[Webpage description of google eventhandling for anngular:](https://medium.com/madhash/how-to-properly-add-google-analytics-tracking-to-your-angular-web-app-bc7750713c9e)
