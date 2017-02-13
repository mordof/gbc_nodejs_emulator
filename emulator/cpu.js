
// disassembly, byteCount, funciton ref
var instructionSet = new Array(0xFF)

instructionSet[0x0] = ['Nop', 0, nop]
instructionSet[0xFF] = ['RST 0x38', 0, rst_38]

class CPU {
  constructor(rom){
    this.rom = rom;
    this.instructionIndex = 0;

    // most registers tend to start with 0,
    // but SP starts with 0xFFFE, and PC starts with
    // 0x0100
    this.register = {
      data: [0,0,0,0,0,0,0,0,0xFFFE,0x0100],

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

      get f(){ return this.data[5] },
      set f(v){ this.data[5] = v },

      get h(){ return this.data[6] },
      set h(v){ this.data[6] = v },

      get l(){ return this.data[7] },
      set l(v){ this.data[7] = v },

      get sp(){ return this.data[8] },
      set sp(v){ this.data[8] = v },

      get pc(){ return this.data[9] },
      set pc(v){ this.data[9] = v },

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
        this.data[3] = (val & 0xFF00) >> 8;
        this.data[4] = val & 0xFF;
      },

      get hl(){ },
      set hl(v){ }
    }
  }

  executeROM(){
    var self = this;
    var instruction;
    var hndl = setInterval(function(){
      instruction = instructionSet[self.rom[self.instructionIndex]]
      if(instruction){
        self.execInstruction(instruction)
      } else {
        console.error("CPU Instruction Not Found:")
        console.log(self.rom[self.instructionIndex]);
        clearInterval(hndl);
      }
    }, 100)
  }

  execInstruction(instr){
    // code
    console.log(instr[0])

    instr[2].apply(this, this.retrieveArgs(instr[1]))

    this.instructionIndex++;
  }

  retrieveArgs(count){
    var args = [];

    while(count > 0){
      this.instructionIndex++;
      args.push(this.rom[this.instructionIndex])
      count--;
    }

    return args;
  }
}