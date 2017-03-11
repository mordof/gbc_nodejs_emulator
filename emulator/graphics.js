var ScreenProperties = {
  width: 320,
  height: 288,
  menuHeight: 25,
  initialWidth: 160,
  initialHeight: 144,
  canvas: document.querySelector('canvas')
}

class Screen {
  static setScreenScale(scale){
    scale = scale || 1
    gui.Window.get().width = ScreenProperties.initialWidth * scale + 142;
    gui.Window.get().height = ScreenProperties.initialHeight * scale + ScreenProperties.menuHeight;

    ScreenProperties.canvas.width = ScreenProperties.initialWidth * scale;
    ScreenProperties.canvas.height = ScreenProperties.initialHeight * scale;

    ScreenProperties.width = ScreenProperties.initialWidth * scale;
    ScreenProperties.height = ScreenProperties.initialHeight * scale;
  }
}

const GPU_MODE_HBLANK = 0
const GPU_MODE_VBLANK = 1
const GPU_MODE_OAM = 2
const GPU_MODE_VRAM = 3

class GPU {
  constructor() {
    this.flags = []
    this.lastTick = 0;
    this.tick = 0;
    this.scanline = 0;
    this.gpuMode = GPU_MODE_HBLANK
  }

  read(address){

  }

  write(address, val){

  }

  step(){
    this.tick += cpu.clock - this.lastTick
    this.lastTick = cpu.clock

    switch(this.gpuMode){
      case GPU_MODE_HBLANK:
        if(this.tick >= 204){
          this.scanline++

          if(this.scanline == 143){
            mem.if |= INTERRUPT_VBLANK

            this.gpuMode = GPU_MODE_VBLANK
          } else {
            this.gpuMode = GPU_MODE_OAM
          }

          this.tick -= 204
        }

        break;

      case GPU_MODE_VBLANK:
        if(this.tick >= 456){
          this.scanline++

          if(this.scanline > 153){
            this.scanline = 0
            this.gpuMode = GPU_MODE_OAM
          }

          this.tick -= 456
        }

        break;

      case GPU_MODE_OAM:
        if(this.tick >= 80){
          this.gpuMode = GPU_MODE_VRAM
          this.tick -= 80
        }

        break;

      case GPU_MODE_VRAM:
        if(this.tick >= 172){
          this.gpuMode = GPU_MODE_HBLANK

          // do i need to do renderScanline here?
          // for the DS Cinoop does this.. but where else would
          // it get called?

          this.tick -= 172
        }

        break;
    }
  }
}
