import React, { Component } from 'react';
import {Card, Button,ListGroup,Badge,Form} from 'react-bootstrap'



export class Comments extends Component {
  constructor(props){
    super(props)
  }
  state ={
    reviews:[],
    review:{
      comment : '',
      rate :'',
      elementId: ''
     }
  }
  componentDidMount = async() =>{
    let id = this.props.book.asin
    const dReviews =[]
      let response = await fetch(' https://striveschool.herokuapp.com/api/comments/'+id,{
        method :'GET',
        headers : new Headers({
          'Authorization': 'Basic dXNlcjE4OlEyejVWN2hFRlU2SktSckU=',
          // 'Content-type': "application/json"
        })
      })
      let parsedJson = await response.json()
      parsedJson.forEach(element =>{
        dReviews.push(element)
      })
      this.setState({reviews:dReviews})
     }
  componentDidUpdate = async(prevProps) =>{
    let id = this.props.book.asin
    const dReviews =[]
    if (this.props.book.asin !== prevProps.book.asin) {
      let response = await fetch(' https://striveschool.herokuapp.com/api/comments/'+id,{
        method :'GET',
        headers : new Headers({
          'Authorization': 'Basic dXNlcjE4OlEyejVWN2hFRlU2SktSckU=',
          // 'Content-type': "application/json"
        })
      })
      let parsedJson = await response.json()
      // console.log(parsedJson)
      parsedJson.forEach(element =>{
        dReviews.push(element)
      })
      this.setState({reviews:dReviews})
     }
    }
    updateReview =(event)=>{
      let review = this.state.review
      review['elementId'] = this.props.book.asin
      let currentId = event.currentTarget.id
      if(currentId === 'comment' ){
        review[currentId] = event.currentTarget.value
      }else if(currentId === 'rate' ){
        review[currentId] = parseInt(event.currentTarget.value)
      }
      this.setState({review : review})
  
    }
    sendComms = async() =>{
      try{
        let response = await fetch('https://striveschool.herokuapp.com/api/comments/',{
          method :'POST',
          body: JSON.stringify(this.state.review),
          headers : new Headers({
            'Authorization': 'Basic dXNlcjE4OlEyejVWN2hFRlU2SktSckU=',
            'Content-type': "application/json"
          })
        })
        if(response.ok){
          alert('added')
          // this.getComms()
          this.setState({ 
            review:{
              comment : '',
              rate :'',
              elementId: ''
             }
          })
        }
      }
      catch(error){
        console.log(error)
      }
     }
  
  render() {
    return (
      <>
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src={this.props.book.img}/>
          <Card.Body>
            <Card.Title>{this.props.book.title}</Card.Title>
            <Card.Text>
              <Card.Header>Reviews</Card.Header>
              <ListGroup variant="flush">
                {this.state.reviews.map(review =>{
                  return(
                  <ListGroup.Item>{review.comment} <Badge variant="info">{review.rate}</Badge>{' '}</ListGroup.Item>
                  )
                })}                                
              </ListGroup>
            </Card.Text>
            <Form  >
            <Form.Group>
                <Form.Label>Rating</Form.Label>
                <Form.Control type="text" placeholder="Rating" id='rate'  value={this.state.review.rate} onChange={this.updateReview} />
              </Form.Group>
              <Form.Group >
                <Form.Label>Review</Form.Label>
                <Form.Control type="text" placeholder="Write a Review"  value={this.state.review.comment} id='comment'  onChange={this.updateReview} />
              </Form.Group>         
              <Button variant="primary" onClick ={this.sendComms}  >
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
    
      </>
    )
  }
}

export default Comments

