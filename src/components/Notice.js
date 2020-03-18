import React, { Component, Fragment } from 'react';

class Notice extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="notice" className={this.props.activeItem === "notice-on" ? "out" : ""}>
        <div className="head custom-head">알림</div><hr className="notice-hr" />
        <article className="custom-article">
          <div className="mainarticle">
            {this.props.noticeData ? this.props.noticeData.map(notice => {
              return <Fragment>
                <div>
                  { notice.status === 'follow' ? 
                    <Fragment><span className="custom-user-list" onClick={this.props.handleUserPost}>{notice.send_user}</span><span>님이 회원님을 팔로우하기 시작했습니다.</span></Fragment> :
                    notice.status === 'reply' ?
                      <Fragment><span className="custom-user-list" onClick={this.props.handleUserPost}>{notice.send_user}</span><span>님이 회원님의 </span><span className="custom-user-list" onClick={this.handleMyPost} data-id={notice.post_id}>게시물</span><span>에 댓글을 남기셨습니다.</span></Fragment> :
                      <Fragment><span className="custom-user-list" onClick={this.props.handleUserPost}>{notice.send_user}</span><span>님이 회원님의 </span><span className="custom-user-list" onClick={this.handleMyPost} data-id={notice.post_id}>게시물</span><span>을 좋아합니다.</span></Fragment>
                  }
                </div>
                <button className="btn btn-danger font-size-90 mt-2" data-id={ notice.id } onClick={ this.props.handleRemoveNotice }>알림 삭제</button>
                <hr className="notice-hr" />
              </Fragment>
            }) : '데이터 불러오는 중'}
          </div>
        </article>
      </div>
   );
  }
}

export default Notice;