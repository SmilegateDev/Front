import React, { Component } from 'react';
import axios from 'axios';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      content: null,
      file: null,
      fileSrc: null
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });
  }

  handlePost = () => {
    if (this.props.location === null) {
      return alert("게시물을 남길 위치를 지도에 클릭해주세요.");
    }

    const formData = new FormData();

    formData.append('file', this.state.file);
    formData.append('title', this.state.title);
    formData.append('content', this.state.content);
    formData.append('lati', this.props.location[0]);
    formData.append('long', this.props.location[1]);

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token")
      }
    };

    axios.post("/post/create", formData, headers)
    .then(res => {
      this.setState({
        title: "",
        content: "",
        file: "",
        fileSrc: ""
      });

      this.props.setLocationNull();
      window.markerLayer.removeAllMarker();

      return alert("성공적으로 등록되었습니다.");
    })
    .catch(err => {
      return alert(err);
    });
  }

  handleUploadClick = () => {
    this.pictureElement.click();
  }

  handleUpload = () => {
    const currentFile = this.pictureElement.files[0];

    const reader = new FileReader();

    if (currentFile && currentFile.type.match('image.*')) {
      reader.onloadend = () => {
        this.setState({ file: currentFile, fileSrc: String(reader.result) });
      }
  
      reader.readAsDataURL(currentFile);
    } else if (currentFile && !currentFile.type.match('image.*')) {
      alert("지원되지 않는 사진 파일 형식입니다.")
    }
  }

  render() {
    return (
      <div id="post" className={this.props.activeItem === "post-on" ? "out" : ""}>
        <div className="head custom-head">글 작성하기</div>
        <article className="custom-article">
          <div className="mainarticle">
            <form method="POST" onSubmit={e => { e.preventDefault(); }}>
              <input type="text" className="form-control custom-form mt-4" name="title" id="title" placeholder="제목" onChange={ this.handleChange } value={ this.state.title } />
              <hr className="post-hr my-4" />
              { this.state.fileSrc ?
                <img src={ this.state.fileSrc } className="img-fluid mb-2" alt="profile" /> :
                <img className="img-fluid d-none mb-2" alt="profile" />
              }
              <textarea className="form-control custom-form mt-3" name="content" id="content" placeholder="글 내용" onChange={ this.handleChange } value={ this.state.content } rows="5"></textarea>
              <input ref={ ref => { this.pictureElement = ref; } } id="picture" onChange={ this.handleUpload } type="file" name="picture" className="d-none" />
              <button type="button" className="btn btn-primary btn-block custom-login-btn mb-3" onClick={ this.handleUploadClick}>사진 첨부</button>
              <button type="button" className="btn btn-success btn-block custom-login-btn" onClick={ this.handlePost }>글 등록하기</button>
            </form>
          </div>
        </article>
      </div>
    );
  }
}

export default Post;