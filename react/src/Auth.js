import React from 'react';
import {Column} from 'trunx'
import {Label} from 'trunx'
import {Control} from 'trunx'
import {Input} from 'trunx'
import {Help} from 'trunx'
import {Button} from 'trunx'
import {Columns} from 'trunx'
import axios from 'axios'
import FacebookLogin from 'react-facebook-login'

import history from './history'

class Reg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          email: '',
          password1: '',
          password2: '',
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.type = "UNDEFINED";
    }
    dismiss() {
      this.props.unmountMe();
    }
    handleChange(event) {
      this.setState({[event.target.name]:event.target.value});
    }
    async handleSubmit(event) {
      event.preventDefault()
      if (this.state.password1 !== this.state.password2 || this.state.password1 === '') {
        this.type = "ERROR-PASSWORD";
        console.log("ERROR register");
        this.forceUpdate();
      }
      else {
        await axios({
          method: 'post',
            url: 'http://localhost:7070/register',
            data: JSON.stringify({
              username: this.state.username,
              password: this.state.password1,
              email: this.state.email
            }),
            headers: {
              'Content-Type' : 'application/json',
            }
          }).then(response => {
            if (response.data === "This username does already exist") {
              this.type = "ERROR-USERNAME";
              this.forceUpdate();
              console.log("ERROR register");
            }
            else {
              this.type = "OK"
              this.forceUpdate();
              console.log("Ok Register");
            }
          });
      }
    }
    render() {
      return (
        <Columns>
          <Column></Column>
          <Column isOneQuarter isCentered>
          <h1>Register Page</h1>
              <form onSubmit={this.handleSubmit}>
                <Label>
                  Username
                </Label>
                  <Control>
                    <Input isRounded name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
                  </Control>
                  <Label>
                  Email
                </Label>
                  <Control>
                    <Input isRounded name="email" type="email" value={this.state.email} onChange={this.handleChange}/>
                  </Control>
                <Label>
                  Password
                </Label>
                  <Control>
                    <Input isRounded name="password1" type="password" value={this.state.password1} onChange={this.handleChange}/>
                  </Control>
                <Label>
                  Comfirm Password
                </Label>
                  <Control>
                    <Input isRounded name="password2" type="password" value={this.state.password2} onChange={this.handleChange}/>
                  </Control>
                  {this.type === "ERROR-USERNAME" ? <Help isDanger>This username does already exist</Help> : ""}
                  {this.type === "ERROR-PASSWORD" ? <Help isDanger>Make sure you enter the same passwords</Help> :""}
                  {this.type === "OK" ? <Help isSuccess>Your registration is successful</Help> : ""}
                <Column>
                  <Button isLink type="submit" value="Register"></Button>
              </Column>
            </form>
          </Column>
          <Column></Column>
        </Columns>
      );}
}

const responseFacebook = (response) => {
  console.log("RESPONSE FACEBOOK:");
  console.log(response);
  console.log(response.name);
  console.log(response.accessToken);
  console.log(response.picture);
  if (!response.error) {
    axios({
      method: 'post',
      url: 'http://localhost:7070/auth/facebook',
      data: JSON.stringify({
      username: response.name,
      token: response.accessToken,
      email: response.email,
      }),
      headers: {
        'Content-Type' : 'application/json',
      }
    }).then(res => {
      localStorage.setItem("auth", true)
      localStorage.setItem("DATA.USERNAME", res.data.username);
      localStorage.setItem("DATA.PASSWORD", "facebook-password");
      localStorage.setItem("DATA.TOKEN", res.data.token);
      localStorage.setItem("DATA.IMAGE", res.data.picture);
      localStorage.setItem("DATA.TYPE_ACCOUNT", res.data.type_account);
      localStorage.setItem("DATA.WIDGETS", res.data.widgets);
      localStorage.setItem("DATA.EMAIL", res.data.mail);
      history.push("/dashboard");
    });
  }
}

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '',
          password: ''
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.bool = false;
        this.boolmail = false;
    }
    dismiss() {
      this.props.unmountMe();
    }
    handleChange(event) {
      this.setState({[event.target.name]:event.target.value});
    }
    handleSignout(event) {
      localStorage.removeItem('auth');
      history.push('/');
      window.location.reload();
    }
    handleDashboard(event) {
      history.push('/dashboard');
    }
    async handleSubmit(event) {
        event.preventDefault();
        await axios({
          method: 'post',
          url: 'http://localhost:7070/login',
          data: JSON.stringify({
            username: this.state.username,
            password: this.state.password
          }),
          headers: {
            'Content-Type' : 'application/json',
          }
        }).then(response => {
          if (response.data !== "Wrong Password") {
            if (response.data.comfirm === true) {
              this.bool = false;
              this.boolmail = false;
              console.log("[200] this.bool:" + this.bool);
              console.log("OK login");
              console.log("DATA:" + response.data);
              localStorage.setItem("auth", true)
              localStorage.setItem("DATA.USERNAME", response.data.username);
              localStorage.setItem("DATA.PASSWORD", response.data.password);
              localStorage.setItem("DATA.TOKEN", response.data.token);
              localStorage.setItem("DATA.TYPE_ACCOUNT", response.data.type_account);
              localStorage.setItem("DATA.WIDGETS", response.data.widgets);
              if (response.data.img)
                localStorage.setItem("DATA.IMAGE", response.data.img);
              else
                localStorage.setItem("DATA.IMAGE", "https://bulma.io/images/placeholders/1280x960.png");
              localStorage.setItem("DATA", response.data);
              history.push("/dashboard");
            }
            else {
              this.boolmail = true;
              console.log("Please comfirm your mail");
              this.forceUpdate();
            }
          }
          else {
            this.bool = true;
            console.log("[200] this.bool:" + this.bool);
            console.log("Error login");
            this.forceUpdate();
          }
        });
    }
    render() {
        return (
          <Columns>
            <Column></Column>
          {!localStorage.getItem('auth') ?
            <Column isOneQuarter isCentered>
            <h1>Connection Page</h1>
              <form onSubmit={this.handleSubmit}>
                <Label>
                  Username
                </Label>
                <Control>
                  <Input isRounded name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
                </Control>
                <Label>
                  Password
                </Label>
                <Control>
                  <Input isRounded name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
                </Control>
                {this.bool ? <Help isDanger>This password isn't valide</Help> : ""}
                {this.boolmail ? <Help isDanger>Please comfirm your mail adress</Help> : ""}
                <Column>
                    <Button isLink type="submit" value="Login"></Button>
                </Column>
              </form>
              <FacebookLogin 
              appId="685695001957247"
              autoLoad={true}
              fields="name,email,picture"
              callback={responseFacebook}/>
            </Column>
              : <Column><h1>Do you really want to disconnect from this wonderful dashboard? I do not think so, but do what you want after all.
                </h1>
                <Button onClick={this.handleDashboard}>Return on the dashboard</Button>
                <Button onClick={this.handleSignout}>Logout</Button></Column>}
            <Column></Column>
        </Columns>
      );}
}

export default class LoginPage extends React.Component {
  constructor(props){
      super(props)
      this.state = {renderAuth: true};
      this.handleAuthUnmount = this.handleAuthUnmount.bind(this);
      this.name = "You're not registered yet ?"
  }
  handleAuthUnmount(){
    if (this.state.renderAuth === true) {
      this.setState({renderAuth: false});
      this.name = "Are you already registered ?"
    }
    else {
      this.setState({renderAuth: true});
      this.name = "You're not registered yet ?"
    }
  }
  render(){
    return (
      <span>
        {this.state.renderAuth ? <Auth unmountMe={this.handleAuthUnmount} /> : <Reg unmountMe={this.handleAuthUnmount} />}
      <Button onClick={this.handleAuthUnmount}>{this.name}</Button>
      </span>
    );}
}