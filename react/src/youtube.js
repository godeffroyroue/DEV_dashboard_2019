import React from 'react';
import { Columns, Column } from 'trunx';
import {Button} from 'trunx'
import {Icon} from 'trunx'
import solidIcon from 'fa-svg-icon/solid'
import {Delete} from 'trunx'
import {Modal} from 'trunx'

import Videos from './youtubeVideo.js'
import Channel from './youtubeChannel.js'

class YoutubeParam extends React.Component {
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
                <Modal.Card.Title>Youtube service sitting</Modal.Card.Title>
                <Delete onClick={this.closeModal} />
              </Modal.Card.Head>
              <Modal.Card.Body>
                Widgets :
                <form>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" name="option1" checked={this.state.option1} onChange={this.handleOptionChange} />
                      Search Videos
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" name="option2" checked={this.state.option2} onChange={this.handleOptionChange} />
                      Search Channels
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

class YoutubeClose extends React.Component {
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
              <Modal.Card.Title>Youtube</Modal.Card.Title>
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

export default class Youtube extends React.Component {
    state = {
        valueWidgetVideo: [],
        valueWidgetChannel: [],
        nbWidgetVideo: -1,
        nbWidgetChannel: -1
    }
    receiveValue = (value) => {
      if (value.option1 === true) {
        this.setState({nbWidgetVideo: this.state.nbWidgetVideo + 1}, () => {this.handleAddTodoItem(this.state.valueWidgetVideo, this.state.nbWidgetVideo)})
      }
      if (value.option2 === true) {
        this.setState({nbWidgetChannel: this.state.nbWidgetChannel + 1}, () => {this.handleAddTodoItem(this.state.valueWidgetChannel, this.state.nbWidgetChannel)})
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
    render() {
        return (
            <Columns>
                <Column>
                  <Columns>
                    <Column>
                      <YoutubeClose closeSrevice={this.receiveHiden} nameService='youtubeClose'/>
                      <YoutubeParam chooseParam={this.receiveValue}/>
                      <h3>Youtube</h3>
                    </Column>
                  </Columns>
                  <Columns>
                  {this.state.valueWidgetChannel.map((v) => {
                      return <Channel id={v} nb={this.state.valueWidgetChannel} closeWidget={this.handledelTodoItem.bind(this, v, this.state.valueWidgetChannel)}/>
                    })}
                    {this.state.valueWidgetVideo.map((v) => {
                      return <Videos id={v} nb={this.state.valueWidgetVideo} closeWidget={this.handledelTodoItem.bind(this, v, this.state.valueWidgetVideo)}/>
                    })}
                  </Columns>
                </Column>
            </Columns>
        )
    }
}