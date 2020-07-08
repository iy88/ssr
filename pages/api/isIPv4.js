const net = require('net');
export default (req,res)=>{
  if(req.body.ip || req.query.ip){
    res.send({ret:1,detail:'S',data:{isIPv4:net.isIPv4(req.query.ip || req.body.ip)}});
  }else{
    res.send({ret:-999,detail:'PL',data:null});
  }
}