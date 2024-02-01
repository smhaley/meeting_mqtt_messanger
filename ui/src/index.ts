// import { MQTTService } from "./MQTTHandler";
import {publishAMessage} from  "./MQTTHandler";
// function init() {
//   const mqtt = new MQTTService();

//   const pubButton = document.getElementById("mqtt_pub");
//   console.log(pubButton);
//   pubButton?.addEventListener("click", mqtt.publishMessage);
//   console.log("balh");
// }

// init();
const pubButton = document.getElementById("mqtt_pub");
console.log(pubButton);
pubButton?.addEventListener("click", publishAMessage)
