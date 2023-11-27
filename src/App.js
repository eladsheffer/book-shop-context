import './App.css';
import React, { useState, useRef, createContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsonBooks from './books.json';
import { Row, Col, Button, Modal, Form, ListGroup, Container, Image } from 'react-bootstrap';
import axios from 'axios';
import TableView from './components/TableView';
import CardsView from './components/CardsView';


export const AppContext = createContext({});

class Book {
  constructor(bookInfo) {
    this.googleId = bookInfo.id;
    this.title = bookInfo.volumeInfo.title;
    this.price = 100;
    this.desc = bookInfo.volumeInfo.description !== undefined ? bookInfo.volumeInfo.description : "";
    this.rating = bookInfo.volumeInfo.averageRating !== undefined ? bookInfo.volumeInfo.averageRating : 0;
    this.imgUrl = bookInfo.volumeInfo.imageLinks.thumbnail !== "" ? bookInfo.volumeInfo.imageLinks.thumbnail : "http://www.eco.ubookeducations.com/storage/bookImages/111111111111.png";
  }
}

function App() {

  const maxPriceInput = useRef(null);
  const minRatingInput = useRef(null);
  const searchInput = useRef(null);
  const filteredText = useRef(null);


  const [books, setBooks] = useState(jsonBooks);
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tableView, setTableView] = useState(true);
  const [booksToDisplay, setBooksToDisplay] = useState(jsonBooks);
  const [id, setId] = useState(jsonBooks.length);

  const searchBooks = (e) => {
    if (e.target.value) {
      let title = e.target.value;
      let searchBookURL = "https://www.googleapis.com/books/v1/volumes?q=" + title + "&key=AIzaSyCPBFSuRFibcRS50a83xwuiXRD9JTfSM10";

      axios.get(searchBookURL).then(res => {
        setSearchResults(res.data.items);
      });

    } else {
      setSearchResults([]);
    }

  }

  const bookExists = (googleId) => {
    for (let i = 0; i < books.length; i++) {
      if (books[i].googleId === googleId)
        return true;
    }
    return false;
  }

  const addBook = async (e) => {
    e.preventDefault();

    let googleId = e.target.getAttribute("data-id");
    if (bookExists(googleId)) {
      alert('Book already exists in DB')
      return;
    }

    let bookDetailsURL = "https://www.googleapis.com/books/v1/volumes/" + googleId

    const res = await axios.get(bookDetailsURL);
    let newBook = new Book(res.data);
    setId(id + 1);
    newBook.id = id + 1;
    setBooks(books => [...books, newBook]);

    closeAddModal();

    if (!newBook.title.toLowerCase().includes(filteredText.current.value))
      return;

    let booksToDisplayCopy = [...booksToDisplay];
    booksToDisplayCopy.push(newBook);
    booksToDisplayCopy = sortBooksToDisplay(booksToDisplayCopy);
    setBooksToDisplay(booksToDisplayCopy);
  }

  const openAddModal = () => {
    setShowAddModal(true);
  }

  const closeAddModal = () => {
    setSearchResults([]);
    setShowAddModal(false);
  }

  const view = (e) => {

    if (e.target.id === "table")
      setTableView(true);
    else
      setTableView(false);
  }

  const onChangeFilter = (e) => {
    let booksToDisplayCopy = filterSearch(filteredText.current.value);
    booksToDisplayCopy = sortBooksToDisplay(booksToDisplayCopy);
    setBooksToDisplay(booksToDisplayCopy);
  }


  const filterSearch = (filteredText) => {

    let booksToDisplayCopy;
    if (filteredText === "")
      booksToDisplayCopy = books;
    else {
      booksToDisplayCopy = books.filter(book => book.title.toLowerCase().includes(filteredText.toLowerCase()));
    }

    return [...booksToDisplayCopy];
  }

  const onChangeSort = () => {
    let booksToDisplayCopy = sortBooksToDisplay(booksToDisplay);
    setBooksToDisplay(booksToDisplayCopy);
  }

  const sortBooksToDisplay = (booksToDisplayCopy) => {
    if (!booksToDisplayCopy)
      booksToDisplayCopy = booksToDisplay;
    if (maxPriceInput.current.checked)
      booksToDisplayCopy.sort(function (a, b) { return (b.price - a.price) });
    else if (minRatingInput.current.checked)
      booksToDisplayCopy.sort(function (a, b) { return (a.rating - b.rating) });
    else
      booksToDisplayCopy.sort(function (a, b) { return (a.id - b.id) });

    return [...booksToDisplayCopy];
  }


  let listSearchResults = searchResults.map(book => (
    <ListGroup.Item action onClick={addBook} data-id={book.id}>
      {book.volumeInfo.title}
    </ListGroup.Item>
  ));

  let viewItem = tableView ? <TableView > </TableView> : <CardsView > </CardsView>;

  return (
    <div className="App">
      <div className="jumbotron">
        <h1 className="display-3">Welcome To My Book Shop</h1>
      </div>
      <Button variant="link" className="d-flex flex-row" onClick={openAddModal}>Create New Book</Button>
      <Row>
        <Col sm="1">
          <Image id='cards' src="https://cdn4.iconfinder.com/data/icons/176-material-design-outline-core/24/apps-1024.png" width={50} height={50} onClick={view} />
          <Image id='table' src="https://www.shutterstock.com/image-vector/list-sign-icon-content-view-600w-1866073021.jpg" width={50} height={50} onClick={view} />
        </Col>
        <Col sm="8">
          <Form.Control inline ref={filteredText} onChange={onChangeFilter} className="rounded-pill" type="text" placeholder="Filter by Text in Title and Details" />
        </Col>
        <Col sm={3}>
          <Form.Check onChange={onChangeSort} defaultChecked inline type="radio" label="no sort" name="formHorizontalRadios" id="no=sort" />
          <Form.Check onChange={onChangeSort} ref={maxPriceInput} inline type="radio" label="max price" name="formHorizontalRadios" id="max-price" />
          <Form.Check onChange={onChangeSort} ref={minRatingInput} inline type="radio" label="min rating" name="formHorizontalRadios" id="min-rating" />


        </Col>
      </Row>

      <AppContext.Provider value={{booksToDisplay, setBooksToDisplay, books, setBooks, sortBooksToDisplay}}>
        {viewItem}
      </AppContext.Provider>

      <div>
        <Modal show={showAddModal} onHide={closeAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Book</Modal.Title>
          </Modal.Header>

          <Modal.Body>

          </Modal.Body>

          <Modal.Footer>
            <Container>
              <Form autoComplete="off">
                <Form.Group controlId="searchTextId" className="search-box">
                  <Form.Control
                    type="text"
                    placeholder="Type title of the book or part of it"
                    onChange={searchBooks}
                    ref={searchInput}
                  />
                  <ListGroup className="search-results">
                    {listSearchResults}
                  </ListGroup>
                </Form.Group>
              </Form>
            </Container>
          </Modal.Footer>
        </Modal>

      </div>

    </div>
  );
}



export default App;
