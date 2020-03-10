import React, { Component, Fragment } from 'react';
import Feed from './Feed';
import Login from './Login';
import Join from './Join';
import Post from './Post';
import Profile from './Profile';
import MyPost from './MyPost';
import Notice from './Notice';
import Search from './Search';
import Sidebar from './Sidebar';
import axios from 'axios';
import jwt from 'jsonwebtoken';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: null,
      feedData: null,
      postData: null,
      noticeData: null,
      isLogin: false,
      location: null,
      replyContents: {},
      feedReplyContents: {},
      year: null,
      month: null,
      date: null,
      isLastFeed: null
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

    vmap.on('click', (evt) => {
      if (this.state.activeItem === "post-on") {
        this.setState({location: evt.coordinate});

        if (!window.markerLayer) {
          window.markerLayer = new window.vw.ol3.layer.Marker(vmap);
          vmap.addLayer(window.markerLayer);
        } else {
          window.markerLayer.removeAllMarker();
        }

        window.vw.ol3.markerOption = {
          x : evt.coordinate[0],
          y : evt.coordinate[1],
          epsg : "EPSG:900913",
          title : '여기에 글 남기기',
          iconUrl : 'http://map.vworld.kr/images/ol3/marker_blue.png'
        };

        window.markerLayer.addMarker(window.vw.ol3.markerOption);
        window.markerLayer.hidePop();
      } else {
        this.setState({ activeItem: null });
      }
    });

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

  setLocationNull = () => {
    this.setState({
      location: null
    });
  }
  
  handleItemClick = (e) => {
    const clicked = e.currentTarget.id;

    if (clicked === "feed-on" && this.state.activeItem !== clicked) {
      const data = {
        year: this.state.year,
        month: this.state.month,
        date: this.state.date,
        isLastFeed: this.state.isLastFeed
      }

      const headers = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        }
      };
  
      axios.post("/feed/getFeed", data, headers)
      .then(res => {
        const feedArr = res.data.Feed;
        const likeArr = res.data.isLiked;

        for (let i = 0; i < feedArr.length; i++) {
          feedArr[i]['isLiked'] = likeArr[feedArr[i]._id];
        }

        this.setState({
          year: res.data.Year,
          month: res.data.Month,
          date: res.data.Date,
          isLastFeed: res.data.isLastFeed
        });

        
        return this.setState({ feedData: feedArr });
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
        const postArr = res.data.Post;
        const likeArr = res.data.isLiked;

        for (let i = 0; i < postArr.length; i++) {
          postArr[i]['isLiked'] = likeArr[postArr[i]._id];
        }

        return this.setState({ postData: postArr }); 
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
  
      axios.get("noti/myNoti", headers)
      .then(res => {
        alert(res.data.success);
        alert(res.data.data);
      })
      .catch(err => {
        alert(err);
      });
    }

    if (clicked !== "feed-on") {
      this.setState({
        feedData: null,
        feedReplyContents: {},
        year: null,
        month: null,
        date: null,
        isLastFeed: null
      });
    } else if (clicked === "feed-on" && this.state.activeItem === clicked) {
      this.setState({
        feedData: null,
        feedReplyContents: {},
        year: null,
        month: null,
        date: null,
        isLastFeed: null
      });
    }

    if (window.markerLayer) {
      if (clicked !== "post-on") {
        this.setLocationNull();
        window.markerLayer.removeAllMarker();
      } else if (clicked === "post-on" && this.state.activeItem === clicked) {
        this.setLocationNull();
        window.markerLayer.removeAllMarker();
      }
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

  getMoreFeedData = (e) => {
    const data = {
      year: this.state.year,
      month: this.state.month,
      date: this.state.date,
      isLastFeed: this.state.isLastFeed
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    axios.post("/feed/getFeed", data, headers)
    .then(res => {
      let exFeedData = this.state.feedData;
      const feedArr = res.data.Feed;
      const likeArr = res.data.isLiked;

      for (let i = 0; i < feedArr.length; i++) {
        feedArr[i]['isLiked'] = likeArr[feedArr[i]._id];
        exFeedData.push(feedArr[i]);
      }

      this.setState({
        year: res.data.Year,
        month: res.data.Month,
        date: res.data.Date,
        isLastFeed: res.data.isLastFeed
      });

      return this.setState({ feedData: exFeedData });
    })
    .catch(err => {
      alert(err);
    });
  }

  toggleLike = (e) => {
    const data = {
      objectId: e.currentTarget.dataset.id,
      userId: e.currentTarget.dataset.user
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    const index = e.currentTarget.dataset.index;

    axios.post("/post/clickLike", data, headers)
    .then(res => {
      if (res.data.code === 200) {
        let newPost = this.state.postData.slice();

        if (res.data.message === "like") {
          newPost[index]['isLiked'] = 1;
          newPost[index]['likes_num']++;
        } else if (res.data.message === "unlike") {
          newPost[index]['isLiked'] = 0;
          newPost[index]['likes_num']--;
        }

        this.setState({ postData: newPost });
      } else {
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
    });
  }

  handleReplyChange = (e) => {
    let newReply = this.state.replyContents;

    newReply[e.currentTarget.dataset.id] = e.currentTarget.value;

    this.setState({replyContents: newReply});
  }

  handleReply = (e) => {
    if (this.state.replyContents[e.currentTarget.dataset.id] === undefined || this.state.replyContents[e.currentTarget.dataset.id].length === 0) {
      return alert("댓글을 입력해주세요");
    }

    const data = {
      objectId: e.currentTarget.dataset.id,
      replyContents: this.state.replyContents[e.currentTarget.dataset.id],
      userId: e.currentTarget.dataset.user
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;

    axios.post("/post/createReply", data, headers)
    .then(res => {
      if (res.data.code === 200) {
        if (this.state.postData[index]['replyWriter']) {
          let newPost = this.state.postData.slice();

          newPost[index]['replyWriter'].push(jwt.decode(localStorage.getItem("token")).nickname);
          newPost[index]['replyContents'].push(this.state.replyContents[id]);
          newPost[index]['reply_num']++;

          this.setState({ postData: newPost });
        } else {
          let newPost = this.state.postData.slice();

          newPost[index]['reply_num']++;

          this.setState({ postData: newPost });
        }
      } else {
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
    });
  }

  handleGetReply = (e) => {
    const data = {
      objectId: e.currentTarget.dataset.id
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    const index = e.currentTarget.dataset.index;

    axios.post("/post/getReply", data, headers)
    .then(res => {
      let newPost = this.state.postData.slice();

      const writerArr = Object.keys(res.data).map(function(key) {
        return [res.data[key].writer];
      });

      const contentsArr = Object.keys(res.data).map(function(key) {
        return [res.data[key].replyContents];
      });

      newPost[index]['replyWriter'] = writerArr;
      newPost[index]['replyContents'] = contentsArr;

      this.setState({ postData: newPost });
    })
    .catch(err => {
      alert("오류가 발생했습니다.");
    });
  }

  handleFoldReply = (e) => {
    let newPost = this.state.postData.slice();

    newPost[e.currentTarget.dataset.index]['replyWriter'] = null;
    newPost[e.currentTarget.dataset.index]['replyContents'] = null;

    this.setState({ postData: newPost });
  }

  feedToggleLike = (e) => {
    const data = {
      objectId: e.currentTarget.dataset.id,
      userId: e.currentTarget.dataset.user
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    const index = e.currentTarget.dataset.index;

    axios.post("/post/clickLike", data, headers)
    .then(res => {
      if (res.data.code === 200) {
        let newFeed = this.state.feedData.slice();

        if (res.data.message === "like") {
          newFeed[index]['isLiked'] = 1;
          newFeed[index]['likes_num']++;
        } else if (res.data.message === "unlike") {
          newFeed[index]['isLiked'] = 0;
          newFeed[index]['likes_num']--;
        }

        this.setState({ feedData: newFeed });
      } else {
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
    });
  }

  feedHandleReplyChange = (e) => {
    let newReply = this.state.feedReplyContents;

    newReply[e.currentTarget.dataset.id] = e.currentTarget.value;

    this.setState({feedReplyContents: newReply});
  }

  feedHandleReply = (e) => {
    if (this.state.feedReplyContents[e.currentTarget.dataset.id] === undefined || this.state.feedReplyContents[e.currentTarget.dataset.id].length === 0) {
      return alert("댓글을 입력해주세요");
    }

    const data = {
      objectId: e.currentTarget.dataset.id,
      replyContents: this.state.feedReplyContents[e.currentTarget.dataset.id],
      userId: e.currentTarget.dataset.user
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;

    axios.post("/post/createReply", data, headers)
    .then(res => {
      if (res.data.code === 200) {
        if (this.state.feedData[index]['replyWriter']) {
          let newFeed = this.state.feedData.slice();

          newFeed[index]['replyWriter'].push(jwt.decode(localStorage.getItem("token")).nickname);
          newFeed[index]['replyContents'].push(this.state.feedReplyContents[id]);
          newFeed[index]['reply_num']++;

          this.setState({ feedData: newFeed });
        } else {
          let newFeed = this.state.feedData.slice();

          newFeed[index]['reply_num']++;

          this.setState({ feedData: newFeed });
        }
      } else {
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
    });
  }

  feedHandleGetReply = (e) => {
    const data = {
      objectId: e.currentTarget.dataset.id
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    const index = e.currentTarget.dataset.index;

    axios.post("/post/getReply", data, headers)
    .then(res => {
      let newFeed = this.state.feedData.slice();

      const writerArr = Object.keys(res.data).map(function(key) {
        return [res.data[key].writer];
      });

      const contentsArr = Object.keys(res.data).map(function(key) {
        return [res.data[key].replyContents];
      });

      newFeed[index]['replyWriter'] = writerArr;
      newFeed[index]['replyContents'] = contentsArr;

      this.setState({ feedData: newFeed });
    })
    .catch(err => {
      alert("오류가 발생했습니다.");
    });
  }

  feedHandleFoldReply = (e) => {
    let newFeed = this.state.feedData.slice();

    newFeed[e.currentTarget.dataset.index]['replyWriter'] = null;
    newFeed[e.currentTarget.dataset.index]['replyContents'] = null;

    this.setState({ feedData: newFeed });
  }

  render() {
    return (
      <Fragment>
        <div id="vmap" />
        <Sidebar handleItemClick={this.handleItemClick} isLogin={this.state.isLogin} setLoginState={this.setLoginState} setActiveItem={this.setActiveItem} setAllDataNull={this.setAllDataNull}/>
        <Feed activeItem={this.state.activeItem} feedData={this.state.feedData} toggleLike={this.feedToggleLike} handleReplyChange={this.feedHandleReplyChange} handleReply={this.feedHandleReply} handleGetReply={this.feedHandleGetReply} handleFoldReply={this.feedHandleFoldReply} isLastFeed={this.state.isLastFeed} getMoreFeedData={this.getMoreFeedData} />
        <Login activeItem={this.state.activeItem} setLoginState={this.setLoginState} setActiveItem={this.setActiveItem}/>
        <Join activeItem={this.state.activeItem} setActiveItem={this.setActiveItem} />
        <Post activeItem={this.state.activeItem} location={this.state.location} setLocationNull={this.setLocationNull}/>
        <MyPost activeItem={this.state.activeItem} postData={this.state.postData} toggleLike={this.toggleLike} handleReplyChange={this.handleReplyChange} handleReply={this.handleReply} handleGetReply={this.handleGetReply} handleFoldReply={this.handleFoldReply} />
        <Notice activeItem={this.state.activeItem} noticeData={this.state.noticeData} />
        <Search activeItem={this.state.activeItem} />
        <Profile activeItem={this.state.activeItem} />
      </Fragment>
    );
  }
}

export default App;