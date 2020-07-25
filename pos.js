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
let upperInterval = 0;
let lowerInterval = 0;
let upperIndex = 0;
let lowerIndex = 0;
const upper = (t) => {
  clearInterval(upperInterval)
  upperIndex = 0
  if (t.length > 20) {
    upperInterval = setInterval(() => {
      if(upperIndex + 20 > t.length){
        upperIndex = 0;
      }
      const str = t.substring(upperIndex,upperIndex + 20)
      xy(1,1,str);
      upperIndex += 1;
    }, 1000)
  }
  else {
    xy(1,1,t);
  }
};

const lower = (t) =>{
  clearInterval(lowerInterval);
  lowerIndex = 0;
  if (t.length > 20) {
    lowerInterval = setInterval(() => {
      if(lowerIndex + 20 > t.length){
        lowerIndex = 0;
      }
      const str = t.substring(lowerIndex, lowerIndex + 20);
      xy(1,2,str);
      lowerIndex += 1;
    }, 1000)
  }
  else {
    xy(1,2,t);
  }
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
  port.write(new Buffer([0x1B, 0x13]));
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
