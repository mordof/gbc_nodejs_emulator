const INTERRUPT_VBLANK = 1
const INTERRUPT_LCD_STAT = 2
const INTERRUPT_TIMER = 4
const INTERRUPT_SERIAL = 8
const INTERRUPT_JOYPAD = 16

var interrupts = [
  [INTERRUPT_VBLANK,   0x40], 
  [INTERRUPT_LCD_STAT, 0x48], 
  [INTERRUPT_TIMER,    0x50], 
  [INTERRUPT_SERIAL,   0x58], 
  [INTERRUPT_JOYPAD,   0x60]
]

function checkForInterrupts(){
  // gotta check for, and potentially handle, intterupts
  if(cpu.interruptsEnabled){
    for(var i=0; i < interrupts.length; i++){
      // look for IE and IF to both have the same interrupt flag enabled
      if(mem.ie & interrupts[i][0] && mem.if & interrupts[i][0]){

        console.log("INTERRUPT HAPPENED!!! Interrupt code: ", i)

        // disable global interrupts
        cpu.interruptsEnabled = false;
        // unset the bit in IF related to that interrupt (keep all others)
        mem.if &= ~interrupts[i][0]
        // push pc to stack, jump to interrupt vector
        push_pc_to_stack_jump(interrupts[i][1])

        cpu.clock += 6

        break;
      }
    }
  }
}