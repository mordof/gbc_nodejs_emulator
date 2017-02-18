
/* next instruction opcode I need to implement from PDF: 

9. SLA (0xCB 0x20 - 0x27)
pg. 105

*/

// format for each instructionSet item:
// Instruction, byteCount (how many arg bytes), funciton ref
var InstructionSet = {
  0x00: ['NOP',                 0, ()      => {                                                                    }],
  0x01: ['LD BC',               2, (x, y)  => { ld_register_xx('bc', x, y)                                         }],
  0x02: ['LD (BC) A',           0, ()      => { ld_memregister_register_byte('bc', 'a')                            }],
  0x03: ['INC BC',              0, ()      => { cpu.register.bc++; /* doesn't update flags like inc_register */    }],
  0x04: ['INC B',               0, ()      => { inc_register('b')                                                  }],
  0x05: ['DEC B',               0, ()      => { dec_register('b')                                                  }],
  0x06: ['LD B',                1, (x)     => { ld_register_x('d', x)                                              }],
  0x07: ['RLCA',                0, ()      => { rotate_register_byte_left_carry('a')                               }],
  0x08: ['LD (%xx) SP',         2, (x, y)  => { ld_memxx_register_short(bytesToShort(x, y), 'sp')                  }],
  0x09: ['ADD HL BC',           0, ()      => { add_register_short_to_hl('bc')                                     }],
  0x10: ['STOP',                1, (_)     => { cpu.stopCPU() /* opCode 10 00... ? */                              }],
  0x0A: ['LD A (BC)',           0, ()      => { ld_register_memregister_byte('a', 'bc')                            }],
  0x0B: ['DEC BC',              0, ()      => { cpu.register.bc--; /* doesn't update flags like dec_register */    }],
  0x0C: ['INC C',               0, ()      => { inc_register('c')                                                  }],
  0x0D: ['DEC C',               0, ()      => { dec_register('c')                                                  }],
  0x0E: ['LD C',                1, (x)     => { ld_register_x('c', x)                                              }],
  0x0F: ['RRCA',                0, ()      => { rotate_register_byte_right_carry('a')                              }],
  0x11: ['LD DE',               2, (x, y)  => { ld_register_xx('de', x, y)                                         }],
  0x12: ['LD (DE) A',           0, ()      => { ld_memregister_register_byte('de', 'a')                            }],
  0x13: ['INC DE',              0, ()      => { cpu.register.de++; /* doesn't update flags like inc_register */    }],
  0x14: ['INC D',               0, ()      => { inc_register('d')                                                  }],
  0x15: ['DEC D',               0, ()      => { dec_register('d')                                                  }],
  0x16: ['LD D',                1, (x)     => { ld_register_x('d', x)                                              }],
  0x17: ['RLA',                 0, ()      => { rotate_register_byte_left_through_carry('a')                       }],
  0x18: ['JR',                  1, (x)     => { jr_x_signed(x)                                                     }],
  0x19: ['ADD HL DE',           0, ()      => { add_register_short_to_hl('de')                                     }],
  0x1A: ['LD A (DE)',           0, ()      => { ld_register_memregister_byte('a', 'de')                            }],
  0x1B: ['DEC DE',              0, ()      => { cpu.register.de--; /* doesn't update flags like dec_register */    }],
  0x1C: ['INC E',               0, ()      => { inc_register('e')                                                  }],
  0x1D: ['DEC E',               0, ()      => { dec_register('e')                                                  }],
  0x1E: ['LD E',                1, (x)     => { ld_register_x('e', x)                                              }],
  0x1F: ['RRA',                 0, ()      => { rotate_register_byte_right_through_carry('a')                      }],
  0x20: ['JR NZ',               1, (x)     => { if(!cpu.register.z){ jr_x_signed(x) }                              }],
  0x21: ['LD HL',               2, (x, y)  => { ld_register_xx('hl', x, y)                                         }],
  0x22: ['LDI (HL) A',          0, ()      => { ld_memregister_register_byte('hl', 'a'); cpu.register.hl++;        }],
  0x23: ['INC HL',              0, ()      => { cpu.register.hl++; /* doesn't update flags like inc_register */    }],
  0x24: ['INC H',               0, ()      => { inc_register('h')                                                  }],
  0x25: ['DEC H',               0, ()      => { dec_register('h')                                                  }],
  0x26: ['LD H',                1, (x)     => { ld_register_x('h', x)                                              }],
  0x27: ['DAA',                 0, ()      => { bcd_pack_a()                                                       }],
  0x28: ['JR Z',                1, (x)     => { if(cpu.register.z){ jr_x_signed(x) }                               }],
  0x29: ['ADD HL HL',           0, ()      => { add_register_short_to_hl('hl')                                     }],
  0x2A: ['LDI A (HL)',          0, ()      => { ld_register_memregister_byte('a', 'hl'); cpu.register.hl++;        }],
  0x2B: ['DEC HL',              0, ()      => { cpu.register.hl--; /* doesn't update flags like dec_register */    }],
  0x2C: ['INC L',               0, ()      => { inc_register('l')                                                  }],
  0x2D: ['DEC L',               0, ()      => { dec_register('l')                                                  }],
  0x2E: ['LD L',                1, (x)     => { ld_register_x('l', x)                                              }],
  0x2F: ['CPL',                 0, ()      => { cpu.register.a = cpu.ops.cpl(cpu.register.a)                       }],
  0x30: ['JR NC',               1, (x)     => { if(!cpu.register.c){ jr_x_signed(x) }                              }],
  0x31: ['LD SP',               2, (x, y)  => { ld_register_xx('sp', x, y)                                         }],
  0x32: ['LDD (HL) A',          0, ()      => { ld_memregister_register_byte('hl', 'a'); cpu.register.hl--;        }],
  0x33: ['INC SP',              0, ()      => { cpu.register.sp++; /* doesn't update flags like inc_register */    }],
  0x34: ['INC (HL)',            0, ()      => { inc_memhl()                                                        }],
  0x35: ['DEC (HL)',            0, ()      => { dec_memhl()                                                        }],
  0x36: ['LD (HL)',             1, (x)     => { ld_memregister_x('hl', x)                                          }],
  0x37: ['SCF',                 0, ()      => { cpu.ops.scf()                                                      }],
  0x38: ['JR C',                1, (x)     => { if(cpu.register.c){ jr_x_signed(x) }                               }],
  0x39: ['ADD HL SP',           0, ()      => { add_register_short_to_hl('sp')                                     }],
  0x3A: ['LDD A (HL)',          0, ()      => { ld_register_memregister_byte('a', 'hl'); cpu.register.hl--;        }],
  0x3B: ['DEC SP',              0, ()      => { cpu.register.sp--; /* doesn't update flags like dec_register */    }],
  0x3C: ['INC A',               0, ()      => { inc_register('a')                                                  }],
  0x3D: ['DEC A',               0, ()      => { dec_register('a')                                                  }],
  0x3E: ['LD A',                1, (x)     => { ld_register_x('a', x)                                              }],
  0x3F: ['CCF',                 0, ()      => { cpu.ops.ccf()                                                      }],
  0x40: ['LD B B',              0, ()      => { ld_register_register('b', 'b')                                     }],
  0x41: ['LD B C',              0, ()      => { ld_register_register('b', 'c')                                     }],
  0x42: ['LD B D',              0, ()      => { ld_register_register('b', 'd')                                     }],
  0x43: ['LD B E',              0, ()      => { ld_register_register('b', 'e')                                     }],
  0x44: ['LD B H',              0, ()      => { ld_register_register('b', 'h')                                     }],
  0x45: ['LD B L',              0, ()      => { ld_register_register('b', 'l')                                     }],
  0x46: ['LD B (HL)',           0, ()      => { ld_register_memregister_byte('b', 'hl')                            }],
  0x47: ['LD B A',              0, ()      => { ld_register_register('b', 'a')                                     }],
  0x48: ['LD C B',              0, ()      => { ld_register_register('c', 'b')                                     }],
  0x49: ['LD C C',              0, ()      => { ld_register_register('c', 'c')                                     }],
  0x4A: ['LD C D',              0, ()      => { ld_register_register('c', 'd')                                     }],
  0x4B: ['LD C E',              0, ()      => { ld_register_register('c', 'e')                                     }],
  0x4C: ['LD C H',              0, ()      => { ld_register_register('c', 'h')                                     }],
  0x4D: ['LD C L',              0, ()      => { ld_register_register('c', 'l')                                     }],
  0x4E: ['LD C (HL)',           0, ()      => { ld_register_memregister_byte('c', 'hl')                            }],
  0x4F: ['LD C A',              0, ()      => { ld_register_register('c', 'a')                                     }],
  0x50: ['LD D B',              0, ()      => { ld_register_register('d', 'b')                                     }],
  0x51: ['LD D C',              0, ()      => { ld_register_register('d', 'c')                                     }],
  0x52: ['LD D D',              0, ()      => { ld_register_register('d', 'd')                                     }],
  0x53: ['LD D E',              0, ()      => { ld_register_register('d', 'e')                                     }],
  0x54: ['LD D H',              0, ()      => { ld_register_register('d', 'h')                                     }],
  0x55: ['LD D L',              0, ()      => { ld_register_register('d', 'l')                                     }],
  0x56: ['LD D (HL)',           0, ()      => { ld_register_memregister_byte('d', 'hl')                            }],
  0x57: ['LD D A',              0, ()      => { ld_register_register('d', 'a')                                     }],
  0x58: ['LD E B',              0, ()      => { ld_register_register('e', 'b')                                     }],
  0x59: ['LD E C',              0, ()      => { ld_register_register('e', 'c')                                     }],
  0x5A: ['LD E D',              0, ()      => { ld_register_register('e', 'd')                                     }],
  0x5B: ['LD E E',              0, ()      => { ld_register_register('e', 'e')                                     }],
  0x5C: ['LD E H',              0, ()      => { ld_register_register('e', 'h')                                     }],
  0x5D: ['LD E L',              0, ()      => { ld_register_register('e', 'l')                                     }],
  0x5E: ['LD E (HL)',           0, ()      => { ld_register_memregister_byte('e', 'hl')                            }],
  0x5F: ['LD E A',              0, ()      => { ld_register_register('e', 'a')                                     }],
  0x60: ['LD H B',              0, ()      => { ld_register_register('h', 'b')                                     }],
  0x61: ['LD H C',              0, ()      => { ld_register_register('h', 'c')                                     }],
  0x62: ['LD H D',              0, ()      => { ld_register_register('h', 'd')                                     }],
  0x63: ['LD H E',              0, ()      => { ld_register_register('h', 'e')                                     }],
  0x64: ['LD H H',              0, ()      => { ld_register_register('h', 'h')                                     }],
  0x65: ['LD H L',              0, ()      => { ld_register_register('h', 'l')                                     }],
  0x66: ['LD H (HL)',           0, ()      => { ld_register_memregister_byte('h', 'hl')                            }],
  0x67: ['LD H A',              0, ()      => { ld_register_register('h', 'a')                                     }],
  0x68: ['LD L B',              0, ()      => { ld_register_register('l', 'b')                                     }],
  0x69: ['LD L C',              0, ()      => { ld_register_register('l', 'c')                                     }],
  0x6A: ['LD L D',              0, ()      => { ld_register_register('l', 'd')                                     }],
  0x6B: ['LD L E',              0, ()      => { ld_register_register('l', 'e')                                     }],
  0x6C: ['LD L H',              0, ()      => { ld_register_register('l', 'h')                                     }],
  0x6D: ['LD L L',              0, ()      => { ld_register_register('l', 'l')                                     }],
  0x6E: ['LD L (HL)',           0, ()      => { ld_register_memregister_byte('l', 'hl')                            }],
  0x6F: ['LD L A',              0, ()      => { ld_register_register('l', 'a')                                     }],
  0x70: ['LD (HL) B',           0, ()      => { ld_memregister_register_byte('hl', 'b')                            }],
  0x71: ['LD (HL) C',           0, ()      => { ld_memregister_register_byte('hl', 'c')                            }],
  0x72: ['LD (HL) D',           0, ()      => { ld_memregister_register_byte('hl', 'd')                            }],
  0x73: ['LD (HL) E',           0, ()      => { ld_memregister_register_byte('hl', 'e')                            }],
  0x74: ['LD (HL) H',           0, ()      => { ld_memregister_register_byte('hl', 'h')                            }],
  0x75: ['LD (HL) L',           0, ()      => { ld_memregister_register_byte('hl', 'l')                            }],
  0x77: ['LD (HL) A',           0, ()      => { ld_memregister_register_byte('hl', 'a')                            }],
  0x76: ['HALT',                0, ()      => { cpu.haltCPU()                                                      }],
  0x78: ['LD A B',              0, ()      => { ld_register_register('a', 'b')                                     }],
  0x79: ['LD A C',              0, ()      => { ld_register_register('a', 'c')                                     }],
  0x7A: ['LD A D',              0, ()      => { ld_register_register('a', 'd')                                     }],
  0x7B: ['LD A E',              0, ()      => { ld_register_register('a', 'e')                                     }],
  0x7C: ['LD A H',              0, ()      => { ld_register_register('a', 'h')                                     }],
  0x7D: ['LD A L',              0, ()      => { ld_register_register('a', 'l')                                     }],
  0x7E: ['LD A (HL)',           0, ()      => { ld_register_memregister_byte('a', 'hl')                            }],
  0x7F: ['LD A A',              0, ()      => { ld_register_register('a', 'a')                                     }],
  0x80: ['ADD A B',             0, ()      => { add_register_byte_to_a('b')                                        }],
  0x81: ['ADD A C',             0, ()      => { add_register_byte_to_a('c')                                        }],
  0x82: ['ADD A D',             0, ()      => { add_register_byte_to_a('d')                                        }],
  0x83: ['ADD A E',             0, ()      => { add_register_byte_to_a('e')                                        }],
  0x84: ['ADD A H',             0, ()      => { add_register_byte_to_a('h')                                        }],
  0x85: ['ADD A L',             0, ()      => { add_register_byte_to_a('l')                                        }],
  0x86: ['ADD A (HL)',          0, ()      => { add_memhl_byte_to_a()                                              }],
  0x87: ['ADD A A',             0, ()      => { add_register_byte_to_a('a')                                        }],
  0x88: ['ADC A B',             0, ()      => { add_register_byte_plus_carry_to_a('b')                             }],
  0x89: ['ADC A C',             0, ()      => { add_register_byte_plus_carry_to_a('c')                             }],
  0x8A: ['ADC A D',             0, ()      => { add_register_byte_plus_carry_to_a('d')                             }],
  0x8B: ['ADC A E',             0, ()      => { add_register_byte_plus_carry_to_a('e')                             }],
  0x8C: ['ADC A H',             0, ()      => { add_register_byte_plus_carry_to_a('h')                             }],
  0x8D: ['ADC A L',             0, ()      => { add_register_byte_plus_carry_to_a('l')                             }],
  0x8E: ['ADC A (HL)',          0, ()      => { add_memhl_byte_plus_carry_to_a()                                   }],
  0x8F: ['ADC A A',             0, ()      => { add_register_byte_plus_carry_to_a('a')                             }],
  0x90: ['SUB B',               0, ()      => { sub_register_byte_from_a('b')                                      }],
  0x91: ['SUB C',               0, ()      => { sub_register_byte_from_a('c')                                      }],
  0x92: ['SUB D',               0, ()      => { sub_register_byte_from_a('d')                                      }],
  0x93: ['SUB E',               0, ()      => { sub_register_byte_from_a('e')                                      }],
  0x94: ['SUB H',               0, ()      => { sub_register_byte_from_a('h')                                      }],
  0x95: ['SUB L',               0, ()      => { sub_register_byte_from_a('l')                                      }],
  0x96: ['SUB (HL)',            0, ()      => { sub_memhl_byte_from_a()                                            }],
  0x97: ['SUB A',               0, ()      => { sub_register_byte_from_a('a')                                      }],
  0x98: ['SBC A B',             0, ()      => { sub_register_byte_and_carry_from_a('b')                            }],
  0x99: ['SBC A C',             0, ()      => { sub_register_byte_and_carry_from_a('c')                            }],
  0x9A: ['SBC A D',             0, ()      => { sub_register_byte_and_carry_from_a('d')                            }],
  0x9B: ['SBC A E',             0, ()      => { sub_register_byte_and_carry_from_a('e')                            }],
  0x9C: ['SBC A H',             0, ()      => { sub_register_byte_and_carry_from_a('h')                            }],
  0x9D: ['SBC A L',             0, ()      => { sub_register_byte_and_carry_from_a('l')                            }],
  0x9E: ['SBC A (HL)',          0, ()      => { sub_memhl_byte_and_carry_from_a()                                  }],
  0x9F: ['SBC A A',             0, ()      => { sub_register_byte_and_carry_from_a('a')                            }],
  0xA0: ['AND B',               0, ()      => { and_register('b')                                                  }],
  0xA1: ['AND C',               0, ()      => { and_register('c')                                                  }],
  0xA2: ['AND D',               0, ()      => { and_register('d')                                                  }],
  0xA3: ['AND E',               0, ()      => { and_register('e')                                                  }],
  0xA4: ['AND H',               0, ()      => { and_register('h')                                                  }],
  0xA5: ['AND L',               0, ()      => { and_register('l')                                                  }],
  0xA6: ['AND (HL)',            0, ()      => { and_memhl()                                                        }],
  0xA7: ['AND A',               0, ()      => { and_register('a')                                                  }],
  0xA8: ['XOR B',               0, ()      => { xor_register('b')                                                  }],
  0xA9: ['XOR C',               0, ()      => { xor_register('c')                                                  }],
  0xAA: ['XOR D',               0, ()      => { xor_register('d')                                                  }],
  0xAB: ['XOR E',               0, ()      => { xor_register('e')                                                  }],
  0xAC: ['XOR H',               0, ()      => { xor_register('h')                                                  }],
  0xAD: ['XOR L',               0, ()      => { xor_register('l')                                                  }],
  0xAE: ['XOR (HL)',            0, ()      => { xor_memhl()                                                        }],
  0xAF: ['XOR A',               0, ()      => { xor_register('a')                                                  }],
  0xB0: ['OR B',                0, ()      => { or_register('b')                                                   }],
  0xB1: ['OR C',                0, ()      => { or_register('c')                                                   }],
  0xB2: ['OR D',                0, ()      => { or_register('d')                                                   }],
  0xB3: ['OR E',                0, ()      => { or_register('e')                                                   }],
  0xB4: ['OR H',                0, ()      => { or_register('h')                                                   }],
  0xB5: ['OR L',                0, ()      => { or_register('l')                                                   }],
  0xB6: ['OR (HL)',             0, ()      => { or_memhl()                                                         }],
  0xB7: ['OR A',                0, ()      => { or_register('a')                                                   }],
  0xB8: ['CP B',                0, ()      => { cp_a_register('b')                                                 }],
  0xB9: ['CP C',                0, ()      => { cp_a_register('c')                                                 }],
  0xBA: ['CP D',                0, ()      => { cp_a_register('d')                                                 }],
  0xBB: ['CP E',                0, ()      => { cp_a_register('e')                                                 }],
  0xBC: ['CP H',                0, ()      => { cp_a_register('h')                                                 }],
  0xBD: ['CP L',                0, ()      => { cp_a_register('L')                                                 }],
  0xBE: ['CP (HL)',             0, ()      => { cp_a_memhl()                                                       }],
  0xBF: ['CP A',                0, ()      => { cp_a_register('a')                                                 }],
  0xC0: ['RET NZ',              0, ()      => { if(!cpu.register.z){ read_stack_and_jump() }                       }],
  0xC1: ['POP BC',              0, ()      => { pop_short_stack_to_register('bc')                                  }],
  0xC2: ['JP NZ',               2, (x, y)  => { if(!cpu.register.z){ jp_xx(x, y) }                                 }],
  0xC3: ['JP',                  2, (x, y)  => { jp_xx(x, y)                                                        }],
  0xC4: ['CALL NZ',             2, (x, y)  => { if(!cpu.register.z){ push_pc_to_stack_jump(bytesToShort(x, y)) }   }],
  0xC5: ['PUSH BC',             0, ()      => { push_short_register_to_stack('bc')                                 }],
  0xC6: ['ADD A',               1, (x)     => { add_byte_to_a(x)                                                   }],
  0xC7: ['RST 0x00',            0, ()      => { push_pc_to_stack_jump(0x00)                                        }],
  0xC8: ['RET Z',               0, ()      => { if(cpu.register.z){ read_stack_and_jump() }                        }],
  0xC9: ['RET',                 0, ()      => { read_stack_and_jump()                                              }],
  0xCA: ['JP Z',                2, (x, y)  => { if(cpu.register.z){ jp_xx(x, y) }                                  }],
  0xCB: /* This points to another instruction set. If we find an instruction here... figure out wth is going on */ '',
  0xCC: ['CALL Z',              2, (x, y)  => { if(cpu.register.z){ push_pc_to_stack_jump(bytesToShort(x, y)) }    }],
  0xCD: ['CALL',                2, (x, y)  => { push_pc_to_stack_jump(bytesToShort(x, y))                          }],
  0xCE: ['ADC A',               1, (x)     => { add_byte_plus_carry_to_a(x)                                        }],
  0xCF: ['RST 0x08',            0, ()      => { push_pc_to_stack_jump(0x08)                                        }],
  0xD0: ['RET NC',              0, ()      => { if(!cpu.register.c){ read_stack_and_jump() }                       }],
  0xD1: ['POP DE',              0, ()      => { pop_short_stack_to_register('de')                                  }],
  0xD2: ['JP NC',               2, (x, y)  => { if(!cpu.register.c){ jp_xx(x, y) }                                 }],
  0xD4: ['CALL NC',             2, (x, y)  => { if(!cpu.register.c){ push_pc_to_stack_jump(bytesToShort(x, y)) }   }],
  0xD5: ['PUSH DE',             0, ()      => { push_short_register_to_stack('de')                                 }],
  0xD6: ['SUB',                 1, (x)     => { sub_byte_from_a(x)                                                 }],
  0xD7: ['RST 0x10',            0, ()      => { push_pc_to_stack_jump(0x10)                                        }],
  0xD8: ['RET C',               0, ()      => { if(cpu.register.c){ read_stack_and_jump() }                        }],
  0xD9: ['RETI',                0, ()      => { read_stack_and_jump(); cpu.enableInterrupts()                      }],
  0xDA: ['JP C',                2, (x, y)  => { if(cpu.register.c){ jp_xx(x, y) }                                  }],
  0xDC: ['CALL C',              2, (x, y)  => { if(cpu.register.c){ push_pc_to_stack_jump(bytesToShort(x, y)) }    }],
  0xDE: ['SBC A',               1, (x)     => { sub_byte_and_carry_from_a(x)                                       }],
  0xDF: ['RST 0x18',            0, ()      => { push_pc_to_stack_jump(0x18)                                        }],
  0xE0: ['LDH (0xFF00 + %x) A', 1, (x)     => { ld_memxx_register_byte(0xFF00 + x, 'a')                            }],
  0xE1: ['POP HL',              0, ()      => { pop_short_stack_to_register('hl')                                  }],
  0xE2: ['LD (0xFF00 + C) A',   0, ()      => { ld_memxx_register_byte(0xFF00 + cpu.register.c, 'a')               }],
  0xE5: ['PUSH HL',             0, ()      => { push_short_register_to_stack('hl')                                 }],
  0xE6: ['AND E',               1, (x)     => { and_byte(x)                                                        }],
  0xE7: ['RST 0x20',            0, ()      => { push_pc_to_stack_jump(0x20)                                        }],
  0xE8: ['ADD SP',              1, (x)     => { add_sp_x_signed_to_register_short('sp', 'sp', x)                   }],
  0xE9: ['JP (HL)',             0, ()      => { jp_short(mem.readShort(cpu.register.hl))                           }],
  0xEA: ['LD (%xx) A',          2, (x, y)  => { ld_memxx_register_byte(bytesToShort(x, y), 'a')                    }],
  0xEE: ['XOR',                 1, (x)     => { xor_byte(x)                                                        }],
  0xEF: ['RST 0x28',            0, ()      => { push_pc_to_stack_jump(0x28)                                        }],
  0xF0: ['LDH A (0xFF00 + %x)', 1, (x)     => { ld_register_memxx_short('a', 0xFF00 + x)                           }],
  0xF1: ['POP AF',              0, ()      => { pop_short_stack_to_register('af')                                  }],
  0xF2: ['LD A (0xFF00 + C)',   0, ()      => { ld_register_memxx_short('a', 0xFF00 + cpu.register.c)              }],
  0xF3: ['DI',                  0, ()      => { cpu.queueDisableInterrupts()                                       }],
  0xF5: ['PUSH AF',             0, ()      => { push_short_register_to_stack('af')                                 }],
  0xF6: ['OR',                  1, (x)     => { or_byte(x)                                                         }],
  0xF7: ['RST 0x30',            0, ()      => { push_pc_to_stack_jump(0x30)                                        }],
  0xF8: ['LDHL SP',             1, (x)     => { add_sp_x_signed_to_register_short('hl', 'sp', x)                   }],
  0xF9: ['LD SP HL',            0, ()      => { ld_register_register('sp', 'hl')                                   }],
  0xFA: ['LD A (%xx)',          2, (x, y)  => { ld_register_memxx_bytes('a', x, y)                                 }],
  0xFB: ['EI',                  0, ()      => { cpu.queueEnableInterrupts()                                        }],
  0xFE: ['CP A',                1, (x)     => { cp_a_byte(x)                                                       }],
  0xFF: ['RST 0x38',            0, ()      => { push_pc_to_stack_jump(0x38)                                        }],
}

var CBInstructionSet = {
  0x00: ['RLC B',               0, ()      => { rotate_register_byte_left_carry('b')                               }],
  0x01: ['RLC C',               0, ()      => { rotate_register_byte_left_carry('c')                               }],
  0x02: ['RLC D',               0, ()      => { rotate_register_byte_left_carry('d')                               }],
  0x03: ['RLC E',               0, ()      => { rotate_register_byte_left_carry('e')                               }],
  0x04: ['RLC H',               0, ()      => { rotate_register_byte_left_carry('h')                               }],
  0x05: ['RLC L',               0, ()      => { rotate_register_byte_left_carry('l')                               }],
  0x06: ['RLC (HL)',            0, ()      => { rotate_memhl_byte_left_carry()                                     }],
  0x07: ['RLC A',               0, ()      => { rotate_register_byte_left_carry('a')                               }],
  0x08: ['RRC B',               0, ()      => { rotate_register_byte_right_carry('b')                              }],
  0x09: ['RRC C',               0, ()      => { rotate_register_byte_right_carry('c')                              }],
  0x0A: ['RRC D',               0, ()      => { rotate_register_byte_right_carry('d')                              }],
  0x0B: ['RRC E',               0, ()      => { rotate_register_byte_right_carry('e')                              }],
  0x0C: ['RRC H',               0, ()      => { rotate_register_byte_right_carry('h')                              }],
  0x0D: ['RRC L',               0, ()      => { rotate_register_byte_right_carry('l')                              }],
  0x0E: ['RRC (HL)',            0, ()      => { rotate_memhl_byte_right_carry()                                    }],
  0x0F: ['RRC A',               0, ()      => { rotate_register_byte_right_carry('a')                              }],
  0x10: ['RL B',                0, ()      => { rotate_register_byte_left_through_carry('b')                       }],
  0x11: ['RL C',                0, ()      => { rotate_register_byte_left_through_carry('c')                       }],
  0x12: ['RL D',                0, ()      => { rotate_register_byte_left_through_carry('d')                       }],
  0x13: ['RL E',                0, ()      => { rotate_register_byte_left_through_carry('e')                       }],
  0x14: ['RL H',                0, ()      => { rotate_register_byte_left_through_carry('h')                       }],
  0x15: ['RL L',                0, ()      => { rotate_register_byte_left_through_carry('l')                       }],
  0x16: ['RL (HL)',             0, ()      => { rotate_memhl_byte_left_through_carry()                             }],
  0x17: ['RL A',                0, ()      => { rotate_register_byte_left_through_carry('a')                       }],
  0x18: ['RR B',                0, ()      => { rotate_register_byte_right_through_carry('b')                      }],
  0x19: ['RR C',                0, ()      => { rotate_register_byte_right_through_carry('c')                      }],
  0x1A: ['RR D',                0, ()      => { rotate_register_byte_right_through_carry('d')                      }],
  0x1B: ['RR E',                0, ()      => { rotate_register_byte_right_through_carry('e')                      }],
  0x1C: ['RR H',                0, ()      => { rotate_register_byte_right_through_carry('h')                      }],
  0x1D: ['RR L',                0, ()      => { rotate_register_byte_right_through_carry('l')                      }],
  0x1E: ['RR (HL)',             0, ()      => { rotate_memhl_byte_right_through_carry()                            }],
  0x1F: ['RR A',                0, ()      => { rotate_register_byte_right_through_carry('a')                      }],
  0x20: ['SLA B',               0, ()      => { shift_register_byte_left('b')                                      }],
  0x21: ['SLA C',               0, ()      => { shift_register_byte_left('c')                                      }],
  0x22: ['SLA D',               0, ()      => { shift_register_byte_left('d')                                      }],
  0x23: ['SLA E',               0, ()      => { shift_register_byte_left('e')                                      }],
  0x24: ['SLA H',               0, ()      => { shift_register_byte_left('h')                                      }],
  0x25: ['SLA L',               0, ()      => { shift_register_byte_left('l')                                      }],
  0x26: ['SLA (HL)',            0, ()      => { shift_memhl_byte_left()                                            }],
  0x27: ['SLA A',               0, ()      => { shift_register_byte_left('a')                                      }],
  0x28: ['SRA B'                0, ()      => { shift_register_byte_right_msb('b')                                 }],
  0x29: ['SRA C'                0, ()      => { shift_register_byte_right_msb('c')                                 }],
  0x2A: ['SRA D'                0, ()      => { shift_register_byte_right_msb('d')                                 }],
  0x2B: ['SRA E'                0, ()      => { shift_register_byte_right_msb('e')                                 }],
  0x2C: ['SRA H'                0, ()      => { shift_register_byte_right_msb('h')                                 }],
  0x2D: ['SRA L'                0, ()      => { shift_register_byte_right_msb('l')                                 }],
  0x2E: ['SRA (HL)',            0, ()      => { shift_memhl_byte_right_msb()                                       }],
  0x2F: ['SRA A'                0, ()      => { shift_register_byte_right_msb('a')                                 }],
  0x30: ['SWAP B',              0, ()      => { swap_nibbles('b')                                                  }],
  0x31: ['SWAP C',              0, ()      => { swap_nibbles('c')                                                  }],
  0x32: ['SWAP D',              0, ()      => { swap_nibbles('d')                                                  }],
  0x33: ['SWAP E',              0, ()      => { swap_nibbles('e')                                                  }],
  0x34: ['SWAP H',              0, ()      => { swap_nibbles('h')                                                  }],
  0x35: ['SWAP L',              0, ()      => { swap_nibbles('l')                                                  }],
  0x36: ['SWAP (HL)',           0, ()      => { swap_nibbles_memhl()                                               }],
  0x37: ['SWAP A',              0, ()      => { swap_nibbles('a')                                                  }],
  0x38: ['SRL B',               0, ()      => { shift_register_byte_right('b')                                     }],
  0x39: ['SRL C',               0, ()      => { shift_register_byte_right('c')                                     }],
  0x3A: ['SRL D',               0, ()      => { shift_register_byte_right('d')                                     }],
  0x3B: ['SRL E',               0, ()      => { shift_register_byte_right('e')                                     }],
  0x3C: ['SRL H',               0, ()      => { shift_register_byte_right('h')                                     }],
  0x3D: ['SRL L',               0, ()      => { shift_register_byte_right('l')                                     }],
  0x3E: ['SRL (HL)',            0, ()      => { shift_memhl_byte_right()                                           }],
  0x3F: ['SRL A',               0, ()      => { shift_register_byte_right('a')                                     }],
  0x40: ['BIT %x B',            1, (bit)   => { test_register_byte_with_bit('b', bit)                              }],
  0x41: ['BIT %x C',            1, (bit)   => { test_register_byte_with_bit('c', bit)                              }],
  0x42: ['BIT %x D',            1, (bit)   => { test_register_byte_with_bit('d', bit)                              }],
  0x43: ['BIT %x E',            1, (bit)   => { test_register_byte_with_bit('e', bit)                              }],
  0x44: ['BIT %x H',            1, (bit)   => { test_register_byte_with_bit('h', bit)                              }],
  0x45: ['BIT %x L',            1, (bit)   => { test_register_byte_with_bit('l', bit)                              }],
  0x46: ['BIT %x (HL)',         1, (bit)   => { test_memhl_byte_with_bit(bit)                                      }],
  0x47: ['BIT %x A',            1, (bit)   => { test_register_byte_with_bit('a', bit)                              }],
  0xC0: ['SET %x B',            1, (bit)   => { set_register_byte_with_bit('b', bit)                               }],
  0xC1: ['SET %x C',            1, (bit)   => { set_register_byte_with_bit('c', bit)                               }],
  0xC2: ['SET %x D',            1, (bit)   => { set_register_byte_with_bit('d', bit)                               }],
  0xC3: ['SET %x E',            1, (bit)   => { set_register_byte_with_bit('e', bit)                               }],
  0xC4: ['SET %x H',            1, (bit)   => { set_register_byte_with_bit('h', bit)                               }],
  0xC5: ['SET %x L',            1, (bit)   => { set_register_byte_with_bit('l', bit)                               }],
  0xC6: ['SET %x (HL)',         1, (bit)   => { set_memhl_byte_with_bit(bit)                                       }],
  0xC7: ['SET %x A',            1, (bit)   => { set_register_byte_with_bit('a', bit)                               }],
  0x80: ['RES %x B',            1, (bit)   => { reset_register_byte_with_bit('b', bit)                             }],
  0x81: ['RES %x C',            1, (bit)   => { reset_register_byte_with_bit('c', bit)                             }],
  0x82: ['RES %x D',            1, (bit)   => { reset_register_byte_with_bit('d', bit)                             }],
  0x83: ['RES %x E',            1, (bit)   => { reset_register_byte_with_bit('e', bit)                             }],
  0x84: ['RES %x H',            1, (bit)   => { reset_register_byte_with_bit('h', bit)                             }],
  0x85: ['RES %x L',            1, (bit)   => { reset_register_byte_with_bit('l', bit)                             }],
  0x86: ['RES %x (HL)',         1, (bit)   => { reset_memhl_byte_with_bit(bit)                                     }],
  0x87: ['RES %x A',            1, (bit)   => { reset_register_byte_with_bit('a', bit)                             }],
}

function reset_register_byte_with_bit(register, bit){
  cpu.register[register] = cpu.ops.reset_bit(bit, cpu.register[register])
}

function reset_memhl_byte_with_bit(bit){
  mem.writeByte(cpu.register.hl, cpu.ops.reset_bit(bit, mem.readByte(cpu.register.hl)))
}

function set_register_byte_with_bit(register, bit){
  cpu.register[register] = cpu.ops.set_bit(bit, cpu.register[register])
}

function set_memhl_byte_with_bit(bit){
  mem.writeByte(cpu.register.hl, cpu.ops.set_bit(bit, mem.readByte(cpu.register.hl)))
}

function test_register_byte_with_bit(register, bit){
  cpu.ops.test_bit(bit, cpu.register[register])
}

function test_memhl_byte_with_bit(bit){
  cpu.ops.test_bit(bit, mem.readByte(cpu.register.hl))
}

// shift left
function shift_register_byte_left(register){
  cpu.register[register] = cpu.ops.sl(cpu.register[register])
}

function shift_memhl_byte_left(){
  mem.writeByte(cpu.register.hl, cpu.ops.sl(mem.readByte(cpu.register.hl)))
}

// shift right
function shift_register_byte_right(register){
  cpu.register[register] = cpu.ops.sr(cpu.register[register])
}

function shift_memhl_byte_right(){
  mem.writeByte(cpu.register.hl, cpu.ops.sr(mem.readByte(cpu.register.hl)))
}

// shift right, preserve MSB (Most Significant Bit)
function shift_register_byte_right_msb(register){
  cpu.register[register] = cpu.ops.sr_preserve_msb(cpu.register[register])
}

function shift_memhl_byte_right_msb(){
  mem.writeByte(cpu.register.hl, cpu.ops.sr_preserve_msb(mem.readByte(cpu.register.hl)))
}


// right rotations, through carry and without
function rotate_memhl_byte_right_carry(){
  mem.writeByte(cpu.register.hl, cpu.ops.rrc(mem.readByte(cpu.register.hl)))
}

function rotate_memhl_byte_right_through_carry(){
  mem.writeByte(cpu.register.hl, cpu.ops.rr(mem.readByte(cpu.register.hl)))
}

function rotate_register_byte_right_carry(register){
  cpu.register[register] = cpu.ops.rrc(cpu.register[register])
}

function rotate_register_byte_right_through_carry(register){
  cpu.register[register] = cpu.ops.rr(cpu.register[register])
}

// Left rotations, through carry and without (through carry is when the carry gets
// placed into the register)
function rotate_memhl_byte_left_carry(){
  mem.writeByte(cpu.register.hl, cpu.ops.rlc(mem.readByte(cpu.register.hl)))
}

function rotate_memhl_byte_left_through_carry(){
  mem.writeByte(cpu.register.hl, cpu.ops.rl(mem.readByte(cpu.register.hl)))
}

function rotate_register_byte_left_carry(register){
  cpu.register[register] = cpu.ops.rlc(cpu.register[register])
}

function rotate_register_byte_left_through_carry(register){
  cpu.register[register] = cpu.ops.rl(cpu.register[register])
}

function bcd_pack_a(){
  cpu.register.a = cpu.ops.bcd_pack(cpu.register.a)
}

function swap_nibbles_memhl(){
  mem.writeByte(cpu.register.hl, cpu.ops.swapNibbles(mem.readByte(cpu.register.hl)))
}

function swap_nibbles(register){
  cpu.register[register] = cpu.ops.swapNibbles(cpu.register[register])
}

function add_sp_x_signed_to_register_short(registerDest, registerSrc, x){
  ld_register_short(registerDest, cpu.ops.add_sp_x(cpu.register[registerSrc], cast.uint8(x)))
}

function add_register_short_to_hl(register){
  cpu.register.hl = cpu.ops.add_16(cpu.register.hl, cpu.register[register])
}

function dec_memhl(){
  mem.writeByte(cpu.register.hl, cpu.ops.dec(mem.readByte(cpu.register.hl)))
}

function dec_register(register){
  cpu.register[register] = cpu.ops.dec(cpu.register[register])
}

function inc_memhl(){
  mem.writeByte(cpu.register.hl, cpu.ops.inc(mem.readByte(cpu.register.hl)))
}

function inc_register(register){
  cpu.register[register] = cpu.ops.inc(cpu.register[register])
}

function ops_op_set_a(op, val){
  cpu.register.a = cpu.ops[op](cpu.register.a, val)
}

// Bitwise ^ Register A with Provided Register. Results in A
function xor_register(register){
  ops_op_set_a('xor', cpu.register[register])
}

// Bitwise ^ Register A with Memory Location HL. Results in A
function xor_memhl(){
  ops_op_set_a('xor', mem.readByte(cpu.register.hl))
}

// Bitwise ^ Register A with Byte. Results in A
function xor_byte(x){
  ops_op_set_a('xor', byte)
}

// Bitwise | Register A with Provided Register. Results in A
function or_register(register){
  ops_op_set_a('or', cpu.register[register])
}

// Bitwise | Register A with Memory Location HL. Results in A
function or_memhl(){
  ops_op_set_a('or', mem.readByte(cpu.register.hl))
}

// Bitwise | Register A with Byte. Results in A
function or_byte(x){
  ops_op_set_a('or', byte)
}

// Bitwise & Register A with Provided Register. Results in A
function and_register(register){
  ops_op_set_a('and', cpu.register[register])
}

// Bitwise & Reigster A with Memory Location HL. Results in A
function and_memhl(){
  ops_op_set_a('and', mem.readByte(cpu.register.hl))
}

// Bitwise & Register A with Byte. Results in A
function and_byte(x){
  ops_op_set_a('and', byte)
}

// Populates Byte Register with Memory Read (Short Arg)
function ld_register_memxx_short(registerDest, short){
  cpu.register[registerDest] = mem.readByte(short)
}

// Populates Byte Register with Memory Read (2 Bytes Args)
function ld_register_memxx_bytes(registerDest, byte1, byte2){
  ld_register_memxx_short(registerDest, bytesToShort(byte1, byte2))
}

// Populates Short Register Value Memory Location with Supplied Byte
function ld_memregister_x(registerDest, byte){
  mem.writeByte(cpu.register[registerDest], byte)
}

// Populates Short Memory Location with Short Register
function ld_memxx_register_short(short, register){
  mem.writeShort(short, cpu.register[register])
}

// Populates Short Memory Location with Byte Register
function ld_memxx_register_byte(short, register){
  mem.writeByte(short, cpu.register[register])
}

// Populates Short Register Value Memory Location with Byte Register
function ld_memregister_register_byte(registerDest, registerSrc){
  mem.writeByte(cpu.register[registerDest], cpu.register[registerSrc])
}

// Populates Byte Register with Byte Register Value Memory Read
function ld_register_memregister_byte(registerDest, registerSrc){
  cpu.register[register] = mem.readByte(cpu.register[registerSrc])
}

// Populates Byte Register with Byte
function ld_register_x(register, byte){
  cpu.register[register] = byte
}

// Populates Short Register with Short
function ld_register_short(register, short){
  cpu.register[register] = short
}

// Populates Short Register with Short made of Bytes
function ld_register_xx(register, byte, byte2){
  cpu.register[register] = bytesToShort(byte, byte2)
}

// Populates One Register with Another (Byte or Short, as long as they match)
function ld_register_register(registerDest, registerSrc){
  cpu.register[registerDest] = cpu.register[registerSrc]
}

function jr_x_signed(byte){
  cpu.register.pc += cast.int8(byte)
}

function add(x){
  ops_op_set_a('add',  x)
}

// Add Register + Carry Flag to A. Results in A
function add_register_byte_plus_carry_to_a(register){
  // using | 0 pipe at the end to force the True or False value of Carry Flag to a 1 or 0
  add(cpu.register[register] + (cpu.register.f.c | 0))
}

// Add Memory HL + Carry Flag to A. Results in A
function add_memhl_byte_plus_carry_to_a(){
  add(mem.readByte(cpu.register.hl) + (cpu.register.f.c | 0))
}

// Add Byte + Carry Flag to A. Results in A
function add_byte_plus_carry_to_a(byte){
  add(byte + (cpu.register.f.c | 0))
}

// Add Register to A. Results in A
function add_register_byte_to_a(register){
  add(cpu.register[register])
}

// Add Memory HL to A. Results in A
function add_memhl_byte_to_a(){
  add(mem.readByte(cpu.register.hl))
}

// Add Byte to A. Results in A
function add_byte_to_a(byte){
  add(byte)
}

function sub(x){
  ops_op_set_a('sub', x)
}

// Subtract Register and Carry from A. Results in A
function sub_register_byte_and_carry_from_a(register){
  sub(cpu.register[register] + (cpu.register.f.c | 0))
}

// Subtract Memory HL And Carry from A. Results in A
function sub_memhl_byte_and_carry_from_a(){
  sub(mem.readByte(cpu.register.hl) + (cpu.register.f.c | 0))
}

// Subtract Byte and Carry from A. Results in A
function sub_byte_and_carry_from_a(byte){
  sub(byte + (cpu.register.f.c | 0))
}

// Subtract Register from A. Results in A
function sub_register_byte_from_a(register){
  sub(cpu.register[register])
}

// Subtract Memory HL from A. Results in A
function sub_memhl_byte_from_a(){
  sub(mem.readByte(cpu.register.hl))
}

// Subtract Byte from A. Results in A
function sub_byte_from_a(byte){
  sub(byte)
}

function jp_short(short){
  cpu.register.pc = short
}

function jp_xx(byte, byte2){
  jp_short(bytesToShort(byte, byte2))
}

function cp_a_memhl(){
  cpu.ops.subtract(cpu.register.a, mem.readByte(cpu.register.hl))
}

function cp_a_register(register){
  cpu.ops.subtract(cpu.register.a, cpu.register[register])
}

function cp_a_byte(byte){
  cpu.ops.subtract(cpu.register.a, byte)
}

// POP Stack to Short Register
function pop_short_stack_to_register(register){
  cpu.register[register] = mem.readStack()
}

// PUSH Short Register to Stack
function push_short_register_to_stack(register){
  mem.writeStack(cpu.register[register])
}

function push_pc_to_stack_jump(byte_or_short){
  mem.writeStack(cpu.register.pc)
  cpu.register.pc = byte_or_short
}

function read_stack_and_jump(){
  cpu.register.pc = mem.readStack()
}