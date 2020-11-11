{
    
}

start
 = get / set / keys / expire / exist / del / show

show 
 = ws "SHOW" ws {
  // console.log("SHOW");
  return { command: 'SHOW' } 
}

get
 = "GET" ws key:key ws{
  // console.log("GET =>  key['" + key + "']");
  return {
    command: 'GET',
    key: key
  }
}

set
 = "SET" ws key:key ws value:value ws {
 	  // console.log("SET =>  key['" + key + "'] value['"+ value +"']");
    return {
      command: 'SET',
      key: key,
      value: value
    }
    
}

keys
 = "KEYS" ws pattern:pattern ws {
    // console.log("KEYS =>  pattern['" + pattern + "']");
    return {
      command: 'KEYS',
      pattern: pattern
    }
}

expire
 = "EXPIRE" ws key:key ws seconds:Integer ws {
    // console.log("EXPIRE =>  key['" + key + "'] seconds['"+ seconds +"']");
    return {
      command: 'EXPIRE',
      key: key,
      seconds: seconds
    }
}

exist
  = "EXIST" ws
    values:(
      head:key
      tail:(ws v:key { return v; })*
      { return [head].concat(tail); }
    )+ ws { 
        if (values !== null) {
            values = values[0];
        } else {
            values = [];
        } 
        // console.log("EXIST =>  keys['"+ values +"']");
        return {
          command: 'EXIST',
          values: values
        }
        
    }
    
del
  = "DEL" ws
    values:(
      head:key
      tail:(ws v:key { return v; })*
      { return [head].concat(tail); }
    )+ ws { 
        if (values !== null) {
            values = values[0];
        } else {
            values = [];
        } 
        // console.log("DEL =>  keys['"+ values +"']");
        
        return {
          command: 'DEL',
          values: values
        } 
    }
 
key
 = [a-zA-Z_][a-zA-Z_0-9]* { return text(); }

pattern
 = [/^?/*\[\]a-zA-Z]* { return text(); }

value
  = false
  / null
  / true
  / array
  / number
  / string
  / [a-zA-Z0-9_]+ { return text(); }

false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

number "number"
  = minus? int frac? exp? { return parseFloat(text()); }

decimal_point
  = "."

digit1_9
  = [1-9]

e
  = [eE]

exp
  = e (minus / plus)? DIGIT+

frac
  = decimal_point DIGIT+

int
  = zero / (digit1_9 DIGIT*)

minus
  = "-"

plus
  = "+"

zero
  = "0"

string
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }
  / "'" chars:SingleStringCharacter* "'" { return chars.join(''); }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }

Integer "number"
  = ws [0-9]+ { return parseInt(text(), 10); }

array
  = begin_array
    values:(
      head:value
      tail:(value_separator v:value { return v; })*
      { return [head].concat(tail); }
    )?
    end_array
    { return values !== null ? values : []; }

begin_array     = ws "[" ws
begin_object    = ws "{" ws
end_array       = ws "]" ws
end_object      = ws "}" ws
name_separator  = ws ":" ws
value_separator = ws "," ws

DIGIT  = [0-9]

ws "whitespace" = [ \t\n\r]*