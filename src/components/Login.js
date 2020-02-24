import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      loginMsg: null
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });
  }

  pressEnter = (e) => {
    if (e.key === "Enter") {
      this.handleLogin();
    }
  }

  handleLogin = () => {
    const data = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post("/auth/login", data)
    .then(res => {
      if (res.data.code === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
  
        this.props.setLoginState(true);
        this.props.setActiveItem(null);

        return this.setState({ loginMsg: null });
      } else {
        return this.setState({ loginMsg: "이메일 혹은 비밀번호가 일치하지 않습니다." });
      }
    })
    .catch(err => {
      return this.setState({ loginMsg: "이메일 혹은 비밀번호가 일치하지 않습니다." });
    });
  }

  render() {
    return (
      <div id="login" className={this.props.activeItem === "login-on" ? "out" : ""}>
        <article className="custom-article">
          <div className="mainarticle">
            <img src="brand.png" width="150" alt="brand" />
            <form method="POST" onSubmit={e => { e.preventDefault(); }}>
              <input type="text" className="form-control custom-form" name="email" id="email" placeholder="이메일" onChange={ this.handleChange } onKeyPress={ this.pressEnter } />
              <input type="password" className="form-control custom-form mt-3" name="password" id="password" placeholder="비밀번호" onChange={ this.handleChange } onKeyPress={ this.pressEnter } />
              <div className="row justify-content-center custom-text-danger mt-4">{ this.state.loginMsg }</div>
              <button type="button" className="btn btn-success btn-block custom-login-btn" onClick={ this.handleLogin }>로그인</button>
            </form>
            <hr className="login-hr" />
            <a href="#" className="btn btn-danger btn-block oauth-login-btn">
              <i className="fab fa-google mr-3"></i>구글 로그인
            </a>
            <a href="#" className="btn btn-primary btn-block oauth-login-btn mt-2">
              <i className="fab fa-facebook-f mr-3"></i>페이스북 로그인
            </a>
            <a href="#" className="btn btn-warning btn-block oauth-login-btn mt-2">
              <i className="fab fa-kickstarter-k mr-3"></i>카카오 로그인
            </a>
          </div>
        </article>
      </div>
    );
  }
}

export default Login;