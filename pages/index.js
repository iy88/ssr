import Head from 'next/head'
import react from 'react';
import axios from 'axios';
import { withRouter } from 'next/router';
function unique(arr) {
  return [...new Set(arr)];
}
class Home extends react.Component {
  constructor(porps) {
    super(porps);
    this.state = { ip: '', cityId: 'N/A', country: 'N/A', province: 'N/A', city: 'N/A', ISP: 'N/A', history: [] };
    this.handleInput = this.handleInput.bind(this);
    this.get = this.get.bind(this);
  }
  handleInput(event) {
    event.preventDefault();
    this.setState({ ip: event.target.value });
  }
  async get(event) {
    event.preventDefault();
    if (this.state.ip !== '') {
      let find = this.state.history.find((item) => {
        return item.ip === this.state.ip
      })
      if (find) {
        this.setState({ ...find });
      } else {
        try {
          let res = await axios.get('/api/isIPv4?ip=' + this.state.ip);
          if (res.data.data.isIPv4) {
            let { data } = this.state.ip === '0.0.0.0' ? await axios.get('https://iy88.site:433/openapi/ipRegion') : await axios.get('/api/IPRegion?ip=' + this.state.ip);
            this.setState(data.data);
            this.setState({ history: this.state.history.reverse() });
            this.state.history.push({ ...data.data });
            this.setState({ history: this.state.history.reverse() });
          } else {
            alert('please input an corrent ipv4 address')
          }
        } catch (e) {
          alert('network error');
        }
      }
    }
  }
  componentDidMount() {
    this.state.history = JSON.parse(localStorage.getItem("history") || "[]");
    this.state.history.forEach((json, index) => {
      this.state.history[index] = JSON.parse(json);
    });
    window.onbeforeunload = () => {
      let nv = this.state.history;
      nv.forEach((json, index) => {
        nv[index] = JSON.stringify(json);
      });
      localStorage.setItem("history", JSON.stringify(unique(nv)));
    };
    setInterval(() => {
      this.state.history = unique(this.state.history);
    }, 100);
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
        <input onInput={this.handleInput} placeholder="input an ip address" /><button type="button" onClick={this.get} dangerouslySetInnerHTML={{ __html: "get region" }} />
        <h4>ip: {this.state.ip}</h4>
        <h4>country: {this.state.country}</h4>
        <h4>cityId: {this.state.cityId}</h4>
        <h4>city: {this.state.city}</h4>
        <h4>province: {this.state.province}</h4>
        <h4>ISP: {this.state.ISP}</h4>
      </div>
    )
  }
}

export default withRouter(Home);