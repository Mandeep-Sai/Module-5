import React,{Component} from 'react'
import { Container,Row,Col,Card ,Button,InputGroup,DropdownButton,Dropdown,FormControl } from 'react-bootstrap'
import Comments from './Comments'

let bookCategories=["fantasy","horror","history","romance","scifi"]
let books={
    fantasy:require("../jsons/fantasy.json"),
    horror:require("../jsons/horror.json"),
    history:require("../jsons/history.json"),
    romance:require("../jsons/romance.json"),
    scifi:require("../jsons/scifi.json")

}

class Releases extends React.Component{
    constructor(props){
        super(props)
        this.state={
            selectedCategory:books.fantasy.slice(0,12),
            selectedBook:books.fantasy[0],
            category:'fantasy'
            

        }
    }
    changeCategory = (category) =>{
        this.setState({category})
        this.setState({selectedCategory : books[category].slice(0,12)})
    }
    filterBooks = (e)=>{
        let searchText = e.currentTarget.value
        let cat = this.state.category
        this.setState({selectedCategory : books[cat].filter(book => book.title.toLowerCase().includes(searchText))})
        // console.log(searchText)
    }
    selectBook = (book) =>{
        this.setState({selectedBook : book})
    }
    render(){
        return(
            <>
            <Container>
            <InputGroup className="mb-3">
                <DropdownButton
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title={this.state.category}
                id="input-group-dropdown-1"
                >
                {bookCategories.map(category =>{
                    return(
                        <Dropdown.Item onClick={() =>this.changeCategory(category)}>{category}</Dropdown.Item> 
                    )
                })}                           
                </DropdownButton>
                <FormControl aria-describedby="basic-addon1" onChange = {this.filterBooks} />
            </InputGroup>
                <Row>
                    
                   {
                       this.state.selectedCategory.map(book=>{
                           return(
                            <Col xs={3}>
                            <Card onClick={() =>this.selectBook(book)} >
                            <Card.Img variant="top" src={book.img} />
                            <Card.Body>
                                <Card.Title>{book.title}</Card.Title>
                                <Button variant="primary">Buy</Button>
                            </Card.Body>
                            </Card>
                            </Col>)
                       })
                   }
                </Row>
                <Row>
                    <Comments book = {this.state.selectedBook}/>
                </Row>
            </Container>
            </>
        )
    }
}
export default Releases