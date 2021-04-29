import React from 'react';
import Post from './Post';

class PostList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        titleTextboxValue: "",
        urlTextboxValue: "",
        isLoaded: false,
        error: null,
        data: [],
      };
  
      this.handleAddButtonPress = this.handleAddButtonPress.bind(this);
      this.handleTitleTextboxChange = this.handleTitleTextboxChange.bind(this);
      this.handleUrlTextboxChange = this.handleUrlTextboxChange.bind(this);
      this.handleUpvote = this.handleUpvote.bind(this);
      this.handleDownvote = this.handleDownvote.bind(this);
    }

    componentDidMount(){
      //Part 1: Remove this hardcoded stuff and retrieve the data
      //from your Post API
      //- if loading succeeds make sure you set isLoaded to true in the state
      //- if loading fails set isLoaded to true AND error to true in the state

      fetch('http://localhost:5000/posts')
          .then(res => res.json())
          .then(json => {
              json.forEach(function(post, index){
                let domain = post.url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
                post.url = domain;
              });

              this.setState({
                isLoaded: true,
                data: json
              })
          });
    }
  
    handleAddButtonPress() {
      //Part 2:
      //- Add the post to the API via AJAX call
      // -- if the call succeeds, add the copy of the post you receive from the API
      // to your local copy of the data
      // -- if an error occurs set error to true in the state
      let newData = this.state.data;
      let domain = (this.state.urlTextboxValue).replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];

      newData.push({ id: this.state.data.length + 1, title: this.state.titleTextboxValue, url: domain, points: 0 });
      this.setState(
        function (state) {
          return { data: newData, itemCount: this.state.data.length, points: 0 };
        }

      );

       fetch('http://localhost:5000/posts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.state.id,
            title: this.state.titleTextboxValue,
            url: this.state.urlTextboxValue
          })
        }).then( (response) => {
          console.log(response)
          this.setState(
            function(state){
              return {
                titleTextboxValue: "",
                urlTextboxValue: "",
                isLoaded: true,
                error: null,
                data: newData,
              }
          })
        });
    }
  
    handleTitleTextboxChange(event){
      this.setState(
        function(state){
          return { titleTextboxValue: event.target.value };
        }
      )
    }

    handleUrlTextboxChange(event){
      this.setState(
        function(state){
          return { urlTextboxValue: event.target.value };
        }
      )
    }

    handleUpvote(id){
        //Part 3: 
        //- Modify the local copy of the data
        //- Upvote the post on the server via API call
        //- if an error occurs set error to true in the state

        let newData = this.state.data;

        let foundIndex = -1;
        newData.forEach(function(post, index){
            if(post.id === id){
                foundIndex = index;
            }
        });

        if(foundIndex !== -1){
            newData[foundIndex].points = newData[foundIndex].points + 1;
            this.setState(function(state){
                return { data: newData };
            });
        }

        fetch(`http://localhost:5000/posts/${newData[foundIndex].id}/upvote`, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
    }

    handleDownvote(id){
        //Part 4:
        //- Modify the local copy of the data
        //- Downvote the post on the server via API call
        //- if an error occurs set error to true in the state

        let newData = this.state.data;

        let foundIndex = -1;
        newData.forEach(function(post, index){
            if(post.id === id){
                foundIndex = index;
            }
        });

        if(foundIndex !== -1){
            if(newData[foundIndex].points > 0)
              newData[foundIndex].points = newData[foundIndex].points - 1;
              
            this.setState(function(state){
                return { data: newData };
            });
        }

        fetch(`http://localhost:5000/posts/${newData[foundIndex].id}/downvote`, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
    }
  
    render() {
      let error = this.state.error;
      let isLoaded = this.state.isLoaded;

      if(error){
        return <div>Sorry, an error occurred.</div>
      }else if(!isLoaded){
        return <div>Loading...</div>
      }else{
        let handleUpvote = this.handleUpvote;
        let handleDownvote = this.handleDownvote;
        let todoList = this.state.data.map(function (post) {
          return <Post key={post.id} id={post.id} title={post.title} url={post.url} points={post.points} handleUpvote={ handleUpvote } handleDownvote={ handleDownvote }></Post>
        });
    
        return (
          <div>
            <h3 className="title">Tech News</h3>
            <ol>
              { todoList}
            </ol>
            <div className="form">
              <ul>
                <li><a className="form-title">New Submission</a></li>
                <li><a className="label">Title:</a><input className="input" type="text" value={ this.state.titleTextboxValue } onChange={ this.handleTitleTextboxChange }></input></li>
                <li><a className="label">URL:</a><input className="input" type="text" value={ this.state.urlTextboxValue } onChange={ this.handleUrlTextboxChange }></input></li>

                <li><button className="submit-button" onClick={this.handleAddButtonPress}>Submit</button></li>
              </ul>
            </div>
          </div>
        );
      }
    }
  }

export default PostList;