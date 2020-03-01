import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="profile" className={this.props.activeItem === "profile-on" ? "out" : ""}>
        <div className="head custom-head">내 프로필</div><hr className="feed-hr" />
        <article className="custom-article">
          <div className="mainarticle">
            <h2 className="mt-4">닉네임: {jwt.decode(localStorage.getItem("token")).nickname}</h2>
            <h3>내가 팔로우 중인 사람들 보기</h3>
            <h3>나를 팔로우 중인 사람들 보기</h3>
          </div>
        </article>
      </div>
   );
  }
}

export default Profile;