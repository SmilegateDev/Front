import React, { Component } from 'react';

class Feed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="myPost" className={this.props.activeItem == "myPost-on" ? "out" : ""}>
        <div className="head custom-head">내 게시물</div><hr className="post-hr" />
        <article className="custom-article">
          <div className="mainarticle">
            {this.props.postData ? this.props.postData.map(post => {
              return <div className="text-left mt-3"><h2>{ post.title }</h2><div><img src="default.jpg" className="img-fluid my-4"/></div><div>{ post.contents }</div><hr className="post-hr my-4" /></div>
            }) : '데이터 불러오는 중'}
          </div>
        </article>
      </div>
   );
  }
}

export default Feed;