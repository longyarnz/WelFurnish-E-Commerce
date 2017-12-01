import React, { Component } from 'react';
import Logo from '../files/logo.png';
import SocialIcons from './SocialIcons';

export default class LandingPanel extends Component {
  constructor(props) {
    super(props);
    this._click = this._click.bind(this);
    this.state = { height: window.screen.availHeight - 80 }
  }

  _click(){
    this.props.actions.viewShop(true);
  }

  render() {
    const { height } = this.state;
    const inline = { height }
    const iconArray = ["fa-facebook", "fa-twitter", "fa-instagram"];
    return (
      <section className="landing-panel" style={inline} >
        <div className="dk-bg">
          <header className="landing-panel">
            <img src={Logo} alt="WelFurnish" />
          	<h1 className="landing-panel">
              Welcome To The WelFurnish Workshop <br />
            </h1>
            <h3 className="landing-panel">&copy; 2017 | Designed By Longyarnz Inc. 08082935102</h3>
            <SocialIcons iconList={iconArray} iconClass="media" />
            <button className="landing-panel" name="start" value="start" onClick={this._click} role="button" arial-label="Start"></button>
          </header>
        </div>
      </section>
    );
  }
}
