// OpCodes that mark cpu.lastIsCP to true
var cpInstructions = [0xB8,0xB9,0xBA,0xBB,0xBC,0xBD,0xBE,0xBF,0xFE];

// instruction set, and instructions all defined in instructions.js
class CPU {
  constructor(rom){
    this.rom = rom;
    this.lastIsCP = false;
    this.interruptsEnabled = true;
    this.halted = false;
    this.stopped = false;

    this.enableInterruptQueued = false;
    this.disableInterruptQueued = false;

    this.loopHndl;

    cast = new CastHelper();

    var self = this;

    this.dataOutput = {
      meminfo: document.querySelector('.mem_info'),
      f_flags: document.querySelector('.f_flags'),
      registers: document.querySelector('.registers')
    }

    this.ops = {
      add_sp_x(SP, x){
        var decRes = SP + x;
        var res = cast.uint16(decRes)

        cpu.register.f = {
          z: 0,
          n: 0,
          h: (SP & 0xF) + (x & 0xF) > 0xF,
          c: decRes > 0xFFFF
        }

        return res
      },
      add(x, y){
        var decRes = x + y;
        var res = cast.uint8(decRes)

        cpu.register.f = {
          z: res === 0 || (self.lastIsCP ? x === y : false),
          n: 0,
          h: (x & 0xF) + (y & 0xF) > 0xF,
          c: decRes > 0xFF || (self.lastIsCP ? x < y : false)
        }

        return res
      },
      add_16(x, y){
        var decRes = x + y
        var res = cast.uint16(decRes)

        cpu.register.f = {
          z: cpu.register.f.z,
          n: 0,
          h: (x & 0xFFF) + (y & 0xFFF) > 0xFFF,
          c: decRes > 0xFFFF
        }

        return res
      },
      subtract(x, y){
        var decRes = x - y
        var res = cast.uint8(decRes)

        cpu.register.f = {
          z: res === 0 || (self.lastIsCP ? x === y : false),
          n: 1,
          h: (x & 0xF) - (y & 0xF) < 0x0,
          c: decRes < 0x0 || (self.lastIsCP ? x === y : false)
        }

        return res
      },
      /***************************************
       *
       *
       *   All of these BitOps used to be
       *   Byte/Short indifferent, but now
       *   with the signing of them.. they're all
       *   restricted to working with bytes.
       *
       *   Is this a problem!?!?!
       *
       *
       ***************************************/
      xor(n, x){
        var res = cast.uint8(n ^ x)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: 0
        }

        return res;
      },
      and(x, y){
        var res = cast.uint8(x & y)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 1,
          c: 0
        }

        return res
      },
      or(x, y){
        var res = cast.uint8(x | y)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: 0
        }

        return res
      },
      inc(x){
        var res = cast.uint8(x + 1)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: (x & 0xF) + 1 > 0xF,
          c: cpu.register.f.c
        }

        return res
      },
      dec(x){
        var res = cast.uint8(x - 1)

        cpu.register.f = {
          z: res === 0,
          n: 1,
          h: (x & 0xF) - 1 < 0x0,
          c: cpu.register.f.c
        }

        return res
      },
      // complement X (used in opCode 0x2F)
      cpl(x){
        var res = cast.uint(x ^ 0xFF)

        cpu.register.f = {
          z: cpu.register.f.z,
          n: 1,
          h: 1,
          c: cpu.register.f.c
        }

        return res
      },
      // complement carry flag (opCode 0x3F)
      ccf(){
        cpu.register.f = {
          z: cpu.register.f.z,
          n: 0,
          h: 0,
          c: !cpu.register.f.c
        }
      },
      scf(){
        cpu.register.f = {
          z: cpu.register.f.z,
          n: 0,
          h: 0,
          c: 1
        }
      },
      // rotate left (old bit 7 goes into carry)
      rlc(x){
        var bit7 = x & 0b10000000
        var res = cast.uint8(x << 1) | (bit7 >>> 7)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: bit7
        }

        return res
      },
      // rotate left through carry (put old carry in 0 bit, old 7bit into carry)
      rl(x){
        var bit7 = x & 0b10000000
        var res = cast.uint8(x << 1) | (cpu.register.f.c ? 1 : 0)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: bit7
        }

        return res
      },
      // rotate right (old bit 0 goes into carry)
      rrc(x){
        var bit0 = x & 0b00000001
        var res = cast.uint8(x >>> 1) | (bit0 << 7)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: bit0
        }

        return res
      },
      // rotate right through carry (put old carry into 7th bit, old 7th bit into carry)
      rr(x){
        var bit0 = x & 0b00000001
        var res = cast.uint8(x >>> 1) | ((cpu.register.f.c ? 1 : 0) << 7)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: bit0
        }

        return res
      },
      swapNibbles(x){
        var res = ((x & 0xF0) >>> 8) + ((x & 0xF) << 8)

        cpu.register.f = {
          z: res === 0,
          n: 0,
          h: 0,
          c: 0
        }

        return res;
      },
      bcd_pack(x){
        var lowNib = x % 10
        var highNib = ((x / 10) | 0) % 10

        var decRes = (highNib << 4) | lowNib

        var res = cast.uint8(decRes)

        cpu.register.f = {
          z: res === 0,
          n: cpu.register.f.n,
          h: 0,
          c: decRes > 0xFF
        }

        return res
      }
    }

    // 0 1, 2 3, 4 5, 6 7, 8 9, 10 11
    // A F, B C, D E, H L, S P, P  C
    var byteRegisters = {a: 0, b: 2, c: 3, d: 4, e: 5, h: 6, l: 7}
    var shortRegisters = {bc: 2, de: 4, hl: 6, sp: 8, pc: 10}

    this.register = {
      data: new DataView(new ArrayBuffer(12)),

      // F register gets set differently
      get f(){
        var regF = this.data.getUint8(1)
        return {
          z: !!(regF & 0b10000000),
          n: !!(regF & 0b01000000),
          h: !!(regF & 0b00100000),
          c: !!(regF & 0b00010000)
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
        this.data.setUint8(1, val)
        self.updateRegisterView()
      },

      get af(){
        return this.data.getUint16(0, true)
      },
      set af(v){
        this.data.setUint16(0, v & 0xFFF0, true)
        self.updateRegisterView()
      }
    }

    for(const [call, littleEndian, source] of [['Uint8', false, byteRegisters], ['Uint16', true, shortRegisters]]) {
      for(const [register, offset] of Object.entries(source)){
        Object.defineProperty(this.register, register, {
          get: function(){
            return this.data[`get${call}`](offset, littleEndian)
          },
          set: function(v){
            this.data[`set${call}`](offset, v, littleEndian)
            self.updateRegisterView()
          }
        })
      }
    }

    // Initialize the appropriate registers
    this.register.sp = 0xFFFE
    this.register.pc = 0x0100
  }

  stopCPU(){
    this.stopped = true
  }

  haltCPU(){
    this.halted = true
  }

  stopExecution(){
    clearInterval(this.loopHndl)
  }

  queueEnableInterrupts(){
    this.enableInterruptQueued = true
  }

  queueDisableInterrupts(){
    this.disableInterruptQueued = true;
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
    var interruptsQueuedForEnable = false;
    this.loopHndl = setInterval(() => {
      if(this.halted || this.stopped)
        return

      opCode = this.rom[this.register.pc]
      // interrupts can be queued to be disabled after the NEXT instruction.
      // in this case, we check to see if it's been queued by the last
      // instruction, then clear the flag.
      interruptsQueuedForDisable = this.disableInterruptQueued;
      this.disableInterruptQueued = false;

      interruptsQueuedForEnable = this.enableInterruptQueued;
      this.enableInterruptQueued = false

      // in our math operations we need to know if the last OP is
      // a CP type OpCode. This influences the F register flags that get set.
      if(cpInstructions.indexOf(opCode) > -1)
        this.lastIsCP = true;

      // grab the instruction implementation details for the current OpCode
      // if opCode is CB, there's a secondary instruction list. at least we
      // aren't on an actual Z80, as there's a whole bunch more.
      if(opCode === 0xCB){
        this.register.pc += 1
        opCode = this.rom[this.register.pc]
        instruction = CBInstructionSet[opCode]
      } else {
        instruction = InstructionSet[opCode]
      }

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

      if(interruptsQueuedForEnable){
        this.enableInterrupts();
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

  updateRegisterView(){
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
}
