from constants.Secrets import Secrets
from service.MqttService import MqttService
from constants.MqttTopics import MqttTopics

if __name__ == '__main__':
    service = MqttService(Secrets, MqttTopics)
    service.main()
    


