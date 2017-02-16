// 0x0 - 0xFF inclusive ends up being 0x100
var instructionSet = new Array(0x100);

// format for each instructionSet item:
// Instruction, byteCount (how many arg bytes), funciton ref
instructionSet[0x00] = ['NOP', 0, nop]
instructionSet[0x11] = ['LD DE', 2, ld_de_xx]
instructionSet[0x18] = ['JR', 1, jr_x]
instructionSet[0x28] = ['JR Z', 1, jr_z_x]
instructionSet[0xAF] = ['XOR A', 0, xor_a]
instructionSet[0xC3] = ['JP', 2, jp_xx]
instructionSet[0xE0] = ['LDH (0xFF00 + %x) A', 1, ldh_x_a]
instructionSet[0xEA] = ['LD %xx A', 2, ld_xx_a]
instructionSet[0xF3] = ['DI', 0, di]
instructionSet[0xFE] = ['CP A', 1, cp_a_x]
instructionSet[0xFF] = ['RST 0x38', 0, rst_38]

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
