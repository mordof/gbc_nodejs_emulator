function bytesToShort(byte1, byte2){
  return (byte2 << 8) + byte1;
}

function log(){
  var args = Array.from(arguments);

  for(var i = 0; i < args.length; i++){
    if(typeof args[i] === 'number'){
      args[i] = convertNumToHex(args[i])
    } else if(Array.isArray(args[i])){
      if(args[i].length === 2){
        args[i] = convertNumToHex(bytesToShort(args[i][0], args[i][1]))
      } else if(args[i].length === 1) {
        args[i] = convertNumToHex(args[i][0])
      } else {
        args[i] = undefined
      }
    }
  }

  console.log.apply(console, args.filter((i) => { return i !== undefined }));
}

function convertNumToHex(num){
  return `0x${num.toString(16).toUpperCase()}`
}