function nop(){}

function ld_de_xx(byte, byte2){
  cpu.register.de = bytesToShort(byte, byte2)
}

function jr_z_x(byte){
  if(cpu.register.f.z){
    // byte needs to be converted to signed.
    // gbc is two's complement according to bgb behavior
    cpu.register.pc += byte + 2
  }
}

function xor_a(){
  cpu.register.a = cpu.math.xor(cpu.register.a, cpu.register.a)
}

function jp_xx(byte, byte2){
  cpu.register.pc = bytesToShort(byte, byte2)
}

function cp_a_x(byte){
  cpu.math.subtract(cpu.register.a, byte)
}

function rst_38(){
  mem.writeStack(cpu.register.pc + 1)
  cpu.register.pc = 0x38
}
