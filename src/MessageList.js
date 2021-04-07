import React from "react";
import Style from 'style-it';

const axios = require("axios");
var _ = require('lodash')

const url = "http://35.157.57.155:80/messages/";

class Message extends React.Component {
  constructor(props) {
    super(props)
    this.msgRef = React.createRef()
  }
  
  componentDidMount() {
    this.msgRef.current.setAttribute('style', this.props.style);
  }

  componentDidUpdate() {
    this.msgRef.current.setAttribute('style', this.props.style);
  }

  render() {
    return(
      <span ref={this.msgRef}>{this.props.message}</span>
    )
  }
}


class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.btmDivRef = React.createRef()
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.updateMessages(), 1000);
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  scrollToBottom() {
    this.btmDivRef.current.scrollIntoView({behavior: 'smooth'})
  }

  async updateMessages() {
    try {
      const response = await axios.get(url, { headers: {} });
      if (!_.isEqual(response.data, this.state.data)) {
        this.setState({
          data: response.data,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  getReadableDate(ISOString) {
    let date = new Date(ISOString)
    return date.toLocaleString("no-NO")
  }

  render() {
    return (
      <>
      <div style={{textAlign: "center"}}>
        <h1>KIRC</h1>
        <h6>Designed by Engineers &trade;</h6>
      </div>
      <ul style={{listStyleType: "none"}}>
        {this.state.data.map((datum) => (
          <li
            key={datum.id}
          >
            <span style={{margin: "5px"}}>[{this.getReadableDate(datum.timestamp)}]</span>
            <span >[{datum.nickname === null ? "Guest" : datum.nickname}]: </span>
            <Message style={datum.style} message={datum.message} id={datum.id}></Message>
          </li>
        ))}
      </ul>
      <div ref={this.btmDivRef}></div>
      </>
    );
  }
}

export default MessageList;
