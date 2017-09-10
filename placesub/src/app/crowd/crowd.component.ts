import { Component, OnInit, Output } from '@angular/core';
import * as RTM from 'satori-rtm-sdk';
import { PushNotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-crowd',
  templateUrl: './crowd.component.html',
  styleUrls: ['./crowd.component.css']
})
export class CrowdComponent implements OnInit {
  endpoint = 'wss://ato03bl2.api.satori.com';
  appkey = 'BCcF501feb8d81a3C3a8BfD472e987b7';
  channelName = 'channel123';
  channelNameFeed = 'subscriptions';
  viewSelection = 'Shop';
  client;
  updateLayers = false;
  @Output() locations = [];
  feeds = [];

  constructor(private _pushNotifications: PushNotificationsService) { }

  ngOnInit() {
    this.connectToSatori();
  }

  connectToSatori() {
    this.client = new RTM(this.endpoint, this.appkey);
    this.client.on('enter-connected', function () {
      console.log('Connected to Satori RTM!');
    });
    this.client.on('error', (error) => {
      let reason;
      if (error.body) {
        reason = error.body.error + ' - ' + error.body.reason;
      } else {
        reason = 'unknown reason';
      }
      console.log('RTM client failed: ' + reason);
    });
    this.client.start();

    const subscription = this.client.subscribe(this.channelName, RTM.SubscriptionMode.SIMPLE, {
      filter: 'SELECT * FROM `channel123` WHERE type = "' + this.viewSelection + '"',
      history: { count: 73 }
    });
    subscription.on('enter-subscribed', () => {
      // When subscription is established (confirmed by Satori RTM).
      console.log('Subscribed to the channel: ' + this.channelName);
    });
    subscription.on('rtm/subscribe/error', (pdu) => {
      // When a subscribe error occurs.
      console.log('Failed to subscribe: ' + pdu.body.error + ' - ' + pdu.body.reason);
    });
    subscription.on('rtm/subscription/data', (pdu) => {
      // Messages arrive in an array.
      this.locations = [];
      pdu.body.messages.forEach((msg) => {
        console.log(msg);
        this.locations.push(msg);
      });
    });
    const subscription_feed = this.client.subscribe(this.channelNameFeed, RTM.SubscriptionMode.SIMPLE, {
      filter: 'SELECT * FROM `subscriptions` WHERE type = "feed"',
      history: { count: 99 }
    });
    subscription_feed.on('enter-subscribed', () => {
      // When subscription is established (confirmed by Satori RTM).
      console.log('Subscribed to the channel: ' + this.channelNameFeed);
    });
    subscription_feed.on('rtm/subscribe/error', (pdu) => {
      // When a subscribe error occurs.
      console.log('Failed to subscribe: ' + pdu.body.error + ' - ' + pdu.body.reason);
    });
    subscription_feed.on('rtm/subscription/data', (pdu) => {

      pdu.body.messages.forEach((msg) => {
        console.log(msg);
        if (Math.random() * 10 > 9.5) {
          this.feeds.unshift(msg);
        }
      });
      this.feeds = this.feeds.splice(0, 10);
    });
  }

  onViewChange(event: Event) {
    this.viewSelection = (<HTMLInputElement>event.target).value;
    console.log(this.viewSelection);
    this.client.unsubscribe('channel123');
    this.updateLayers = true;
    this.connectToSatori();
    setTimeout(() => { this.updateLayers = false; }, 500);

  }

  subscribeUp() {
    console.log('sub up!');
    this.client.publish(this.channelNameFeed, {type : 'subscription', body: {
      uuid: 'lalala',
      loc: 'Extreme Pizza'
    }}, function (pdu) {
      if (pdu.action === 'rtm/publish/ok') {
        console.log('Publish confirmed');
      } else {
        console.log('Failed to publish. RTM replied with the error  ' +
          pdu.body.error + ': ' + pdu.body.reason);
      }
    });
  }

}
