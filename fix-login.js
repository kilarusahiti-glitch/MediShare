const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Auth/Login.jsx', 'utf8');

// Use string concatenation instead of backticks to completely bypass template literal parsing issues
content = content.replace(/filter: `blur\(\$\{b\.blur\}px\)`/g, 'filter: "blur(" + b.blur + "px)"');
content = content.replace(/border: `1\.5px solid \$\{T\.blueSoft\}`/g, 'border: "1.5px solid " + T.blueSoft');
content = content.replace(/border: `1px solid rgba\(91,155,213,0\.2\)`/g, 'border: "1px solid rgba(91,155,213,0.2)"');
content = content.replace(/`http:\/\/localhost:5000\/api\/auth\/login\/\$\{role\}`/g, '"http://localhost:5000/api/auth/login/" + role');

// Also fix the case if there is any stray backslash remaining
content = content.replace(/filter: \\`blur\(\\\$\{b\.blur\}px\)\\`/g, 'filter: "blur(" + b.blur + "px)"');
content = content.replace(/border: \\`1\.5px solid \\\$\{T\.blueSoft\}\\`/g, 'border: "1.5px solid " + T.blueSoft');
content = content.replace(/border: \\`1px solid rgba\(91,155,213,0\.2\)\\`/g, 'border: "1px solid rgba(91,155,213,0.2)"');
content = content.replace(/\\`http:\/\/localhost:5000\/api\/auth\/login\/\\\$\{role\}\\`/g, '"http://localhost:5000/api/auth/login/" + role');

// Write fixed content
fs.writeFileSync('client/src/pages/Auth/Login.jsx', content);
console.log('Login.jsx script rewrite executed.');
