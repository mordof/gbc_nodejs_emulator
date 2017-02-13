
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
    gui.Window.get().width = ScreenProperties.initialWidth * scale;
    gui.Window.get().height = ScreenProperties.initialHeight * scale + ScreenProperties.menuHeight;

    ScreenProperties.canvas.width = ScreenProperties.initialWidth * scale;
    ScreenProperties.canvas.height = ScreenProperties.initialHeight * scale;

    ScreenProperties.width = ScreenProperties.initialWidth * scale;
    ScreenProperties.height = ScreenProperties.initialHeight * scale;
  }
}

