import Head from 'next/head'
import react from 'react';
import axios from 'axios';
import { withRouter } from 'next/router'
class Home extends react.Component {
  constructor(porps) {
    super(porps);
    this.state = { ip: null,cityId:'N/A',city:'N/A',province:'N/A',ISP:'N/A' };
    this.handleInput = this.handleInput.bind(this);
    this.get = this.get.bind(this);
  }
  handleInput(event) {
    event.preventDefault();
    this.setState({ip:event.target.value});
  }
  async get(event) {
    event.preventDefault();
    if(this.state.ip !== null){
      try{
        let {data} = await axios.get('/api/isIPv4?ip='+this.state.ip);
        if(data.data.isIPv4){
          let {data} = this.state.ip === '0.0.0.0' ? await axios.get('https://iy88.site:433/openapi/ipRegion') : await axios.get('/api/ipRegion?ip='+this.state.ip);
          this.setState(data.data);
        }else{
          alert('please input an corrent ipv4 address')
        }
      }catch(e){
        alert('network error');
      }
    }
  }
  render() {
    return (
      <div className="container">
        <Head>
          <title>ip region</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h3>input a ipv4 address to get region info</h3>
        <h5>input 0.0.0.0 to get yourself ip & ip region info</h5>
        <input onInput={this.handleInput} placeholder="input an ip address"/><button type="button" onClick={this.get} dangerouslySetInnerHTML={{__html:"get region"}}/>
        <h4>ip: {this.state.ip}</h4>
        <h4>cityId: {this.state.cityId}</h4>
        <h4>city: {this.state.city}</h4>
        <h4>province: {this.state.province}</h4>
        <h4>ISP: {this.state.ISP}</h4>
      </div>
    )
  }
}

export default withRouter(Home);
