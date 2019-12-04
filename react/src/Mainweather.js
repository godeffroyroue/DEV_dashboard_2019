import React from 'react';
import {Column} from 'trunx'
import {Button} from 'trunx'
import {Icon} from 'trunx'
import solidIcon from 'fa-svg-icon/solid'
import {Columns} from 'trunx'
import {Delete} from 'trunx'
import {Modal} from 'trunx'

import WeatherPage from './weather.js'
import WeatherUVPage from './weatherUV.js'

class WeatherParamWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: false,
      option1: false,
      option2: false
    } 
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
  }
  handleOptionChange=(event)=> {
    this.setState({
      [event.target.name]:event.target.checked
    });
  };
  closeModal () {
    this.setState({ isActive: false })
  }
  openModal () {
    this.setState({ isActive: true })
  }
  sendValueTimer = () => {
    this.props.chooseParam(this.state);
    this.closeModal()
  }
  render () {
    const {
      isActive
    } = this.state
    return (
      <React.Fragment>
        <div style={{float: 'right'}}>
          <Button isDark isSmall onClick={this.openModal}>
            <Icon>
              <Icon.Svg icon={solidIcon.cog} size='3em'/>
            </Icon>
          </Button>
        </div>
        <Modal isActive={isActive}>
          <Modal.Background onClick={this.closeModal}></Modal.Background>
          <Modal.Card>
            <Modal.Card.Head>
              <Modal.Card.Title>Global weather service sitting</Modal.Card.Title>
              <Delete onClick={this.closeModal} />
            </Modal.Card.Head>
            <Modal.Card.Body>
              Widgets :
              <form>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" name="option1" checked={this.state.option1} onChange={this.handleOptionChange} />
                    Weather
                  </label>
                </div>
                <div className="checkbox">
                  <label>
                    <input type="checkbox" name="option2" checked={this.state.option2} onChange={this.handleOptionChange} />
                    Weather UV
                  </label>
                </div>
              </form>
            </Modal.Card.Body>
            <Modal.Card.Foot>
              <Button onClick={this.closeModal}>Cancel</Button>
              <Button onClick={this.sendValueTimer} isSuccess>Save</Button>
            </Modal.Card.Foot>
          </Modal.Card>
        </Modal>
      </React.Fragment>
    );}
}

class WeatherClose extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false,
      inconClose: 'window-close'
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
  receiveHiden = () => {
    this.props.closeSrevice(this.props.nameService)
    this.closeModal()
  }
  render () {
    const {
      isActive
    } = this.state
    return (
      <React.Fragment>
        <div style={{float: 'right'}}>
          <Button isDanger isSmall onClick={this.openModal}>
            <Icon>
            <Icon.Svg icon={solidIcon.times} size='3em'/>
            </Icon>
          </Button>
        </div>
        <Modal isActive={isActive}>
          <Modal.Background onClick={this.closeModal}></Modal.Background>
          <Modal.Card>
            <Modal.Card.Head>
              <Modal.Card.Title>Global weather</Modal.Card.Title>
              <Delete onClick={this.closeModal} />
            </Modal.Card.Head>
            <Modal.Card.Body>
              Are you sure to close this service ?
            </Modal.Card.Body>
            <Modal.Card.Foot>
              <Button onClick={this.closeModal}>Cancel</Button>
              <Button onClick={this.receiveHiden} isSuccess>Ok</Button>
            </Modal.Card.Foot>
          </Modal.Card>
        </Modal>
      </React.Fragment>
    );}
}

export default class MainWeatherPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      valueWidgetWeather: [],
      valueWidgetUV: [],
      nbWeatherWidget: -1,
      nbWeatherUV: -1
    }
  }
  receiveValue = (value) => {
    if (value.option1 === true) {
      this.setState({nbWeatherWidget: this.state.nbWeatherWidget + 1}, () => {this.handleAddTodoItem(this.state.valueWidgetWeather, this.state.nbWeatherWidget)})
    }
    if (value.option2 === true) {
      this.setState({nbWeatherUV: this.state.nbWeatherUV + 1}, () => {this.handleAddTodoItem(this.state.valueWidgetUV, this.state.nbWeatherUV)})
    }
  }
  receiveHiden = (value) => {
    this.props.closeSrevice(value)
  }
  handleAddTodoItem(container, value) {
    container.push(value)
    this.setState(
      this.state
    )
    console.log(this.state.value)
  }
  handledelTodoItem(v, value){
    for(var i = 0; i < value.length; i++){
      if(i === v){
         delete value[i]
      }
    }
    this.setState({value: value})
    console.log(value)
  }
  render(){
    return (
      <Columns>
          <Column>
            <Columns>
              <Column>
                <WeatherClose closeSrevice={this.receiveHiden} nameService='weatherClose'/>
                <WeatherParamWidget chooseParam={this.receiveValue}/>
                <h3>Global Weather</h3>
              </Column>
            </Columns>
            <Columns>
              {this.state.valueWidgetWeather.map((v) => {
                return <WeatherPage id={v} nb={this.state.valueWidgetWeather} closeWidget={this.handledelTodoItem.bind(this, v, this.state.valueWidgetWeather)}/>
              })}
              {this.state.valueWidgetUV.map((v) => {
                return <WeatherUVPage id={v} nb={this.state.valueWidgetUV} closeWidget={this.handledelTodoItem.bind(this, v, this.state.valueWidgetUV)}/>
              })}
            </Columns>
          </Column>
      </Columns>
    );}
}