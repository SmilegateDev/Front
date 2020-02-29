import React, { Component, Fragment } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: null,
      searchTarget: null,
      userList: null,
      userFollow: null,
      userPost: null,
      replyContents: {}
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
      const postArr = res.data.Post;
      const likeArr = res.data.isLiked;

      for (let i = 0; i < postArr.length; i++) {
        postArr[i]['isLiked'] = likeArr[postArr[i]._id];
      }

      this.setState({ userFollow: res.data.isFollowed });
      this.setState({ userPost: postArr }); 
    })
    .catch(err => {
      alert(err);
    });
  }

  handleClose = () => {
    this.setState({ userPost: null });
  }

  toggleFollow = () => {
    const data = {
      nickname: this.state.searchTarget
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    if (this.state.userFollow === 0) {
      axios.post("/follow/following", data, headers)
      .then(res => {
        if (res.data.code === 200) {
          return this.setState({ userFollow: 1 });
        } else {
          return alert(res.data.message);
        }
      })
      .catch(err => {
        alert(err);
      });
    } else {
      axios.post("/follow/unFollowing", data, headers)
      .then(res => {
        if (res.data.code === 200) {
          return this.setState({ userFollow: 0 });
        } else {
          return alert(res.data.message);
        }
      })
      .catch(err => {
        alert(err);
      });
    }
  }

  toggleLike = (e) => {
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

    axios.post("/post/clickLike", data, headers)
    .then(res => {
      if (res.data.code === 200) {
        let newPost = this.state.userPost.slice();

        if (res.data.message === "like") {
          newPost[index]['isLiked'] = 1;
          newPost[index]['likes_num']++;
        } else if (res.data.message === "unlike") {
          newPost[index]['isLiked'] = 0;
          newPost[index]['likes_num']--;
        }

        this.setState({userPost: newPost });
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
      replyContents: this.state.replyContents[e.currentTarget.dataset.id]
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
        if (this.state.userPost[index]['replyWriter']) {
          let newPost = this.state.userPost.slice();

          newPost[index]['replyWriter'].push(jwt.decode(localStorage.getItem("token")).nickname);
          newPost[index]['replyContents'].push(this.state.replyContents[id]);
          newPost[index]['reply_num']++;

          this.setState({userPost: newPost });
        } else {
          let newPost = this.state.userPost.slice();

          newPost[index]['reply_num']++;

          this.setState({userPost: newPost });
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
      let newPost = this.state.userPost.slice();

      const writerArr = Object.keys(res.data).map(function(key) {
        return [res.data[key].writer];
      });

      const contentsArr = Object.keys(res.data).map(function(key) {
        return [res.data[key].replyContents];
      });

      newPost[index]['replyWriter'] = writerArr;
      newPost[index]['replyContents'] = contentsArr;

      this.setState({userPost: newPost });
    })
    .catch(err => {
      alert("오류가 발생했습니다.");
    });
  }

  handleFoldReply = (e) => {
    let newPost = this.state.userPost.slice();

    newPost[e.currentTarget.dataset.index]['replyWriter'] = null;
    newPost[e.currentTarget.dataset.index]['replyContents'] = null;

    this.setState({userPost: newPost });
  }

  render() {
    return (
      <Fragment>
        <div id="search" className={this.props.activeItem === "search-on" ? "out" : ""}>
          <div className="head custom-head">사용자 검색</div>
          <article className="custom-article">
            <div className="mainarticle mt-5">
              <form method="POST" className="mb-5" onSubmit={e => { e.preventDefault(); }}>
                <input type="text" className="form-control custom-search-form" name="nickname" id="nickname" placeholder="닉네임 검색" onChange={this.handleChange} onKeyPress={ this.pressSearchEnter } />
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
              <div className="mt-2">
                { this.state.userFollow ? 
                  <button className="btn btn-danger user-profile-btn" onClick={this.toggleFollow}>팔로우 취소</button> : <button className="btn btn-primary user-profile-btn" onClick={this.toggleFollow}>팔로우</button>
                }
                <button className="btn btn-success user-profile-btn ml-3" onClick={this.handleClose}>창 닫기</button>
              </div>
              <hr className="post-hr mt-5" />
            </Fragment> :
            null
          }
          <article className="custom-article">
            <div className="mainarticle mt-2">
              {this.state.userPost ? this.state.userPost.map((post, index) => {
                return <div className="text-left mt-3">
                  <h2>{ post.title }</h2>
                  <div><img src="default.jpg" className="img-fluid my-4" alt="default"/></div>
                  <div className="mb-4">
                    {post.isLiked === 0 ?
                      <button className="btn btn-success user-profile-btn" onClick={this.toggleLike} data-id={post._id} data-index={index}>좋아요</button> :
                      <button className="btn btn-danger user-profile-btn" onClick={this.toggleLike} data-id={post._id} data-index={index}>좋아요 취소</button>
                    }
                  </div>
                  <div>{ post.likes_num }명이 좋아합니다.</div>
                  <div className="mt-2">{this.state.searchTarget}) { post.contents }</div>
                  { post.replyWriter ?
                    <Fragment>
                      <div className="mt-4 get-reply mb-3" onClick={this.handleFoldReply} data-index={index}>댓글 접기</div>
                        {post.replyWriter.map((writer, index) => {
                          return <div><span className="custom-user-list" onClick={this.handleUserPost}>{writer}</span>) {post.replyContents[index]}</div>
                        })}
                    </Fragment> :
                    <div className="mt-4 get-reply" data-id={post._id} onClick={this.handleGetReply} data-index={index}>댓글 { post.reply_num }개 모두 보기</div>
                  }
                  <div className="mt-3">
                    <form method="POST" onSubmit={e => { e.preventDefault(); }}>
                      <div className="form-group">
                        <div className="input-group">
                          <input type="text" className="form-control custom-reply-form" name="reply" id="reply" placeholder="댓글 달기..." data-id={post._id} onChange={this.handleReplyChange} />
                          <div className="input-group-append">
                            <span className="input-group-text custom-reply-btn"><i class="far fa-comment-dots" data-id={post._id} data-index={index} onClick={this.handleReply}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <hr className="post-hr my-4" />
              </div>
              }) : null}
            </div>
          </article>
        </div>
      </Fragment>
    );
  }
}

export default Search;