import { Component, OnInit, ViewEncapsulation, OnChanges } from '@angular/core';
import * as c3 from 'c3';
import * as d3 from 'd3';
import * as RTM from 'satori-rtm-sdk';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  headcountToday = 54;
  endpoint = 'wss://ato03bl2.api.satori.com';
  appkey = 'BCcF501feb8d81a3C3a8BfD472e987b7';
  channelName = 'channel123';
  currentCounter = {
    occupancy: 0,
    capacity: 100,
  };

  constructor() { }

  ngOnInit() {
    this.connectToSatori();
    this.generateCharts();
  }

  generateCharts() {
    this.generateGauge();
    this.fixGauge(); // translation fix to show the gauge labels
    this.generateDemographicPie();
    this.generateBarChart();
    this.generateHeatMap();
  }

  connectToSatori() {
    const client = new RTM(this.endpoint, this.appkey);
    client.on('enter-connected', function () {
      console.log('Connected to Satori RTM!');
    });
    client.on('error', (error) => {
      let reason;
      if (error.body) {
        reason = error.body.error + ' - ' + error.body.reason;
      } else {
        reason = 'unknown reason';
      }
      console.log('RTM client failed: ' + reason);
    });
    client.start();

    const subscription = client.subscribe(this.channelName, RTM.SubscriptionMode.SIMPLE, {
      filter: 'SELECT * FROM `channel123` WHERE id = "5" AND type="Restaurant"'
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
      pdu.body.messages.forEach((msg) => {
        console.log(msg);
        this.currentCounter = Object.assign({}, msg);
        this.headcountToday += 3;
        this.generateCharts();
      });
    });
  }

  generateGauge() {
    const chart = c3.generate({
      bindto: '#headcount-gauge',
      data: {
        columns: [
          ['data', this.currentCounter['occupancy']]
        ],
        type: 'gauge'
      },
      gauge: {
        min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
        max: +this.currentCounter['capacity'], // 100 is default
      },
      color: {
        pattern: ['#00B7D6', '#F6C600', '#60B044', '#FF0000'], // the three color levels for the percentage values.
        threshold: {
//            unit: 'value', // percentage is default
//            max: 200, // 100 is default
          values: [30, 60, 90, 100]
        }
      },
      size: {
        height: 200
      },
    });
  }

  fixGauge() {
    setTimeout(
      () => {
        d3.select('g.c3-chart-arcs')
          .attr('transform', 'translate(164.8515625,171)');
      }, 50);

  }

  generateDemographicPie() {
    const chart = c3.generate({
      bindto: '#demographic-pie',
      data: {
        columns: [
          ['Male', 30],
          ['Female', 20],
        ],
        type : 'pie',
        onclick: function (d, i) { console.log('onclick', d, i); },
        onmouseover: function (d, i) { console.log('onmouseover', d, i); },
        onmouseout: function (d, i) { console.log('onmouseout', d, i); }
      },
      size: {
        height: 200
      },
      color: {
        pattern: ['#00B7D6', '#6DDBEB']
      },
    });
  }

  generateBarChart() {
    const chart = c3.generate({
      bindto: '#headcount-barchart',
      data: {
        columns: [
          ['Occupants', 30, 200, 100, 400, 150, 250, 220, 130, 110, 120, 100, 110, 130, 50,
            30, 200, 100, 400, 150, 250, 220, 130, 110, 120]
        ],
        type: 'bar'
      },
      color: {
        pattern: ['#00B7D6']
      },
      bar: {
        width: {
          ratio: 0.8 // this makes bar width 50% of length between ticks
        }
      }
    });
  }

  generateHeatMap() {
  }

}

