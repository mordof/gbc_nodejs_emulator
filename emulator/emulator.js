class Emulator {
  static loadROM(){
    // don't steal roms people! be sure to make your own.
    fs.readFile('../roms/rom_rom_rom.gb', function(err, data){
      mem = new Memory();
      cpu = new CPU(data);
      gpu = new GPU();
      cpu.executeROM();
    })
  }
}
