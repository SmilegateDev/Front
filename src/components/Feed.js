import React, { Component } from 'react';

class Feed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="feed" className={this.props.activeItem === "feed-on" ? "out" : ""}>
        <div className="head custom-head">피드</div><hr className="feed-hr" />
        <article className="custom-article">
          <div className="mainarticle">
            {this.props.feedData ? this.props.feedData.map(feed => {
              return <div className="text-left mt-3"><h2>{ feed.title }</h2><div><img src="default.jpg" className="img-fluid my-4" alt="default"/></div><div>{ feed.contents }</div><hr className="feed-hr my-4" /></div>
            }) : '데이터 불러오는 중'}
          </div>
        </article>
      </div>
   );
  }
}

export default Feed;