import React, { Component } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      followingList: null,
      followerList: null,
      followingMsg: "내가 팔로우 중인 사람들 보기",
      followerMsg: "나를 팔로우 중인 사람들 보기"
    }
  }

  clickFollowing = () => {
    if (this.state.followingList === null) {
      const headers = {
        headers: {
          'Authorization': localStorage.getItem("token")
        }
      };

      axios.get("/follow/showFollowing", headers)
      .then(res => {
        let followingList = [];

        for (let i = 0; i < res.data.length; i++) {
          followingList.push(res.data[i].nickname);
        }

        this.setState({ followingList: followingList, followingMsg: "접기" });
      })
      .catch(err => {
        alert(err);
      });
    } else {
      this.setState({ followingList: null, followingMsg: "내가 팔로우 중인 사람들 보기" });
    }
  }

  clickFollower = () => {
    if (this.state.followerList === null) {
      const headers = {
        headers: {
          'Authorization': localStorage.getItem("token")
        }
      };

      axios.get("/follow/showFollower", headers)
      .then(res => {
        let followerList = [];

        for (let i = 0; i < res.data.length; i++) {
          followerList.push(res.data[i].nickname);
        }

        this.setState({ followerList: followerList, followerMsg: "접기" });
      })
      .catch(err => {
        alert(err);
      });
    } else {
      this.setState({ followerList: null, followerMsg: "나를 팔로우 중인 사람들 보기" });
    }
  }

  render() {
    return (
      <div id="profile" className={this.props.activeItem === "profile-on" ? "out" : ""}>
        <div className="head custom-head">내 프로필</div><hr className="feed-hr" />
        <article className="custom-article">
          <div className="mainarticle">
            <h2 className="mt-4">닉네임:&nbsp;
              {localStorage.getItem("token") !== null ? 
                jwt.decode(localStorage.getItem("token")).nickname :
                null
              }
            </h2>
            <h3 className="custom-user-list mt-5" onClick={this.clickFollowing}>{this.state.followingMsg}</h3>
            { this.state.followingList !== null ? this.state.followingList.map((following) => {
              return <h3 className="mt-3 custom-user-list" onClick={this.props.handleUserPost}>{following}</h3>
            }) : null
            }
            <h3 className="custom-user-list mt-5" onClick={this.clickFollower}>{this.state.followerMsg}</h3>
            { this.state.followerList !== null ? this.state.followerList.map((follower) => {
              return <h3 className="mt-3 custom-user-list" onClick={this.props.handleUserPost}>{follower}</h3>
            }) : null
            }
          </div>
        </article>
      </div>
   );
  }
}

export default Profile;