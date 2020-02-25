import React, { Component, Fragment } from 'react';
import Feed from './Feed';
import Login from './Login';
import Join from './Join';
import Post from './Post';
import MyPost from './MyPost';
import Notice from './Notice';
import Search from './Search';
import Sidebar from './Sidebar';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      activeItem: null,
      feedData: null,
      postData: null,
      noticeData: null,
      isLogin: false,
      location: null
    }
  }

  componentDidMount() {
    window.vw.ol3.MapOptions = {
      basemapType: window.vw.ol3.BasemapType.GRAPHIC,
      controlDensity: window.vw.ol3.DensityType.EMPTY,
      interactionDensity: window.vw.ol3.DensityType.BASIC,
      controlsAutoArrange: true,
      homePosition: window.vw.ol3.CameraPosition,
      initPosition: window.vw.ol3.CameraPosition
    };

    const vmap = new window.vw.ol3.Map("vmap",  window.vw.ol3.MapOptions);

    this.setState({map: vmap});

    if (localStorage.getItem("token") !== null) {
      this.setState({
        isLogin: true
      });
    }
  }

  setLoginState = (status) => {
    this.setState({
      isLogin: status
    });
  }

  setActiveItem = (item) => {
    this.setState({
      activeItem: item
    });
  }

  setAllDataNull = () => {
    this.setState({
      feedData: null,
      postData: null,
      noticeData: null
    });
  }
  
  handleItemClick = (e) => {
    const clicked = e.currentTarget.id;

    if (clicked === "feed-on" && this.state.activeItem !== clicked) {
      const headers = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        }
      };
  
      axios.get("/feed/getFeed", headers)
      .then(res => {
        this.setState({ feedData: res.data });
      })
      .catch(err => {
        alert(err);
      });
    } else if (clicked === "myPost-on" && this.state.activeItem !== clicked) {
      const headers = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        }
      };
  
      axios.get("/post/getMyPost", headers)
      .then(res => {
        this.setState({ postData: res.data });
      })
      .catch(err => {
        alert(err);
      });
    } else if (clicked === "notice-on" && this.state.activeItem !== clicked) {
      const headers = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        }
      };
  
      axios.get("noticeurl", headers)
      .then(res => {
        this.setState({ noticeData: res.data });
      })
      .catch(err => {
        alert(err);
      });
    } else if (clicked === "post-on" && this.state.activeItem !== clicked) {
      this.state.map.on('click', (evt) => {
        alert(window.markerLayer);
        this.setState({location: evt.coordinate});

        window.markerLayer = new window.vw.ol3.layer.Marker(this.state.map);
        this.state.map.addLayer(window.markerLayer);

        window.vw.ol3.markerOption = {
          x : evt.coordinate[0],
          y : evt.coordinate[1],
          epsg : "EPSG:900913",
          title : '리액트 마커 타이틀',
          contents : '리액트 마커 컨텐츠',
          iconUrl : 'http://map.vworld.kr/images/ol3/marker_blue.png', 
          text : {
            offsetX: 0.5,
            offsetY: 20,
            font: '12px Calibri,sans-serif',
            fill: {color: '#000'},
            stroke: {color: '#fff', width: 2},
            text: '리액트 마커 텍스트'
          },
          attr: { "id": "marker01", "name": "속성명1" }  
        };

        window.markerLayer.addMarker(window.vw.ol3.markerOption);
      });
    }

    if (this.state.activeItem === clicked) {
      this.setState({
        activeItem: null
      });
    } else {
      this.setState({
        activeItem: clicked
      });
    }
  }

  render() {
    return (
      <Fragment>
        <div id="vmap" />
        <Sidebar handleItemClick={this.handleItemClick} isLogin={this.state.isLogin} setLoginState={this.setLoginState} setActiveItem={this.setActiveItem} setAllDataNull={this.setAllDataNull}/>
        <Feed activeItem={this.state.activeItem} feedData={this.state.feedData} />
        <Login activeItem={this.state.activeItem} setLoginState={this.setLoginState} setActiveItem={this.setActiveItem}/>
        <Join activeItem={this.state.activeItem} setActiveItem={this.setActiveItem} />
        <Post activeItem={this.state.activeItem} />
        <MyPost activeItem={this.state.activeItem} postData={this.state.postData} />
        <Notice activeItem={this.state.activeItem} noticeData={this.state.noticeData} />
        <Search activeItem={this.state.activeItem} />
      </Fragment>
    );
  }
}

export default App;