// 0x0 - 0xFF inclusive ends up being 0x100
var instructionSet = new Array(0x100);

// format for each instructionSet item:
// Instruction, byteCount (how many arg bytes), funciton ref
instructionSet[0x00] = ['NOP', 0, () => {}]
instructionSet[0x01] = ['LD BC', 2, (x, y) => { ld_register_xx('bc', x, y) }]
instructionSet[0x02] = ['LD (BC) A', 0, () => { ld_memregister_register_byte('bc', 'a') }]
instructionSet[0x06] = ['LD B', 1, (x) => { ld_register_x('d', x) }]
instructionSet[0x08] = ['LD (%xx) SP', 2, (x, y) => { ld_memxx_register_short(bytesToShort(x, y), 'sp') }]
instructionSet[0x0A] = ['LD A (BC)', 0, () => { ld_register_memregister_byte('a', 'bc') }]
instructionSet[0x0E] = ['LD C', 1, (x) => { ld_register_x('c', x) }]
instructionSet[0x11] = ['LD DE', 2, (x, y) => { ld_register_xx('de', x, y) }]
instructionSet[0x12] = ['LD (DE) A', 0, () => { ld_memregister_register_byte('de', 'a') }]
instructionSet[0x16] = ['LD D', 1, (x) => { ld_register_x('d', x) }]
instructionSet[0x18] = ['JR', 1, jr_x]
instructionSet[0x1A] = ['LD A (DE)', 0, () => { ld_register_memregister_byte('a', 'de') }]
instructionSet[0x1E] = ['LD E', 1, (x) => { ld_register_x('e', x) }]
instructionSet[0x21] = ['LD HL', 2, (x, y) => { ld_register_xx('hl', x, y) }]
instructionSet[0x22] = ['LDI (HL) A', 0, () => { ld_memregister_register_byte('hl', 'a'); cpu.register.hl++; }]
instructionSet[0x26] = ['LD H', 1, (x) => { ld_register_x('h', x) }]
instructionSet[0x28] = ['JR Z', 1, jr_z_x]
instructionSet[0x2A] = ['LDI A (HL)', 0, () => { ld_register_memregister_byte('a', 'hl'); cpu.register.hl++; }]
instructionSet[0x2E] = ['LD L', 1, (x) => { ld_register_x('l', x) }]
instructionSet[0x31] = ['LD SP', 2, (x, y) => { ld_register_xx('sp', x, y) }]
instructionSet[0x32] = ['LDD (HL) A', 0, () => { ld_memregister_register_byte('hl', 'a'); cpu.register.hl--; }]
instructionSet[0x36] = ['LD (HL)', 1, (x) => { ld_memregister_x('hl', x) }]
instructionSet[0x3A] = ['LDD A (HL)', 0, () => { ld_register_memregister_byte('a', 'hl'); cpu.register.hl--; }]
instructionSet[0x3E] = ['LD A', 1, (x) => { ld_register_x('a', x) }]
instructionSet[0x40] = ['LD B B', 0, () => { ld_register_register('b', 'b') }]
instructionSet[0x41] = ['LD B C', 0, () => { ld_register_register('b', 'c') }]
instructionSet[0x42] = ['LD B D', 0, () => { ld_register_register('b', 'd') }]
instructionSet[0x43] = ['LD B E', 0, () => { ld_register_register('b', 'e') }]
instructionSet[0x44] = ['LD B H', 0, () => { ld_register_register('b', 'h') }]
instructionSet[0x45] = ['LD B L', 0, () => { ld_register_register('b', 'l') }]
instructionSet[0x46] = ['LD B (HL)', 0, () => { ld_register_memregister_byte('b', 'hl') }]
instructionSet[0x47] = ['LD B A', 0, () => { ld_register_register('b', 'a') }]
instructionSet[0x48] = ['LD C B', 0, () => { ld_register_register('c', 'b') }]
instructionSet[0x49] = ['LD C C', 0, () => { ld_register_register('c', 'c') }]
instructionSet[0x4A] = ['LD C D', 0, () => { ld_register_register('c', 'd') }]
instructionSet[0x4B] = ['LD C E', 0, () => { ld_register_register('c', 'e') }]
instructionSet[0x4C] = ['LD C H', 0, () => { ld_register_register('c', 'h') }]
instructionSet[0x4D] = ['LD C L', 0, () => { ld_register_register('c', 'l') }]
instructionSet[0x4E] = ['LD C (HL)', 0, () => { ld_register_memregister_byte('c', 'hl') }]
instructionSet[0x4F] = ['LD C A', 0, () => { ld_register_register('c', 'a') }]
instructionSet[0x50] = ['LD D B', 0, () => { ld_register_register('d', 'b') }]
instructionSet[0x51] = ['LD D C', 0, () => { ld_register_register('d', 'c') }]
instructionSet[0x52] = ['LD D D', 0, () => { ld_register_register('d', 'd') }]
instructionSet[0x53] = ['LD D E', 0, () => { ld_register_register('d', 'e') }]
instructionSet[0x54] = ['LD D H', 0, () => { ld_register_register('d', 'h') }]
instructionSet[0x55] = ['LD D L', 0, () => { ld_register_register('d', 'l') }]
instructionSet[0x56] = ['LD D (HL)', 0, () => { ld_register_memregister_byte('d', 'hl') }]
instructionSet[0x57] = ['LD D A', 0, () => { ld_register_register('d', 'a') }]
instructionSet[0x58] = ['LD E B', 0, () => { ld_register_register('e', 'b') }]
instructionSet[0x59] = ['LD E C', 0, () => { ld_register_register('e', 'c') }]
instructionSet[0x5A] = ['LD E D', 0, () => { ld_register_register('e', 'd') }]
instructionSet[0x5B] = ['LD E E', 0, () => { ld_register_register('e', 'e') }]
instructionSet[0x5C] = ['LD E H', 0, () => { ld_register_register('e', 'h') }]
instructionSet[0x5D] = ['LD E L', 0, () => { ld_register_register('e', 'l') }]
instructionSet[0x5E] = ['LD E (HL)', 0, () => { ld_register_memregister_byte('e', 'hl') }]
instructionSet[0x5F] = ['LD E A', 0, () => { ld_register_register('e', 'a') }]
instructionSet[0x60] = ['LD H B', 0, () => { ld_register_register('h', 'b') }]
instructionSet[0x61] = ['LD H C', 0, () => { ld_register_register('h', 'c') }]
instructionSet[0x62] = ['LD H D', 0, () => { ld_register_register('h', 'd') }]
instructionSet[0x63] = ['LD H E', 0, () => { ld_register_register('h', 'e') }]
instructionSet[0x64] = ['LD H H', 0, () => { ld_register_register('h', 'h') }]
instructionSet[0x65] = ['LD H L', 0, () => { ld_register_register('h', 'l') }]
instructionSet[0x66] = ['LD H (HL)', 0, () => { ld_register_memregister_byte('h', 'hl') }]
instructionSet[0x67] = ['LD H A', 0, () => { ld_register_register('h', 'a') }]
instructionSet[0x68] = ['LD L B', 0, () => { ld_register_register('l', 'b') }]
instructionSet[0x69] = ['LD L C', 0, () => { ld_register_register('l', 'c') }]
instructionSet[0x6A] = ['LD L D', 0, () => { ld_register_register('l', 'd') }]
instructionSet[0x6B] = ['LD L E', 0, () => { ld_register_register('l', 'e') }]
instructionSet[0x6C] = ['LD L H', 0, () => { ld_register_register('l', 'h') }]
instructionSet[0x6D] = ['LD L L', 0, () => { ld_register_register('l', 'l') }]
instructionSet[0x6E] = ['LD L (HL)', 0, () => { ld_register_memregister_byte('l', 'hl') }]
instructionSet[0x6F] = ['LD L A', 0, () => { ld_register_register('l', 'a') }]
instructionSet[0x70] = ['LD (HL) B', 0, () => { ld_memregister_register_byte('hl', 'b') }]
instructionSet[0x71] = ['LD (HL) C', 0, () => { ld_memregister_register_byte('hl', 'c') }]
instructionSet[0x72] = ['LD (HL) D', 0, () => { ld_memregister_register_byte('hl', 'd') }]
instructionSet[0x73] = ['LD (HL) E', 0, () => { ld_memregister_register_byte('hl', 'e') }]
instructionSet[0x74] = ['LD (HL) H', 0, () => { ld_memregister_register_byte('hl', 'h') }]
instructionSet[0x75] = ['LD (HL) L', 0, () => { ld_memregister_register_byte('hl', 'l') }]
instructionSet[0x77] = ['LD (HL) A', 0, () => { ld_memregister_register_byte('hl', 'a') }]
instructionSet[0x78] = ['LD A B', 0, () => { ld_register_register('a', 'b') }]
instructionSet[0x79] = ['LD A C', 0, () => { ld_register_register('a', 'c') }]
instructionSet[0x7A] = ['LD A D', 0, () => { ld_register_register('a', 'd') }]
instructionSet[0x7B] = ['LD A E', 0, () => { ld_register_register('a', 'e') }]
instructionSet[0x7C] = ['LD A H', 0, () => { ld_register_register('a', 'h') }]
instructionSet[0x7D] = ['LD A L', 0, () => { ld_register_register('a', 'l') }]
instructionSet[0x7E] = ['LD A (HL)', 0, () => { ld_register_memregister_byte('a', 'hl') }]
instructionSet[0x7F] = ['LD A A', 0, () => { ld_register_register('a', 'a') }]
instructionSet[0xAF] = ['XOR A', 0, xor_a]
instructionSet[0xC1] = ['POP BC', 0, () => { pop_short_stack_to_register('bc') }]
instructionSet[0xC3] = ['JP', 2, jp_xx]
instructionSet[0xC5] = ['PUSH BC', 0, () => { push_short_register_to_stack('bc') }]
instructionSet[0xD1] = ['POP DE', 0, () => { pop_short_stack_to_register('de') }]
instructionSet[0xD5] = ['PUSH DE', 0, () => { push_short_register_to_stack('de') }]
instructionSet[0xE0] = ['LDH (0xFF00 + %x) A', 1, (x) => { ld_memxx_register_byte(0xFF00 + x, 'a') }]
instructionSet[0xE1] = ['POP HL', 0, () => { pop_short_stack_to_register('hl') }]
instructionSet[0xE2] = ['LD (0xFF00 + C) A', 0, () => { ld_memxx_register_byte(0xFF00 + cpu.register.c, 'a') }]
instructionSet[0xE5] = ['PUSH HL', 0, () => { push_short_register_to_stack('hl') }]
instructionSet[0xEA] = ['LD (%xx) A', 2, (x, y) => { ld_memxx_register_byte(bytesToShort(x, y), 'a') }]
instructionSet[0xF0] = ['LDH A (0xFF00 + %x)', 1, (x) => { ld_register_memxx_short('a', 0xFF00 + x) }]
instructionSet[0xF1] = ['POP AF', 0, () => { pop_short_stack_to_register('af') }]
instructionSet[0xF2] = ['LD A (0xFF00 + C)', 0, () => { ld_register_memxx_short('a', 0xFF00 + cpu.register.c) }]
instructionSet[0xF3] = ['DI', 0, di]
instructionSet[0xF5] = ['PUSH AF', 0, () => { push_short_register_to_stack('af') }]
instructionSet[0xF8] = ['LDHL SP', 1, (x) => { ld_register_short('hl', cpu.math.add_sp_x(cpu.register.sp, x)) }]
instructionSet[0xF9] = ['LD SP HL', 0, () => { ld_register_register('sp', 'hl') }]
instructionSet[0xFA] = ['LD A (%xx)', 2, (x, y) => { ld_register_memxx_bytes('a', x, y) }]
instructionSet[0xFE] = ['CP A', 1, cp_a_x]
instructionSet[0xFF] = ['RST 0x38', 0, rst_38]

// Populates Byte Register with Memory Read (Short Arg)
function ld_register_memxx_short(registerDest, short){
  cpu.register[registerDest] = mem.readByte(short)
}

// Populates Byte Register with Memory Read (2 Bytes Args)
function ld_register_memxx_bytes(registerDest, byte1, byte2){
  ld_register_memxx_short(registerDest, bytesToShort(byte1, byte2))
}

// Populates Short Register Value Memory Location with Supplied Byte
function ld_memregister_x(registerDest, byte){
  mem.writeByte(cpu.register[registerDest], byte)
}

// Populates Short Memory Location with Short Register
function ld_memxx_register_short(short, register){
  mem.writeShort(short, cpu.register[register])
}

// Populates Short Memory Location with Byte Register
function ld_memxx_register_byte(short, register){
  mem.writeByte(short, cpu.register[register])
}

// Populates Short Register Value Memory Location with Byte Register
function ld_memregister_register_byte(registerDest, registerSrc){
  mem.writeByte(cpu.register[registerDest], cpu.register[registerSrc])
}

// Populates Byte Register with Byte Register Value Memory Read
function ld_register_memregister_byte(registerDest, registerSrc){
  cpu.register[register] = mem.readByte(cpu.register[registerSrc])
}

// Populates Byte Register with Byte
function ld_register_x(register, byte){
  cpu.register[register] = byte
}

// Populates Short Register with Short
function ld_register_short(register, short){
  cpu.register[register] = short
}

// Populates Short Register with Short made of Bytes
function ld_register_xx(register, byte, byte2){
  cpu.register[register] = bytesToShort(byte, byte2)
}

// Populates One Register with Another (Byte or Short, as long as they match)
function ld_register_register(registerDest, registerSrc){
  cpu.register[registerDest] = cpu.register[registerSrc]
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

function di(){
  cpu.queueDisableInterrupts()
}

function cp_a_x(byte){
  cpu.math.subtract(cpu.register.a, byte)
}

// POP Stack to Short Register
function pop_short_stack_to_register(register){
  cpu.register[register] = mem.readStack()
}

// PUSH Short Register to Stack
function push_short_register_to_stack(register){
  mem.writeStack(cpu.register[register])
}

function rst_38(){
  mem.writeStack(cpu.register.pc)
  cpu.register.pc = 0x38
}
