import React, { Component } from 'react';
import axios from 'axios';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      content: null
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });
  }

  handlePost = () => {
    const data = {
      title: this.state.title,
      content: this.state.content
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    axios.post("/post/create", data, headers)
    .then(res => {
      alert("성공적으로 등록되었습니다.");
    })
    .catch(err => {
      alert(err);
    });
  }

  render() {
    return (
      <div id="post" className={this.props.activeItem === "post-on" ? "out" : ""}>
        <div className="head custom-head">글 작성하기</div>
        <article className="custom-article">
          <div className="mainarticle">
            <form method="POST" onSubmit={e => { e.preventDefault(); }}>
              <input type="text" className="form-control custom-form mt-4" name="title" id="title" placeholder="제목" onChange={ this.handleChange } />
              <hr className="post-hr my-4" />
              <textarea className="form-control custom-form mt-3" name="content" id="content" placeholder="글 내용" onChange={ this.handleChange } rows="10"></textarea>
              <button type="button" className="btn btn-success btn-block custom-login-btn" onClick={ this.handlePost }>글 작성</button>
            </form>
          </div>
        </article>
      </div>
    );
  }
}

export default Post;