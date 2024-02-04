from secrets import Secrets
from mqtt_service import SensorToMQTTService
from message_controller import Message_Controller


handler = Message_Controller('')
MQTT_TOPIC = 'in_meeting'
    
if __name__ == '__main__':
    service = SensorToMQTTService(MQTT_TOPIC, Secrets, handler.msg_callback)
    service.main()

    


