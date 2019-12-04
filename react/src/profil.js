import React from 'react';
import {Card} from 'trunx';
import {Media} from 'trunx';
import {Title} from 'trunx';
import {Subtitle} from 'trunx';
import {Content} from 'trunx';
import { Column } from 'trunx';
import { Columns } from 'trunx';
import { Message } from 'trunx';

// String(localStorage.getItem("DATA").username);

export default class ProfilPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      password:'',
      token: '',
      img: 'https://bulma.io/images/placeholders/1280x960.png',
      type_account: '',
      email: '',
      bool: false
    };
  }
  render() {
    if (localStorage.getItem("DATA") && this.state.bool === false) {
      this.setState({username : localStorage.getItem("DATA.USERNAME")});
      this.setState({password : localStorage.getItem("DATA.PASSWORD")});
      this.setState({token : localStorage.getItem("DATA.TOKEN")});
      this.setState({img: localStorage.getItem("DATA.IMAGE")});
      this.setState({type_account: localStorage.getItem("DATA.TYPE_ACCOUNT")});
      this.setState({email: localStorage.getItem("DATA.EMAIL")});
      this.setState({bool: true});
    }
    console.log("RENDER profilPage");
    return (
      <Columns>
      <Column>
      <Message>
  <Message.Header>
    User Profil Page
  </Message.Header>
  <Message.Body>
      <Card>
        <Card.Image
            alt='Placeholder image'
            is4by3
            src='https://bulma.io/images/placeholders/1280x960.png'/>
      <Card.Content>
      <Media>
        <Media.Content>
          <Title is4>Username: {this.state.username ? this.state.username : "UNDEFINED"}</Title>
          <Subtitle is6>Id: {this.state.token ? this.state.token : "UNDEFINED"}</Subtitle>
        </Media.Content>
      </Media>
      <Content>
      <p>Password: {this.state.password ? this.state.password: "UNDEFINED"}</p>
      <p>Type_Account: {this.state.type_account ? this.state.type_account: "UNDEFINED"}</p>
      <p>email: {this.state.email ? this.state.email: "UNDEFINED"}</p>
      </Content>
      </Card.Content></Card>
        </Message.Body>
        </Message>
      </Column>
    </Columns>
    );}
}