import React from 'react';
import './Video.css';
import axios from 'axios';
import { Columns, Column } from 'trunx';
import { Input } from 'trunx';
import {Label} from 'trunx';
import {Button} from 'trunx'
import {Icon} from 'trunx'
import solidIcon from 'fa-svg-icon/solid'
import {Delete} from 'trunx'
import {Modal} from 'trunx'
import {Box} from 'trunx'
import {Tag} from 'trunx'
import Draggable from 'react-draggable';

class ChannelDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedChannel: '',
      videoSrc: '',
      videoId: '',
      videoTitle: ''
    }
  }
  handleButton = async () => {
    await axios({
      method: 'post',
      url: 'http://localhost:7070/api/youtube/lastVideo',
      data:{
        termFromSearchBar: this.props.channel.snippet.channelId
      },
    }).then((response) => {
      this.setState({selectedChannel: response.data.items[0]})
      this.setState({videoId: this.state.selectedChannel.snippet.resourceId.videoId})
      this.setState({videoTitle: this.state.selectedChannel.snippet.title})
      this.setState({videoSrc: 'https://www.youtube.com/embed/' + this.state.selectedChannel.snippet.resourceId.videoId})
    }).catch(err => { console.log(err) });
  };
  render () {
    if (!this.props.channel) {
      return <Columns></Columns>;
    }
    if (this.props.refreshSubsciber === true) {
      this.handleButton()
      this.props.handleRefreshSubscriber(false)
    }
    return (
      <Columns>
        <Column>
          <div>
            <Tag isMedium isPrimary>Last video upload on this Channel</Tag>
            <Label><Tag isInfo>Name</Tag> {this.props.channel.snippet.title}</Label>
              <div className='ui embed'>
                  <iframe src={this.state.videoSrc} allowFullScreen title='Video player'/>
              </div>
              <div className='ui segment'>
                  <h4 className='ui header'>{this.state.videoTitle}</h4>
              </div>
          </div>
        </Column>
      </Columns>
    )
  }
}

const VideoItem = ({video , handleVideoSelect}) => {
    return (
        <Columns>
            <div onClick={ () => handleVideoSelect(video)} className=' video-item item'>
                <img className='ui image' src={video.snippet.thumbnails.medium.url} alt={video.snippet.description}/>
                <div className='content'>
                    <div className='header '>{video.snippet.title}</div>
                </div>
            </div>
        </Columns>
    )
};

const VideoList = ({videos , handleVideoSelect}) => {
    const renderedVideos =  videos.map((video) => {
        return <VideoItem key={video.id.videoId} video={video} handleVideoSelect={handleVideoSelect} />
    });
    return <div className='ui relaxed divided list'>{renderedVideos}</div>;
};

class SearchBar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            term: ''
        };
    }
    handleChange = (event) => {
        this.setState({
            term: event.target.value
        });
    };
    handleSubmit = event => {
        event.preventDefault();
        this.props.handleFormSubmit([this.state.term, this.props.item]);
    }
    render() {
        return (
            <Columns>
                <Column>
                    <form onSubmit={this.handleSubmit}>
                    <Columns>
                        <Column isOneThird>
                            <Label htmlFor="video-search">{this.props.item} Search :</Label>
                        </Column>
                        <Column>
                            <Input isRounded onChange={this.handleChange} name='video-search' type="text" value={this.state.term}/>
                        </Column>
                    </Columns>
                    </form>
                </Column>
            </Columns>
        )
    }
}

class WidgetParam extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        isActive: false,
        option: 'option1',
        video: '',
        refreshSubsciber: false,
        videosChannel: [],
        selectedChannel: null,
      } 
      this.closeModal = this.closeModal.bind(this)
      this.openModal = this.openModal.bind(this)
      this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
      this.setState({video: event.target.value});
    }
    handleOptionChange=(event)=> {
      this.setState({
        option: event.target.value
      });
    };
    handleSubmit = async (item) => {
        await axios({
            method: 'post',
            url: 'http://localhost:7070/api/youtube',
            data:{
                termFromSearchBar: item[0],
                itemParam : item[1]
            },
        }).then((response) => {
              this.setState({videosChannel: response.data.items})
        }).catch(err => { console.log(err) });
    };
    handleChannelSelect = (video) => {
        this.setState({selectedChannel: video})
        this.handleRefreshSubscriber(true)
    }
    handleRefreshSubscriber = (value) => {
        this.setState({refreshSubsciber: value})
    }
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
                    <SearchBar handleFormSubmit={this.handleSubmit} item='channel'/>
                    <VideoList handleVideoSelect={this.handleChannelSelect} videos={this.state.videosChannel}/> 
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

export default class Channel extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            activeDrags: 0,
            lunchTimer: false,
            verifTimer: false,
            timer: 10,
            channel: "",
            stateChannel: false,
            refreshSubsciber: false,
            videosChannel: [],
            selectedChannel: null,
        };
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({[event.target.name]:event.target.value});
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
                this.handleRefreshSubscriber(true)
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
    handleRefreshSubscriber = (value) => {
        this.setState({refreshSubsciber: value})
    }
    receiveValue = (value) => {
        if (value.option === 'option1')
          this.setState({timer: 10})
        if (value.option === 'option2')
          this.setState({timer: 60})
        if (value.option === 'option3')
          this.setState({timer: 600})
        this.setState({verifTimer: true})
        this.setState({selectedChannel: value.selectedChannel})
        this.handleRefreshSubscriber(true)
    }
    closeWidget = () => {
        this.props.closeWidget(this.props.id, this.props.nb)
    }
    render(){
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        return (
        <Column>
            <Draggable handle="strong" {...dragHandlers}>
                <Box style={{height: '300px', position: 'relative', overflow: 'auto', padding: '0'}}>
                    <strong className="cursor">
                        <div>
                            <div style={{float: 'right'}}>
                            <Button isDanger isSmall onClick={this.closeWidget}>
                                <Icon>
                                    <Icon.Svg icon={solidIcon.times} size='3em'/>
                                </Icon>
                            </Button>
                            </div>
                            <WidgetParam newTimer={this.receiveValue}/>
                            <h3>Video</h3>
                        </div>
                    </strong>
                    <div>
                        {/* <Button isLink onClick={this.handleRefreshSubscriber(true)}>
                            <Icon isSmall>
                                <Icon.Svg icon={solidIcon.redoAlt} size='3em'/>
                            </Icon>
                        </Button> */}
                        <ChannelDetail refreshSubsciber={this.state.refreshSubsciber} handleRefreshSubscriber={this.handleRefreshSubscriber} channel={this.state.selectedChannel}/>
                    </div>
                </Box>
            </Draggable>
        </Column>
    );}
}