// // Create a client instance
import * as Paho from "paho-mqtt";

const client = new Paho.Client(
  "decentservice.xyz",
  9001,
  "client-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now()
);


console.log(client.host, client.isConnected())
// set callback handlers
// client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
// client.connect({ onSuccess: onConnect });

client.connect({
    userName: "mqtt",
    password: "mqtt",
    onSuccess: function () {
        console.log("connected");
        onConnect()
    },
    onFailure: function (err) {
        console.log("connect failed: " + err.errorMessage);
    },
});

export const publishAMessage = () => {
    console.log('ssss')
    const message = new Paho.Message("Hello");
    message.destinationName = "World";
    client.send(message);
} 

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("test");
//   message = new Paho.MQTT.Message("Hello");
//   message.destinationName = "World";
//   client.send(message);
}

// // called when the client loses its connection
// function onConnectionLost(responseObject) {
//   if (responseObject.errorCode !== 0) {
//     console.log("onConnectionLost:"+responseObject.errorMessage);
//   }
// }

// // called when a message arrives
function onMessageArrived(message: any) {
  console.log("onMessageArrived:"+message.payloadString);
}
