import React, { Component, Fragment } from 'react';
import axios from "axios";
import jwt from "jsonwebtoken";

class Feed extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const feedDiv = document.getElementById("feed");
    feedDiv.addEventListener("wheel", this.handleScroll);
  }

  componentWillUnmount() {
    const feedDiv = document.getElementById("feed");
    feedDiv.removeEventListener("wheel", this.handleScroll);
  }

  handleScroll = () => {
    const feedDiv = document.getElementById("feed");

    const { innerHeight } = window;
    const { scrollHeight } = feedDiv;
    const { scrollTop } = feedDiv;

    if ((scrollHeight - innerHeight - scrollTop < 300) && this.props.isLastFeed !== 1) {
      this.props.getMoreFeedData();
      feedDiv.removeEventListener("wheel", this.handleScroll);
      setTimeout(() => {
        this.addScrollEvent();
      }, 1000);
    }
  };

  addScrollEvent = () => {
    const feedDiv = document.getElementById("feed");
    feedDiv.addEventListener("wheel", this.handleScroll);
  }

  render() {
    return (
      <div id="feed" className={this.props.activeItem === "feed-on" ? "out" : ""}>
        <div className="head custom-head">피드</div><hr className="feed-hr" />
        <article className="custom-article">
          <div className="mainarticle">
            {this.props.feedData ? this.props.feedData.map((feed, index) => {
              return <div className="text-left mt-3">
                <h2>{ feed.title }</h2>
                <div>
                  {feed.file ?
                    <img src={feed.file} className="img-fluid my-4" alt="default"/> :
                    <img src="default.jpg" className="img-fluid my-4" alt="default"/>
                  }
                </div>
                <div className="mb-4">
                  {feed.isLiked === 0 ?
                    <button className="btn btn-success user-profile-btn" onClick={this.props.toggleLike} data-id={feed._id} data-index={index} data-user={feed.userId}>좋아요</button> :
                    <button className="btn btn-danger user-profile-btn" onClick={this.props.toggleLike} data-id={feed._id} data-index={index} data-user={feed.userId}>좋아요 취소</button>
                  }
                </div>
                <div>{ feed.likes_num }명이 좋아합니다.</div>
                <div className="mt-2"><span className="custom-user-list" onClick={this.props.handleUserPost}>{feed.writer}</span>) { feed.contents }</div>
                { feed.replyWriter ?
                  <Fragment>
                    <div className="mt-4 get-reply mb-3" onClick={this.props.handleFoldReply} data-index={index}>댓글 접기</div>
                      {feed.replyWriter.map((writer, index) => {
                        return <div><span className="custom-user-list" onClick={this.props.handleUserPost}>{writer}</span>) {feed.replyContents[index]}</div>
                      })}
                  </Fragment> :
                  <div className="mt-4 get-reply" data-id={feed._id} onClick={this.props.handleGetReply} data-index={index}>댓글 { feed.reply_num }개 모두 보기</div>
                }
                <div className="mt-3">
                  <form method="POST" onSubmit={e => { e.preventDefault(); }}>
                    <div className="form-group">
                      <div className="input-group">
                        <input type="text" className="form-control custom-reply-form" name="reply" id="reply" placeholder="댓글 달기..." data-id={feed._id} onChange={this.props.handleReplyChange} />
                        <div className="input-group-append">
                          <span className="input-group-text custom-reply-btn"><i class="far fa-comment-dots" data-id={feed._id} data-index={index} data-user={feed.userId} onClick={this.props.handleReply}></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <hr className="feed-hr my-4" />
            </div>
            }) : null}
            { this.props.isLastFeed === 1 ?
              <div className="mb-5">마지막 글입니다.</div> :
              null
            }
          </div>
        </article>
      </div>
    );
  }
}

export default Feed;