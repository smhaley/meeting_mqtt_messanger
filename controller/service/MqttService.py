import network
import time
from umqtt.simple import MQTTClient
import ubinascii
from machine import reset, unique_id, Pin
from controllers.MqttMessageController import MqttMessageController

class MqttService:
 
  def __init__(self, secrets, mqtt_topics):
    self.secrets = secrets
    self.wlan = self.connect_wlan()
    self.mqtt_client = self.connect_mqtt()
    self.led = Pin("LED", Pin.OUT)
    self.mqtt_topics = mqtt_topics
    
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
      message_controller = MqttMessageController(mqtt_client)
      mqtt_client.set_callback(message_controller.message_callback)
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
            self.mqtt_client.subscribe(self.mqtt_topics.MQTT_TOPIC)
            self.mqtt_client.subscribe(self.mqtt_topics.MQTT_TOPIC_STATUS)
            time.sleep(1)
              
     except Exception as e:
        print(f'Failed to publish message: {e}')
        self.restart_and_reconnect()

