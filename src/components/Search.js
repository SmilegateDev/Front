import React, { Component, Fragment } from 'react';
import axios from 'axios';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: null,
      searchTarget: null,
      userList: null,
      userPost: null
    }
  }

  handleChange = (e) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  pressEnter = (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  }

  handleSearch = (e) => {
    const data = {
      nickname: this.state.nickname
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    axios.post("/follow/search", data, headers)
    .then(res => {
      this.setState({ userList: res.data });
    })
    .catch(err => {
      alert(err);
    });
  }

  handleUserPost = (e) => {
    this.setState({ searchTarget: e.currentTarget.innerHTML });

    const data = {
      nickname: e.currentTarget.innerHTML
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    axios.post("/post/getUserPost", data, headers)
    .then(res => {
      this.setState({ userPost: res.data });
    })
    .catch(err => {
      alert(err);
    });
  }

  handleClose = () => {
    this.setState({ userPost: null });
  }

  render() {
    return (
      <Fragment>
        <div id="search" className={this.props.activeItem == "search-on" ? "out" : ""}>
          <div className="head custom-head">사용자 검색</div>
          <article className="custom-article">
            <div className="mainarticle mt-5">
              <form method="POST" className="mb-5" onSubmit={e => { e.preventDefault(); }}>
                <input type="text" className="form-control custom-form" name="nickname" id="nickname" placeholder="닉네임 검색" onChange={this.handleChange} onKeyPress={ this.pressEnter } />
                <button type="button" className="btn btn-success btn-block custom-search-btn" onClick={this.handleSearch}>검색</button>
              </form>
              {this.state.userList ? this.state.userList.map(user => {
                return <h3 className="text-center mt-3 custom-user-list" onClick={this.handleUserPost}>{ user.nickname }</h3>
              }) : null}
            </div>
          </article>
        </div>
        <div id="user-post" className={this.state.userPost ? "right-out" : ""}>
          { this.state.userPost ?
            <Fragment>
              <div className="head custom-head">{this.state.searchTarget}</div>
              <div className="mt-2"><button className="btn btn-primary user-profile-btn">팔로우</button><button className="btn btn-danger user-profile-btn ml-3" onClick={this.handleClose}>창 닫기</button></div><hr className="post-hr mt-5" />
            </Fragment> :
            null
          }
          <article className="custom-article">
            <div className="mainarticle mt-2">
              {this.state.userPost ? this.state.userPost.map(post => {
                return <div className="text-left mt-3"><h2>{ post.title }</h2><div><img src="default.jpg" className="img-fluid my-4"/></div><div>{ post.contents }</div><hr className="post-hr my-4" /></div>
              }) : null}
            </div>
          </article>
        </div>
      </Fragment>
    );
  }
}

export default Search;