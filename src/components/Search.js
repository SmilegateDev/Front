import React, { Component, Fragment } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userList: null
    }
  }

  handleChange = (e) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  pressSearchEnter = (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  }

  handleSearch = () => {
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

  render() {
    return (
      <div id="search" className={this.props.activeItem === "search-on" ? "out" : ""}>
        <div className="head custom-head">사용자 검색</div>
        <article className="custom-article">
          <div className="mainarticle mt-5">
            <form method="POST" className="mb-5" onSubmit={e => { e.preventDefault(); }}>
              <input type="text" className="form-control custom-search-form" name="nickname" id="nickname" placeholder="닉네임 검색" onChange={this.handleChange} onKeyPress={ this.pressSearchEnter } />
              <button type="button" className="btn btn-success btn-block custom-search-btn" onClick={this.handleSearch}>검색</button>
            </form>
            {this.state.userList ? this.state.userList.map(user => {
              return <h3 className="text-center mt-3 custom-user-list" onClick={this.props.handleUserPost}>{ user.nickname }</h3>
            }) : null}
          </div>
        </article>
      </div>
    );
  }
}

export default Search;