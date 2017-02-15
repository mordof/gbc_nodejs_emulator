function bytesToShort(byte1, byte2){
  return (byte2 << 8) + byte1;
}

function log(){
  var args = Array.from(arguments);

  for(var i = 0; i < args.length; i++){
    if(typeof args[i] === 'number'){
      if(args[i] > 0xFF)
        args[i] = convertShortToHex(args[i])
      else
        args[i] = convertByteToHex(args[i])
    } else if(Array.isArray(args[i])){
      if(args[i].length === 2){
        args[i] = convertShortToHex(bytesToShort(args[i][0], args[i][1]))
      } else if(args[i].length === 1) {
        args[i] = convertByteToHex(args[i][0])
      } else {
        args[i] = undefined
      }
    }
  }

  console.log.apply(console, args.filter((i) => { return i !== undefined }));
}

function convertByteToHex(num){
  var hex = num.toString(16).toUpperCase()
  return `0x${"0".repeat(2 - hex.length) + hex}`
}

function convertShortToHex(num){
  var hex = num.toString(16).toUpperCase()
  return `0x${"0".repeat(4 - hex.length) + hex}`
}
