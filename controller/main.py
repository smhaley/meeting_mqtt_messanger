from secrets import Secrets
from MqttService import MqttService
from MessageController import MessageController

handler = MessageController('')
MQTT_TOPIC = 'in_meeting'
MQTT_TOPIC_STATUS = 'in_meeting_status'
    
if __name__ == '__main__':
    service = MqttService(MQTT_TOPIC, MQTT_TOPIC_STATUS, Secrets, handler.msg_callback)
    service.main()
    


