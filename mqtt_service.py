import network
import time
from umqtt.simple import MQTTClient
import ubinascii
from machine import reset, unique_id, Pin
import json


class SensorToMQTTService:
  def __init__(self, mqtt_topic, secrets, sub_callback):
    self.mqtt_topic = mqtt_topic
    self.secrets = secrets
    self.sub_callback = sub_callback
    self.wlan = self.connect_wlan()
    self.mqtt_client = self.connect_mqtt()
    self.led = Pin("LED", Pin.OUT)
    
  def connect_wlan(self):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(self.secrets.SSID, self.secrets.WIFI_PASSWORD)

    while wlan.isconnected() == False:
        print('waiting for connection')
        time.sleep(1)
    print('wifi connected')
    return wlan
  
  def connect_mqtt(self):
    mqtt_client_id = ubinascii.hexlify(unique_id())
    mqtt_client = MQTTClient(
            client_id=mqtt_client_id,
            server=self.secrets.MQTT_HOST,
            user=self.secrets.MQTT_USERNAME,
            password=self.secrets.MQTT_PASSWORD)
    try:
      mqtt_client.connect()
      mqtt_client.set_callback(self.sub_callback)
      print('mqtt broker connected')
      return mqtt_client
    except OSError as e:
      self.restart_and_reconnect()


  def restart_and_reconnect(self):
    print('Failed to connect to MQTT broker. Reconnecting...')
    self.led.value(0)
    time.sleep(10)
    reset()

  def main(self):
     try:
        self.led.value(1)
        while True:
            self.mqtt_client.subscribe(self.mqtt_topic)
            time.sleep(1)
              
     except Exception as e:
        print(f'Failed to publish message: {e}')
        self.restart_and_reconnect()




