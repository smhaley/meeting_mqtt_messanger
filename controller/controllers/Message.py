import json

class Message:
    def __init__(self, status, currentMessage=None):
        self.message = {"status": status}
        if currentMessage:
            self.message["currentMessage"] = currentMessage

    def to_json(self):
        return json.dumps(self.message)