import React from 'react';

class Post extends React.Component {
  constructor(props) {
    //boilerplate
    super(props);
    //hack to know about this
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  }

  handleUpvote() {
    this.props.handleUpvote(this.props.id);
  }

  handleDownvote(){
    this.props.handleDownvote(this.props.id);
  }

  render() {
    //return JSX element
    return (
      <li className="list-posts">
        <button className="vote upvote" title="Up" onClick={ this.handleUpvote }></button>
        <button className="vote downvote" title="Down" onClick={ this.handleDownvote }></button>
        <strong>{this.props.title}</strong> <a className="url">({this.props.url})</a>
        <a>{this.props.points} points</a>
      </li>
    )
  }
}

export default Post;