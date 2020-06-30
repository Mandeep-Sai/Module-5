import React from 'react';
import {Jumbotron,Carousel} from 'react-bootstrap';



class JumboCarousel extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <>
        <Jumbotron>
          <Carousel>
            {this.props.books.map(book =>{
              return (
                <Carousel.Item>
                  <img src={book.img} />
                  <Carousel.Caption>
                    {book.title}
                  </Carousel.Caption>
                </Carousel.Item>
              )
            })}          
          </Carousel>
        </Jumbotron>
      </>

    )
  }
}

export default JumboCarousel