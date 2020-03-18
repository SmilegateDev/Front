import React, { Component } from 'react';
import axios from 'axios';

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      nickname: null,
      password: null,
      passwordCheck: null,
      joinMsg : null
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });
  }

  pressEnter = (e) => {
    if (e.key === "Enter") {
      this.handleJoin();
    }
  }

  handleJoin = () => {
    if (this.state.email === null || this.state.email.length === 0) {
      return this.setState({
        joinMsg: "이메일을 입력해주세요."
      });
    }
    if (this.state.nickname === null || this.state.nickname.length === 0) {
      return this.setState({
        joinMsg: "닉네임을 입력해주세요."
      });
    }
    if (this.state.password === null || this.state.password.length === 0) {
      return this.setState({
        joinMsg: "비밀번호를 입력해주세요."
      });
    }
    if (this.state.password !== this.state.passwordCheck) {
      return this.setState({
        joinMsg: "비밀번호와 비밀번호 확인이 일치하지 않습니다."
      });
    }

    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if (this.state.email.match(regExp) === null) {
      return this.setState({ joinMsg: "이메일 형식이 올바르지 않습니다." });
    }
    
    const data = {
      email: this.state.email,
      nickname: this.state.nickname,
      password: this.state.password
    }

    axios.post("/auth/join", data)
    .then(res => {
      if (res.data.code === 400) {
        return this.setState({ joinMsg: res.data.msg });
      } else {
        alert("입력하신 이메일로 인증 메일을 전송했습니다.");
        
        this.setState({
          email: "",
          nickname: "",
          password: "",
          passwordCheck: "",
          joinMsg : ""
        });

        return this.props.setActiveItem("login-on");
      }
    })
    .catch(err => {
      alert(err.status);
    });
  }

  render() {
    return (
      <div id="join" className={this.props.activeItem === "join-on" ? "out" : ""}>
        <div className="head custom-head">회원가입</div>
        <article className="custom-article">
          <div className="mainarticle">
          <img src="brand.png" width="150" alt="brand" />
            <form method="POST" onSubmit={e => { e.preventDefault(); }}>
              <input type="text" className="form-control custom-form" name="email" id="email" placeholder="이메일" onChange={ this.handleChange } onKeyPress={ this.pressEnter } value={ this.state.email } />
              <input type="text" className="form-control custom-form mt-3" name="nickname" id="nickname" placeholder="닉네임" onChange={ this.handleChange } onKeyPress={ this.pressEnter } value={ this.state.nickname } />
              <input type="password" className="form-control custom-form mt-3" name="password" id="password" placeholder="비밀번호" onChange={ this.handleChange } onKeyPress={ this.pressEnter } value={ this.state.password } />
              <input type="password" className="form-control custom-form mt-3" name="passwordCheck" id="passwordCheck" placeholder="비밀번호 확인" onChange={ this.handleChange } onKeyPress={ this.pressEnter } value={ this.state.passwordCheck } />
              <div className="row justify-content-center custom-text-danger mt-4">{ this.state.joinMsg }</div>
              <button type="button" className="btn btn-success btn-block custom-login-btn" onClick={ this.handleJoin }>회원가입</button>
            </form>
          </div>
        </article>
      </div>
    );
  }
}

export default Join;