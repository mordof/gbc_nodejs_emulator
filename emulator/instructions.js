function nop(){}

function ld_de_xx(byte, byte2){
  cpu.register.de = bytesToShort(byte, byte2)
}

function jr_x(byte){
  cpu.register.pc += cpu.math.signByte(byte)
}

function jr_z_x(byte){
  if(cpu.register.f.z){
    cpu.register.pc += cpu.math.signByte(byte)
  }
}

function xor_a(){
  cpu.register.a = cpu.math.xor(cpu.register.a, cpu.register.a)
}

function jp_xx(byte, byte2){
  cpu.register.pc = bytesToShort(byte, byte2)
}

function ldh_x_a(byte){
  mem.writeByte(0xFF00 + byte, cpu.register.a)
}

function ld_xx_a(byte, byte2){
  mem.writeByte(bytesToShort(byte, byte2), cpu.register.a)
}

function di(){
  cpu.queueDisableInterrupts()
}

function cp_a_x(byte){
  cpu.math.subtract(cpu.register.a, byte)
}

function rst_38(){
  mem.writeStack(cpu.register.pc)
  cpu.register.pc = 0x38
}
