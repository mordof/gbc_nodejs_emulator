class Memory {
  constructor(){
    this.internal_ram = []
  }

  writeByte(address, val){
    // if(address >= 0xC000 && address <=  0xCFFF){
      log('Bank 0 RAM Write:', address, '(', val, ')')
      this.internal_ram[address] = val;
    // }
  }

  writeShort(address, val){
    // write the first byte to the immediate address
    this.writeByte(address, val & 0x00FF)
    // write the second byte to the address just after
    // the address specified.
    this.writeByte(address + 1, (val & 0xFF00) >> 8)
  }

  writeStack(val){
    cpu.register.sp -= 2;
    this.writeShort(cpu.register.sp, val)
    log('Updated Stack Loc:', cpu.register.sp)
  }
}