from machine import Pin, SPI
import max7219
from time import sleep
import _thread
import json

class Message_Controller:
    OFF = 'OFF'
    ON = 'ON'
    
    def __init__(self, msg):
        self.msg=msg
        self.baton = _thread.allocate_lock()
        self.display_status = False
    
    def set_onAir(self, status):
        self.onAir = status.decode("utf-8")        
        
        
    def msg_callback(self, status, message):
        if message:
            self.msg = message
        
        if (not self.display_status and status == Message_Controller.ON):
            return self.declare_message()
        if(self.display_status and status == Message_Controller.OFF):
            return self.terminate_message()

    def terminate_message(self):
        self.baton.acquire()
        self.display_status = False
        self.baton.release()
        
    def declare_message(self):
        self.display_status = True
        _thread.start_new_thread(self._handle_scroll_message, ())
        
       
    def _handle_scroll_message(self):
        spi = SPI(0,sck=Pin(2),mosi=Pin(3))
        cs = Pin(5, Pin.OUT)
        display = max7219.Matrix8x8(spi, cs,4)
        display.brightness(4)
        display.fill(0)
        display.show()
        while True:
            self.baton.acquire()
            length = len(self.msg)
            column = (length * 8)
            if (not self.display_status):
                print('breaking from looping')
                self.baton.release()
                break
            for x in range(32, -column, -1):
                display.fill(0)
                display.text(self.msg ,x,1,1)
                display.show()
                sleep(0.1)
            self.baton.release()
