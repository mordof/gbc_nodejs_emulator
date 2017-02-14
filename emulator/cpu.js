
// disassembly, byteCount, funciton ref
var instructionSet = new Array(0xFF)

instructionSet[0x0] = ['NOP', 0, nop]
instructionSet[0x11] = ['LD DE', 2, ld_de_xx]
instructionSet[0xC3] = ['JP', 2, jp_xx]
instructionSet[0xFE] = ['CP A', 1, cp_a_x]
instructionSet[0xFF] = ['RST 0x38', 0, rst_38]

class CPU {
  constructor(rom){
    this.rom = rom;

    // most registers tend to start with 0,
    // but SP starts with 0xFFFE, and PC starts with
    // 0x0100
    this.register = {
      data: [0,0,0,0,0,0,0,0,0xFFFE,0x0100],
      pcUpdated: false,

      get a(){ return this.data[0] },
      set a(v){ this.data[0] = v },

      get b(){ return this.data[1] },
      set b(v){ this.data[1] = v },

      get c(){ return this.data[2] },
      set c(v){ this.data[2] = v },

      get d(){ return this.data[3] },
      set d(v){ this.data[3] = v },

      get e(){ return this.data[4] },
      set e(v){ this.data[4] = v },

      // F register gets set differently
      get f(){ return this.data[5] },
      set f({ z, n, h, c }){
        var val;
        val = Number(z)
        val = val << 1
        val += Number(n)
        val = val << 1
        val += Number(h)
        val = val << 1
        val += Number(c)
        val = val << 4
        this.data[5] = val
      },

      get h(){ return this.data[6] },
      set h(v){ this.data[6] = v },

      get l(){ return this.data[7] },
      set l(v){ this.data[7] = v },

      get sp(){ return this.data[8] },
      set sp(v){ this.data[8] = v },

      get pc(){ return this.data[9] },
      set pc(v){ this.data[9] = v; this.pcUpdated = true },

      get af(){ },
      set af(v){ },

      get bc(){ },
      set bc(v){ },

      get de(){
        // if 0xFF is in D, and 0x80 is in E, when we read
        // this we need to build this into 0xFF80.
        return (this.register[3] << 8) + this.register[4];
      },
      set de(v){
        this.data[3] = (v & 0xFF00) >> 8;
        this.data[4] = v & 0xFF;
      },

      get hl(){ },
      set hl(v){ }
    }
  }

  executeROM(){
    var instruction;
    var hndl = setInterval(() => {
      instruction = instructionSet[this.rom[this.register.pc]]
      if(instruction){
        this.execInstruction(instruction)
      } else {
        console.error("CPU Instruction Not Found:")
        log(this.rom[this.register.pc]);
        clearInterval(hndl);
      }
    }, 100)
  }

  execInstruction(instr){
    var args = this.retrieveArgs(instr[1])

    // code
    log(this.register.pc, instr[0], args)

    instr[2].apply(this, args)

    if(!this.register.pcUpdated)
      this.register.pc += 0x1 + instr[1];

    this.register.pcUpdated = false
  }

  retrieveArgs(count){
    var args = [];
    var origPC = this.register.pc;

    while(count > 0){
      this.register.pc += 0x1;
      args.push(this.rom[this.register.pc])
      count--;
    }

    this.register.pc = origPC;
    this.register.pcUpdated = false;

    return args;
  }
}
