# Meeting Messenger App and Controller

Simple UI and Raspberry Pi Pico Messenger

## Concept:

Wireless communication to others in the home because you can. Phones are overrated.

The project is a simple ui and microcontroller to inform others that you are busy.

## Hardware:

### Controller

- [See here](./display/README.md)

### Global

- The app and controller work over the MQTT protocol. An MQTT broker is needed.
- eclipse-mosquitto works very well as an in-network solution.
  - [a simple setup example](https://www.youtube.com/watch?v=juSoczXtlxA)
  - websockets must be enabled to use the UI.
  - Note all code is preconfigured with the assumption that the MQTT websockets are over 9001.
  - Adjust all Secrets and configs as necessary [controller](./display/secrets.py) and [ui](ui/src/constants/mqttConstants.ts)

## UI

- The UI is a simple static app
- As is, setup deployment is via docker.
- Ensure the correct host is found


## To set up
- Set up MQTT broker 
    - be sure to set up for websockets in addition to basic MQTT access
- Set up controller
    - install necessary deps
    - insert code
    - turn on
- ui
    - build and host the image
