import random
import sys
import time
import csv

from satori.rtm.client import make_client, SubscriptionMode

# read csv of places
# for each location, randomize availability (50 - green, 70 - yellow, 90 - red)
# send to satori

class SubscriptionObserver(object):

    # Called when the subscription is established.
    def on_enter_subscribed(self):
        print('Subscribed to the channel: ' + channel)

    # This callback allows us to observe incoming messages
    def on_subscription_data(self, data):
        for message in data['messages']:
            print('Place is received:', message)

    def on_enter_failed(self, reason):
        print('Subscription failed, reason:', reason)
        sys.exit(1)


class RandomAvailability:
    def __init__(self):
        self.csv = []
        self.choices = [50, 70, 90]


    def read_n_randomize(self, csvfilename):
        count = 0
        with open(csvfilename) as csvfile:
            readCSV = csv.reader(csvfile, delimiter=',')
            for row in readCSV:
                count += 1
                place = {}
                place["id"] = row[0]
                place["loc"] = row[1]
                place["lat"] = row[2]
                place["lon"] = row[3]
                place["type"] = row[4]
                place["capacity"] = row[5]
                occupancy = row[6]
                place["occupancy"] = int(occupancy) + random.randint(-6,6)
                self.csv.append(place)
            return self.csv


    def publish(self, client):
        for row in self.csv:
            print row
            def publish_callback(ack):
                if ack['action'] == 'rtm/publish/ok':
                    print('Place is published:', row)
                elif ack['action'] == 'rtm/publish/error':
                    print(
                        'Publish failed, error {0}, reason {1}'.format(
                        ack['body']['error'], ack['body']['reason']))

            client.publish(channel, message=row, callback=publish_callback)
            sys.stdout.flush()


if __name__ == '__main__':
    endpoint = 'wss://ato03bl2.api.satori.com'
    appkey = 'BCcF501feb8d81a3C3a8BfD472e987b7'
    channel = 'channel123'

    with make_client(endpoint=endpoint, appkey=appkey) as client:
        print 'Connected to Satori RTM!'
        subscription_observer = SubscriptionObserver()
        client.subscribe(channel, SubscriptionMode.SIMPLE, subscription_observer)
        while True:
            r = RandomAvailability()
            csvdata = r.read_n_randomize('./data1.csv')
            for row in csvdata:
                print row
                def publish_callback(ack):
                    if ack['action'] == 'rtm/publish/ok':
                        pass
                    elif ack['action'] == 'rtm/publish/error':
                        print(
                            'Publish failed, error {0}, reason {1}'.format(
                            ack['body']['error'], ack['body']['reason']))
                client.publish(channel, message=row, callback=publish_callback)
                sys.stdout.flush()
            time.sleep(3)
