const xml2js = require('xml2js');
const fs = require('fs');

const file = fs.readFileSync('/Users/waiter/Downloads/transform.html', 'utf-8')

const s = `
<svg xmlns="http://www.w3.org/2000/svg"
        width="1.922ex" height="1.742ex" role="img" focusable="false" viewBox="0 -759 849.5 770"
        xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" style="vertical-align: -0.025ex;">
        <defs>
          <path id="MJX-7-TEX-I-1D465"
            d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z">
          </path>
          <path id="MJX-7-TEX-V-2032"
            d="M79 43Q73 43 52 49T30 61Q30 68 85 293T146 528Q161 560 198 560Q218 560 240 545T262 501Q262 496 260 486Q259 479 173 263T84 45T79 43Z">
          </path>
        </defs>
        <g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)">
          <g data-mml-node="math">
            <g data-mml-node="msup">
              <g data-mml-node="mi">
                <use data-c="1D465" xlink:href="#MJX-7-TEX-I-1D465"></use>
              </g>
              <g data-mml-node="mo" transform="translate(605,363) scale(0.707)">
                <use data-c="2032" xlink:href="#MJX-7-TEX-V-2032"></use>
              </g>
            </g>
          </g>
        </g>
      </svg>
`

const map = {};
const defReg = /<defs>([^]*?)<\/defs>/g;
const useReg = /<use[^>]*><\/use>/g;
const all = [...file.matchAll(defReg)];
const allUse = [...file.matchAll(useReg)];
all.forEach(it => {
  xml2js.parseString(it[0], (err, data) => {
    data.defs.path.forEach(p => {
      if (map[p.$.id] && map[p.$.id] !== p.$.d) {
        throw new Error('xxxxx');
      }
      map[p.$.id] = p.$.d;
    });
  });
});
console.log(map);
let newFile = file.replace(defReg, '');
console.log(newFile);
allUse.forEach(it => {
  xml2js.parseString(it[0], (err, data) => {
    const u = data.use.$;
    const id = u['xlink:href'].substr(1);
    delete u['xlink:href'];
    if (!map[id]) {
      throw new Error('xxxx');
    }
    u.d = map[id];
    const attrs = Object.keys(u).map(k => `${k}="${u[k]}"`).join(' ');
    const now = `<path ${attrs} ></path>`;
    newFile = newFile.replace(it[0], now);
  });
});
fs.writeFileSync('/Users/waiter/Downloads/transform2.html', newFile)
// console.log(all[0][1])

// xml2js.parseString(all[0][1], (err, data) => {
//   console.log(data)

// });