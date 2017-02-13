function nop(){}

function jp_xx(byte, byte2){
  var short = (byte2 << 8) + byte
  log("JP Short: ", short)
  cpu.register.pc = short
}

function cp_a_x(byte){
  // we don't actually write to register A.
  // all this is meant to do is populate register F appropriately
  // TODO: populate register F
  cpu.register.a - byte
}

function rst_38(){
  mem.writeStack(cpu.register.pc + 1)
  cpu.register.pc = 0x38
}
