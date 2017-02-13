function nop(){}

function rst_38(){
  mem.writeStack(cpu.register.pc + 1)
  cpu.register.pc = 0x38
}