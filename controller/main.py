from secrets import Secrets
from machine import Pin
from mqtt_service import SensorToMQTTService
from message_controller import Message_Controller

handler = Message_Controller('')
MQTT_TOPIC = 'in_meeting'
MQTT_TOPIC_STATUS = 'mqtt_topic_status'
    
if __name__ == '__main__':
    service = SensorToMQTTService(MQTT_TOPIC, MQTT_TOPIC_STATUS, Secrets, handler.msg_callback)
    service.main()
    


