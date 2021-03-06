import React, { Component, Fragment } from 'react';

class MyPost extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const postDiv = document.getElementById("myPost");
    postDiv.addEventListener("wheel", this.handleScroll);
  }

  componentWillUnmount() {
    const postDiv = document.getElementById("myPost");
    postDiv.removeEventListener("wheel", this.handleScroll);
  }

  handleScroll = () => {
    const postDiv = document.getElementById("myPost");

    const { innerHeight } = window;
    const { scrollHeight } = postDiv;
    const { scrollTop } = postDiv;

    if ((scrollHeight - innerHeight - scrollTop < 300) && this.props.isLastMyPost !== 1) {
      this.props.getMoreMyPostData();
      postDiv.removeEventListener("wheel", this.handleScroll);
      setTimeout(() => {
        this.addScrollEvent();
      }, 1000);
    }
  }

  addScrollEvent = () => {
    const postDiv = document.getElementById("myPost");
    postDiv.addEventListener("wheel", this.handleScroll);
  }

  render() {
    return (
      <div id="myPost" className={this.props.activeItem === "myPost-on" ? "out" : ""}>
        <div className="head custom-head">내 게시물</div><hr className="post-hr" />
        <article className="custom-article">
          <div className="mainarticle">
            {this.props.postData ? this.props.postData.map((post, index) => {
                return <div className="text-left mt-3">
                  <h2>{ post.title }</h2>
                  <div>
                    {post.file ?
                      <img src={post.file} className="img-fluid my-4" alt="default"/> :
                      <img src="default.jpg" className="img-fluid my-4" alt="default"/>
                    }
                  </div>
                  <div className="mb-4">
                    {post.isLiked === 0 ?
                      <button className="btn btn-success user-profile-btn" onClick={this.props.toggleLike} data-id={post._id} data-index={index} data-user={post.userId}>좋아요</button> :
                      <button className="btn btn-danger user-profile-btn" onClick={this.props.toggleLike} data-id={post._id} data-index={index} data-user={post.userId}>좋아요 취소</button>
                    }
                  </div>
                  <div>{ post.likes_num }명이 좋아합니다.</div>
                  <div className="mt-2">{post.writer}) { post.contents }</div>
                  { post.replyWriter ?
                    <Fragment>
                      <div className="mt-4 get-reply mb-3" onClick={this.props.handleFoldReply} data-index={index}>댓글 접기</div>
                        {post.replyWriter.map((writer, index) => {
                          return <div><span className="custom-user-list" onClick={this.props.handleUserPost}>{writer}</span>) {post.replyContents[index]}</div>
                        })}
                    </Fragment> :
                    <div className="mt-4 get-reply" data-id={post._id} onClick={this.props.handleGetReply} data-index={index}>댓글 { post.reply_num }개 모두 보기</div>
                  }
                  <div className="mt-3">
                    <form method="POST" onSubmit={e => { e.preventDefault(); }}>
                      <div className="form-group">
                        <div className="input-group">
                          <input type="text" className="form-control custom-reply-form" name="reply" id="reply" placeholder="댓글 달기..." data-id={post._id} onChange={this.props.handleReplyChange} />
                          <div className="input-group-append">
                            <span className="input-group-text custom-reply-btn"><i class="far fa-comment-dots" data-id={post._id} data-user={post.userId} data-index={index} onClick={this.props.handleReply}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <hr className="post-hr my-4" />
              </div>
              }) : null}
              { this.props.isLastMyPost === 1 ?
                <div className="mb-5">마지막 글입니다.</div> :
                null
              }
          </div>
        </article>
      </div>
   );
  }
}

export default MyPost;