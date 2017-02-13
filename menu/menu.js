// this is so messy.... but whatever for now.

var menu = new gui.Menu({ type: 'menubar' });


var loadRom = new gui.MenuItem({ label: 'Load ROM' })

loadRom.click = function(){
  Emulator.loadROM();
}

menu.append(loadRom);

var configMenu = new gui.Menu({ type: 'menubar' });

scale1x = new gui.MenuItem({ label: 'Scale 1x' })
scale2x = new gui.MenuItem({ label: 'Scale 2x' })
scale3x = new gui.MenuItem({ label: 'Scale 3x' })
scale4x = new gui.MenuItem({ label: 'Scale 4x' })

var gameCanvas = document.querySelector('canvas');

scale1x.click = function(){
  Screen.setScreenScale(1)
}

scale2x.click = function(){
  Screen.setScreenScale(2)
}

scale3x.click = function(){
  Screen.setScreenScale(3)
}

scale4x.click = function(){
  Screen.setScreenScale(4)
}


configMenu.append(scale1x)
configMenu.append(scale2x)
configMenu.append(scale3x)
configMenu.append(scale4x)

var configItem = new gui.MenuItem({
  label: 'Config',
  submenu: configMenu
})

var testItem = new gui.MenuItem({ label: 'Test' })

menu.append(testItem)
menu.append(configItem);


testItem.click = function(){
  console.log('test clicked');
}

gui.Window.get().menu = menu;

// set the viewport to scale 2x (default)
scale2x.click()

console.log('Menu Initialized.')