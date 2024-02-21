from controllers.Message import Message
from constants.MessageStatus import MessageStatus
from constants.MqttTopics import MqttTopics
from controllers.DisplayController import DisplayController

class MqttMessageController:  
    def __init__(self, mqtt_client):
        self.mqtt_client = mqtt_client
        self.current_message = None
        self.topic = None
        self.status = None
        self.message = None
        self.display_handler = DisplayController('')
         
    def extract_message_data(self, mqtt_topic, msg):
        self.topic = mqtt_topic.decode('utf-8')
        payload = eval(msg.decode('utf-8'))
        self.status = payload.get("status")
        self.message = payload.get("message")
        
    def message_callback(self, mqtt_topic, msg):
        self.extract_message_data(mqtt_topic, msg)
        if self.topic == MqttTopics.MQTT_TOPIC_STATUS:
            self.handle_status_check()
        elif self.topic == MqttTopics.MQTT_TOPIC:
            self.set_current_message()
            self.display_handler.handle_message(self.status, self.message)

    def set_current_message(self):
        if self.status == MessageStatus.OFF or self.message is None:
            self.current_message = None
        else:
            self.current_message = self.message
                
    def handle_status_check(self):
        if self.status == MessageStatus.PING:
            self.mqtt_client.publish(MqttTopics.MQTT_TOPIC_STATUS, Message(MessageStatus.PONG, self.current_message).to_json())
        