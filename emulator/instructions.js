function nop(){}

function ld_de_xx(byte, byte2){
  cpu.register.de = bytesToShort(byte, byte2)
}

function jp_xx(byte, byte2){
  var short = bytesToShort(byte, byte2)
  cpu.register.pc = short
}

function cp_a_x(byte){
  cpu.math.subtract(cpu.register.a, byte)
}

function rst_38(){
  mem.writeStack(cpu.register.pc + 1)
  cpu.register.pc = 0x38
}
