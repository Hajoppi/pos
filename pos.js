const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const translations = {
  'ä': '\173',
  'ö': '\174',
  'å': '\175',
  'Ä': '\133',
  'Ö': '\134',
  'Å': '\135',
}

const xy = (x, y, t) => {
  const buffer = new Buffer([0x1F, 0x24, x, y]);
  port.write(buffer);
  let a = "";
  for (let i = 0; i < t.length; i += 1){
    const l = t[i];
    if(Object.keys(translations).includes(l)) {
      a += translations[l];
    }
    else {
      a += l;
    }
  }
  port.write(a);
};

const upper = (t) => {
  xy(1,1,t);
};

const lower = (t) =>{
  xy(1,2,t);
};

const showTime = () => {
  const dt = new Date();
  port.write(new Buffer([0x1F, 0x54, dt.hour, dt.minute]));
};

const showTimeMsg = (msg) => {
  showTime();
  upper(msg);
};

const blink = (duration=0) => {
  port.write(new Buffer([0x1F, 0x45, duration]));
};

const clear = () => {
  port.write(new Buffer([0x0C]));
};

port.on('error', function(err) {
  console.log('Error: ', err.message)
});

const init = () => {
  port.write(new Buffer([0x1B, 0x52, 11]));
};
module.exports =  {
  upper,
  lower,
  showTime,
  showTimeMsg,
  blink,
  clear,
  init,
}
