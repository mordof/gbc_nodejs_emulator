class Memory {
  constructor(){
    this.internal_ram_bank_id = 1
    this.internal_ram = [[], [], [], [], [], [], [], []]
  }

  readShort(address){
    var val = this.readByte(address + 1) << 8
    val += this.readByte(address)
    return val
  }

  readByte(address){
    if(address >= 0xC000 && address <= 0xCFFF){
      return this.internal_ram[0][address];
    } else {
      console.error('Read Attempt at Unimplemented Address', convertShortToHex(address))
    }
  }

  writeByte(address, val){
    if(address >= 0xC000 && address <=  0xCFFF){
      // log('Bank 0 RAM Write:', address, '(', val, ')')
      this.internal_ram[0][address] = val;
    } else {
      console.error('Memory Location', convertShortToHex(address), 'has not been implemented yet')
    }
  }

  writeShort(address, val){
    // write the first byte to the immediate address
    this.writeByte(address, val & 0x00FF)
    // write the second byte to the address just after
    // the address specified.
    this.writeByte(address + 1, (val & 0xFF00) >>> 8)
  }

  readStack(){
    var val = this.readShort(cpu.register.sp)
    cpu.register.sp += 2;
    return val;
  }

  writeStack(val){
    cpu.register.sp -= 2;
    this.writeShort(cpu.register.sp, val)
    log('Updated Stack Loc:', cpu.register.sp)
  }
}
