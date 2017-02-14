function nop(){}

function ld_de_xx(byte, byte2){
  cpu.register.de = bytesToShort(byte, byte2)
}

function jp_xx(byte, byte2){
  var short = bytesToShort(byte, byte2)
  cpu.register.pc = short
}

function cp_a_x(byte){
  // we don't actually write to register A.
  // all this is meant to do is populate register F appropriately
  var res = cpu.register.a - byte
  var lowNibbleA = cpu.register.a & 0xF
  var lowNibbleByte = byte & 0xF

  cpu.register.f = {
    z: res === 0 || cpu.register.a === byte, 
    n: 1, 
    h: lowNibbleA - lowNibbleByte < 0, 
    c: cpu.register.a - byte < 0 || cpu.register.a < byte
  }
}

function rst_38(){
  mem.writeStack(cpu.register.pc + 1)
  cpu.register.pc = 0x38
}
