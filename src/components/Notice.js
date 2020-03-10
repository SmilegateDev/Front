import React, { Component } from 'react';

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
              return <div>{ notice.contents }<hr className="notice-hr" /></div>
            }) : '데이터 불러오는 중'}
          </div>
        </article>
      </div>
   );
  }
}

export default Notice;