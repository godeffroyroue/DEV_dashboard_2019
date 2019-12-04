import React from 'react';
import {Column} from 'trunx'
import {Button} from 'trunx'
import {Link} from 'react-router-dom'
import {Box} from 'trunx'
import {Columns} from 'trunx'
import {Delete} from 'trunx'
import {Modal} from 'trunx'
import {Menu} from 'trunx'
import {Li} from 'trunx'
import {A} from 'trunx'
// import solidIcon from 'fa-svg-icon/solid'

import MainWeatherPage from './Mainweather.js'
import MainWorldClockPage from './MainWorldClock.js'
import MainCinemaPage from './MainCinema.js'
import YoutubePage from './youtube.js'
import ProfilPage from './profil.js';

class SaveService extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
  }
  closeModal () {
    this.setState({ isActive: false })
  }
  openModal () {
    this.setState({ isActive: true })
  }
  receiveHidenFinal = () => {
    this.props.newHidenFinal(this.props.nameService)
    this.closeModal()
  }
  render () {
    const {
      isActive
    } = this.state
    return (
      <React.Fragment>
        <Button isLarge isPrimary onClick={this.openModal}>{this.props.nameService}</Button>
        <Modal isActive={isActive}>
          <Modal.Background onClick={this.closeModal}></Modal.Background>
          <Modal.Card>
            <Modal.Card.Head>
              <Modal.Card.Title>{this.props.nameService} service</Modal.Card.Title>
              <Delete onClick={this.closeModal} />
            </Modal.Card.Head>
            <Modal.Card.Body>
              Are you sure to want this service ?
            </Modal.Card.Body>
            <Modal.Card.Foot>
              <Button onClick={this.closeModal}>Cancel</Button>
              <Button onClick={this.receiveHidenFinal} isSuccess>Save</Button>
            </Modal.Card.Foot>
          </Modal.Card>
        </Modal>
      </React.Fragment>
    );}
}

class SelectionWidget extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
  }
  closeModal () {
    this.setState({ isActive: false })
  }
  openModal () {
    this.setState({ isActive: true })
  }
  receiveHiden = (value) => {
    this.props.newHiden(value)
  }
  render () {
    const {
      isActive
    } = this.state
    return (
      <React.Fragment>
          <Button isFullwidth isWhite onClick={this.openModal}>Add service</Button>
        <Modal isActive={isActive}>
          <Modal.Background onClick={this.closeModal}></Modal.Background>
          <Modal.Card>
            <Modal.Card.Head>
              <Modal.Card.Title>Widgets</Modal.Card.Title>
              <Delete onClick={this.closeModal} />
            </Modal.Card.Head>
            <Modal.Card.Body>
              <Columns>
                <Column>
                  <SaveService newHidenFinal={this.receiveHiden} nameService="weather"/>
                </Column>
                <Column>
                  <SaveService newHidenFinal={this.receiveHiden} nameService="youtube"/>
                </Column>
                <Column>
                  <SaveService newHidenFinal={this.receiveHiden} nameService="clock"/>
                </Column>
                <Column>
                  <SaveService newHidenFinal={this.receiveHiden} nameService="cinema"/>
                </Column>
              </Columns>
            </Modal.Card.Body>
            <Modal.Card.Foot>
            </Modal.Card.Foot>
          </Modal.Card>
        </Modal>
      </React.Fragment>
    );}
}

export default class DasboardPage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        title: "Dasboard",
        hidenStateWaether: false,
        hidenStateYoutube: false,
        hidenStateWorldClock: false,
        hidenStateCinema: false,
        profilUser: false,
      };
      this.handleButton = this.handleButton.bind(this);
      this.handleDashboard = this.handleDashboard.bind(this);
  }
  handleButton() {
      this.setState({profilUser: true})
  }
  handleDashboard() {
    this.setState({profilUser: false})
  }
  receiveHiden = (value) => {
    if (value === 'weather')
      this.setState({hidenStateWaether: true})
    if (value === 'weatherClose')
      this.setState({hidenStateWaether: false})
    if (value === 'clock')
      this.setState({hidenStateWorldClock: true})
    if (value === 'clockClose')
      this.setState({hidenStateWorldClock: false})
    if (value === 'youtube')
      this.setState({hidenStateYoutube: true})
    if (value === 'youtubeClose')
      this.setState({hidenStateYoutube: false})
    if (value === 'cinema')
      this.setState({hidenStateCinema: true})
    if (value === 'cinemaClose')
      this.setState({hidenStateCinema: false})
    this.setState({profilUser: false});
  }
  render() {
    return (
      <div>
        <Columns>
          <Column is2>
            <Menu>
              <Menu.Label>General</Menu.Label>
              <Menu.List>
                <Li><A><Button isFullwidth isWhite onClick={this.handleButton}>User Profil</Button></A></Li>
                <Li><A><Button isFullwidth isWhite onClick={this.handleDashboard}>Dashboard</Button></A></Li>
                <Li><A><SelectionWidget newHiden={this.receiveHiden}/></A></Li>
                <Link to="/">
                  <Li><A>Logout</A></Li>
                </Link>
              </Menu.List>
            </Menu>
          </Column>
          {this.state.profilUser === false ?
            <Column>
              <Columns isMobile>
                <Column>
                  <h3>{this.state.title}</h3>
                </Column>
              </Columns>
              <Columns>
                {this.state.hidenStateWaether ?
                  <Column>
                    <Box>
                      <MainWeatherPage closeSrevice={this.receiveHiden}/>
                    </Box>
                  </Column>
                : ""}
              </Columns>
              <Columns>
                {this.state.hidenStateYoutube ?
                  <Column>
                    <Box>
                      <YoutubePage closeSrevice={this.receiveHiden}/> 
                    </Box>
                  </Column>
                : ""}
              </Columns>
              <Columns>
                {this.state.hidenStateWorldClock?
                  <Column>
                    <Box>
                      <MainWorldClockPage closeSrevice={this.receiveHiden}/> 
                    </Box>
                  </Column>
                : ""}
              </Columns>
              <Columns>
                {this.state.hidenStateCinema?
                  <Column>
                    <Box>
                      <MainCinemaPage closeSrevice={this.receiveHiden}/> 
                    </Box>
                  </Column>
                : ""}
              </Columns>
            </Column>
            : <ProfilPage/>};
        </Columns>
      </div>
    );}
}