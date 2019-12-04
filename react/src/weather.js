import React from 'react';
import {Column} from 'trunx'
import {Label} from 'trunx'
import {Input} from 'trunx'
import {Button} from 'trunx'
import {Icon} from 'trunx'
import solidIcon from 'fa-svg-icon/solid'
import {Columns} from 'trunx'
import {Delete} from 'trunx'
import {Modal} from 'trunx'
import {Box} from 'trunx'
import axios from 'axios'
import Draggable from 'react-draggable';


class WeatherParam extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: false,
      option: 'option1',
      city: ''
    } 
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    this.setState({city: event.target.value});
  }
  handleOptionChange=(event)=> {
    this.setState({
      option: event.target.value
    });
  };
  closeModal () {
    this.setState({ isActive: false })
  }
  openModal () {
    this.setState({ isActive: true })
  }
  sendValueTimer = () => {
    this.props.newTimer(this.state)
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
              <Modal.Card.Title>Weather widget settings</Modal.Card.Title>
              <Delete onClick={this.closeModal} />
            </Modal.Card.Head>
            <Modal.Card.Body>
              Time of reffresh :
              <form onSubmit={e => { e.preventDefault(); }}>
                <div className="radio">
                  <label>
                    <input type="radio" value='option1' checked={this.state.option === 'option1'} onChange={this.handleOptionChange} />
                    10sec
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value='option2' checked={this.state.option === 'option2'} onChange={this.handleOptionChange} />
                    1min
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value='option3' checked={this.state.option === 'option3'} onChange={this.handleOptionChange} />
                    10min
                  </label>
                </div>
                <Input isRounded placeholder="Nom de la ville" name="city" type="text" value={this.state.city} onChange={this.handleChange}/>
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

export default class WeatherPage extends React.Component {
  constructor(props){
      super(props)
      this.state = {
        activeDrags: 0,
        lunchTimer: false,
        verifTimer: false,
        timer: 10,
        city: "",
        message: "...",
        temp: "...",
        desc: "...",
        icon: "..."
      };
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(event) {
    this.setState({[event.target.name]:event.target.value});
  }
  async handleSubmit() {
    console.log('sent')
    console.log('timer :' + this.state.timer)
    await axios({
      method: 'post',
      url: 'http://localhost:7070/api/weather',
      data: JSON.stringify({
        city: this.state.city
      }),
      headers: {
        'Content-Type' : 'application/json',
      }
    }).then((response) => {
      if(response.data === 'error')
        this.setState({temp: 'Undefined'})
      else {
        this.setState({lunchTimer: true})
        this.setState({temp: response.data.main.temp})
        this.setState({desc: response.data.weather[0].description})
        this.setState({icon: ("<img width=100px src='http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png'>")})
      }
    });
  }
  onStart = () => {
    this.setState({activeDrags: this.state.activeDrags + 1});
  };
  onStop = () => {
    this.setState({activeDrags: this.state.activeDrags - 1});
  };
  componentDidMount() {
    this.interval = setInterval( async () => {
      console.log('timer 2 :' + this.state.timer)
      if (this.state.lunchTimer === true) {
        await axios({
          method: 'post',
          url: 'http://localhost:7070/api/weather',
          data: JSON.stringify({
            city: this.state.city
          }),
          headers: {
            'Content-Type' : 'application/json',
          }
        }).then((response) => {
          if(response.data === 'error')
            this.setState({temp: 'Undefined'})
          else {
            this.setState({temp: response.data.main.temp})
            this.setState({desc: response.data.weather[0].description})
            this.setState({icon: ("<img width=100px src='http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png'>")})
          }
        });
      }
      if (this.state.verifTimer === true ) {
        this.clearTimer()
      }
    }, (this.state.timer * 1000));
  }
  clearTimer() {
    this.setState({verifTimer: false})
    this.componentWillUnmount()
    this.componentDidMount()
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = undefined;
  }
  receiveValue = (value) => {
    if (value.option === 'option1')
      this.setState({timer: 10})
    if (value.option === 'option2')
      this.setState({timer: 60})
    if (value.option === 'option3')
      this.setState({timer: 600})
    this.setState({verifTimer: true})
    this.setState({city: value.city}, () => {this.handleSubmit()})
}
closeWidget = () => {
    this.props.closeWidget(this.props.id, this.props.nb)
  }
  render(){
      const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
      return (
        <Column>
          <Draggable handle="strong" {...dragHandlers}>
            <Box>
                <strong className="cursor">
                  <div>
                    <div style={{float: 'right'}}>
                        <Button isDanger isSmall onClick={this.closeWidget}>
                            <Icon>
                                <Icon.Svg icon={solidIcon.times} size='3em'/>
                            </Icon>
                        </Button>
                    </div>
                    <WeatherParam newTimer={this.receiveValue}/>
                    <h3>Weather</h3>
                  </div>
                </strong>
                <div>
                  <Button isLink onClick={this.handleSubmit}>
                    <Icon isSmall>
                      <Icon.Svg icon={solidIcon.redoAlt} size='3em'/>
                    </Icon>
                  </Button>
                  <form onSubmit={this.handleSubmit}>
                    <Columns>
                      <Column>
                        <Columns>
                          <Column>
                            <Label>
                              {this.state.city}
                            </Label>
                          </Column>
                        </Columns>
                        <div dangerouslySetInnerHTML={{__html: this.state.icon}}></div>
                        <h3>
                          {this.state.desc}
                        </h3>
                        <h3>
                          {this.state.temp}°C
                        </h3>
                      </Column>
                    </Columns>
                  </form>
                </div>
            </Box>
          </Draggable>
        </Column>
    );}
}