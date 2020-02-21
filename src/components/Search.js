import React, { Component } from 'react';
import axios from 'axios';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: null,
      userList: null
    }
  }

  handleChange = (e) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  handleSearch = (e) => {
    e.preventDefault();
    
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
      alert(res.data);
    })
    .catch(err => {
      alert(err);
    });
  }

  render() {
    return (
      <div id="search" className={this.props.activeItem == "search-on" ? "out" : ""}>
        <div className="head custom-head">사용자 검색</div>
        <article className="custom-article">
          <div className="mainarticle mt-5">
            <form method="POST" onSubmit={this.handleSearch}>
              <input type="text" className="form-control custom-form" name="nickname" id="nickname" placeholder="닉네임 검색" onChange={this.handleChange} />
              <button type="button" className="btn btn-success btn-block custom-search-btn" onClick={this.handleSearch}>검색</button>
            </form>
            <hr className="login-hr" />
          </div>
        </article>
      </div>
    );
  }
}

export default Search;