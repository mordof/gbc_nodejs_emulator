class CastHelper {
  constructor(){
    this.sign8Arr = new Int8Array(1);
    this.sign16Arr = new Int16Array(1);
    this.unsign8Arr = new Uint8Array(1);
    this.unsign16Arr = new Uint16Array(1);
  }

  int8(x){
    this.unsign8Arr[0] = x
    return this.unsign8Arr[0]
  }

  int16(x){
    this.unsign16Arr[0] = x
    return this.unsign16Arr[0]
  }

  uint8(x){
    this.sign8Arr[0] = x
    return this.sign8Arr[0]
  }

  uint16(x){
    this.sign16Arr[0] = x
    return this.sign16Arr[0]
  }
}