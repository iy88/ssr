const net = require('net');
const searcher = require('node-ip2region').create();
export default (req, res) => {
  if (req.query.ip || req.body.ip) {
    if (net.isIPv4(req.query.ip || req.body.ip)) {
      let r = searcher.memorySearchSync(req.query.ip || req.body.ip);
      let t = r.region.split('|');
      let country = t[0] === '0' ? undefined : t[0];
      let region = t[1] === '0' ? undefined : t[1];
      let province = t[2] === '0' ? undefined : t[2];
      let j = { ip: req.query.ip || req.body.ip, cityId: r.city, country, region, province, city: t[3], ISP: t[4] };
      res.send({ ret: 1, detail: 'S', data: j })
    } else {
      res.send({ ret: 0, detail: 'IIPv4', data: null });
    }
  } else {
    let r = searcher.memorySearchSync(req.connection.remoteAddress);
    let t = r.region.split('|');
    let country = t[0] === '0' ? undefined : t[0];
    let region = t[1] === '0' ? undefined : t[1];
    let province = t[2] === '0' ? undefined : t[2];
    let j = { ip: req.connection.remoteAddress, cityId: r.city, country, region, province, city: t[3], ISP: t[4] };
    res.send({ ret: 1, detail: 'S', data: j });
  }
}