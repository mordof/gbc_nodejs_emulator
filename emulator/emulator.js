var fs = require('fs');

var cpu;
var mem;

class Emulator {
  static loadROM(){
    // don't steal roms people! be sure to make your own.
    fs.readFile('../roms/rom_rom_rom.gb', function(err, data){
      mem = new Memory();
      cpu = new CPU(data);
      cpu.executeROM();
    })
  }
}

function log(){
  var args = Array.from(arguments);

  for(var i = 0; i < args.length; i++){
    if(typeof args[i] === 'number'){
      args[i] = "0x" + args[i].toString(16).toUpperCase()
    }
  }

  console.log.apply(console, args);
}