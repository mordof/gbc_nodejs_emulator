// OpCodes that mark cpu.lastIsCP to true
var cpInstructions = [0xB8,0xB9,0xBA,0xBB,0xBC,0xBD,0xBE,0xBF,0xFE];

// instruction set, and instructions all defined in instructions.js

class CPU {
  constructor(rom){
    this.rom = rom;
    this.lastIsCP = false;
    this.signingArr = new Int8Array(1)
    this.interruptsEnabled = true;
    this.disableInterruptQueued = false;
    this.loopHndl;

    var self = this;

    this.dataOutput = {
      meminfo: document.querySelector('.mem_info'),
      f_flags: document.querySelector('.f_flags'),
      registers: document.querySelector('.registers')
    }

    this.math = {
      add_sp_x(SP, x){
        var res = SP + x;

        cpu.register.f = {
          z: 0,
          n: 0,
          h: (SP & 0xF) + (x & 0xF) > 0xF,
          c: res > 0xFF
        }

        return res
      },
      add(x, y){
        var res = x + y;

        cpu.register.f = {
          z: res === 0 || (self.lastIsCP ? x === y : false),
          n: 0,
          h: (x & 0xF) + (y & 0xF) > 0xF,
          c: res > 0xFF || (self.lastIsCP ? x < y : false)
        }

        return res
      },
      add_16(x, y){
        var res = x + y

        cpu.register.f = {
          z: cpu.register.f.z,
          n: 0,
          h: (x & 0xFFF) + (y & 0xFFF) > 0xFFF,
          c: res > 0xFFFF
        }

        return res
      },
      subtract(A, y){
        var res = A - y

        cpu.register.f = {
          z: res === 0 || (self.lastIsCP ? A === y : false),
          n: 1,
          h: (A & 0xF) - (y & 0xF) < 0x0,
          c: res < 0x0 || (self.lastIsCP ? A === y : false)
        }

        return res
      },
      xor(n, x){
        var res = n ^ x;

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: 0
        }

        return res;
      },
      and(x, y){
        var res = x & y;

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 1,
          c: 0
        }

        return res
      },
      or(x, y){
        var res = x | y;

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: 0
        }

        return res
      },
      inc(x){
        var res = x + 1

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: (x & 0xF) + 1 > 0xF,
          c: cpu.register.f.c
        }

        return res
      },
      dec(x){
        var res = x - 1

        cpu.register.f = {
          z: res === 0,
          n: 1,
          h: (x & 0xF) - 1 < 0x0,
          c: cpu.register.f.c
        }

        return res
      },
      signByte(x){
        // stupid way of converting to signed byte for now.
        self.signingArr[0] = x;
        return self.signingArr[0]
      }
    }

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
      get f(){
        return {
          z: !!(this.data[5] & 0b10000000),
          n: !!(this.data[5] & 0b01000000),
          h: !!(this.data[5] & 0b00100000),
          c: !!(this.data[5] & 0b00010000)
        }
      },
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

      get af(){ return (this.data[0] << 8) + this.data[5] },
      set af(v){
        this.data[0] = (v & 0xFF00) >> 8;
        // the least significant byte is always 0000 for register F
        // in the GameBoy Z80 implementation, regardless what gets
        // written to it.
        this.data[5] = v & 0xF0;
      },

      get bc(){ return (this.data[1] << 8) + this.data[2] },
      set bc(v){
        this.data[1] = (v & 0xFF00) >> 8;
        this.data[2] = v & 0xFF;
      },

      get de(){
        // if 0xFF is in D, and 0x80 is in E, when we read
        // this we need to build this into 0xFF80.
        return (this.data[3] << 8) + this.data[4];
      },
      set de(v){
        this.data[3] = (v & 0xFF00) >> 8;
        this.data[4] = v & 0xFF;
      },

      get hl(){ return (this.data[6] << 8) + this.data[7] },
      set hl(v){
        this.data[6] = (v & 0xFF00) >> 8;
        this.data[7] = v & 0xFF;
      }
    }
  }

  stopExecution(){
    clearInterval(this.loopHndl)
  }

  queueDisableInterrupts(){
    this.queueDisablingInterrupts = true;
  }

  disableInterrupts(){
    this.interruptsEnabled = false;
  }

  enableInterrupts(){
    this.interruptsEnabled = true;
  }

  executeROM(){
    var instruction;
    var opCode;
    var interruptsQueuedForDisable = false;
    this.loopHndl = setInterval(() => {
      opCode = this.rom[this.register.pc]
      // interrupts can be queued to be disabled after the NEXT instruction.
      // in this case, we check to see if it's been queued by the last
      // instruction, then clear the flag.
      interruptsQueuedForDisable = this.queueDisablingInterrupts;
      this.queueDisablingInterrupts = false;

      // in our math operations we need to know if the last OP is
      // a CP type OpCode. This influences the F register flags that get set.
      if(cpInstructions.indexOf(opCode) > -1)
        this.lastIsCP = true;

      // grab the instruction implementation details for the current OpCode
      instruction = instructionSet[opCode]
      if(instruction){
        this.execInstruction(instruction)
      } else {
        console.error("CPU Instruction Not Found:")
        console.log(
          `%c${convertShortToHex(this.register.pc)} %c${convertByteToHex(this.rom[this.register.pc])}`,
          'color: #999', 'color: #222');
        clearInterval(this.loopHndl);
      }

      // after execution, we check if our loop has interrupts queued for disable
      if(interruptsQueuedForDisable){
        this.disableInterrupts();
      }

      this.lastIsCP = false;
      interruptsQueuedForDisable = false
    }, 100)
  }

  execInstruction(instr){
    // step the PC up one so it's pointing after the instruction.
    // this is important for collecting args, and for working with
    // pc inside of the instruction
    this.register.pc += 1;

    var args = this.retrieveArgs(instr[1])

    var argOutput = ""

    if(args.length === 2){
      argOutput = convertShortToHex(bytesToShort(args[0], args[1]))
    } else if(args.length === 1) {
      argOutput = convertByteToHex(args[0])
    }

    // log what pc the instruction resides at, the instruction, and the arg details
    console.log(
      `%c${convertShortToHex(this.register.pc - 1 - args.length)}` +
     ` %c${instr[0]}` +
     ` %c${argOutput}`, 'color: #999', 'color: #222', 'color: #4073ff')

    // run the instruction
    instr[2].apply(this, args)

    var f_register = this.register.f
    this.dataOutput.f_flags.innerHTML = `
      Z: ${f_register.z ? "1" : "0"}<br>
      N: ${f_register.n ? "1" : "0"}<br>
      H: ${f_register.h ? "1" : "0"}<br>
      C: ${f_register.c ? "1" : "0"}`

          this.dataOutput.registers.innerHTML = `
      AF: ${convertShortToHex(this.register.af)}<br>
      BC: ${convertShortToHex(this.register.bc)}<br>
      DE: ${convertShortToHex(this.register.de)}<br>
      HL: ${convertShortToHex(this.register.hl)}<br>
      SP: ${convertShortToHex(this.register.sp)}<br>
      PC: ${convertShortToHex(this.register.pc)}
    `

  }

  retrieveArgs(count){
    var args = [];

    // step forward, and collect the arguments needed for the instruction
    // (count based on instructionSet arg number)
    while(count > 0){
      args.push(this.rom[this.register.pc])
      this.register.pc += 1
      count--;
    }

    return args;
  }
}
