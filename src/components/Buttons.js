import React, { useState, useRef, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button, Modal, Form, Image } from 'react-bootstrap';
import { AppContext } from '../App';


function Buttons(props) {

  const {booksToDisplay, setBooksToDisplay, books, setBooks, sortBooksToDisplay} = useContext(AppContext);

  const ratingInput = useRef(null);
  const priceInput = useRef(null);
  const titleInput = useRef(null);
  const descInput = useRef(null);

  const [showReadModal, setShowReadModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openReadModal = () => {
    setShowReadModal(true);
  }

  const closeReadModal = () => {
    setShowReadModal(false);
  }

  const openUpdateModal = () => {
    setShowUpdateModal(true);
  }

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  }

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  }

  const updateRating = () => {

    let bookData = props.bookData
    bookData.rating = parseInt(ratingInput.current.value);

    let book = books.find(book => book === bookData);
    book.price = bookData.price;
    setBooks(books);
    let booksToDisplayCopy = sortBooksToDisplay(booksToDisplay);
    setBooksToDisplay(booksToDisplayCopy);

    closeReadModal();
  }

  const updatePrice = () => {

    let bookData = props.bookData;
    bookData.price = parseFloat(priceInput.current.value);
 
    let book = books.find(book => book === bookData);
    book.price = bookData.price;
    setBooks(books);
    let booksToDisplayCopy = sortBooksToDisplay(booksToDisplay);
    setBooksToDisplay(booksToDisplayCopy);

    closeUpdateModal();
  }

  const deleteBook = () => {
    let bookData = props.bookData;
    let booksCopy = [...books];
    let index = booksCopy.findIndex(book => book === bookData);
    booksCopy.splice(index, 1);
    setBooks(booksCopy);

    booksCopy = [...booksToDisplay];
    index = booksCopy.findIndex(book => book === bookData);
    booksCopy.splice(index, 1);
    setBooksToDisplay(booksCopy);
    closeDeleteModal();
  }




  return (
    <div>
      <Button variant="primary" onClick={openReadModal} >Read</Button>{' '}
      <Button variant="warning" onClick={openUpdateModal}>Update</Button>{' '}
      <Button variant="danger" onClick={openDeleteModal}>Delete</Button>{' '}

      <div>


        <Modal show={showUpdateModal} onHide={closeUpdateModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Update Book Price</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={2}>
                  Title
                </Form.Label>
                <Col sm={10}>
                  <Form.Control ref={titleInput} type="text" placeholder="Title" defaultValue={props.bookData.title} readOnly={true} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={2}>
                  Price
                </Form.Label>
                <Col sm={10}>
                  <Form.Control ref={priceInput} type="number" placeholder="Price" defaultValue={props.bookData.price}
                    onKeyDown={(event) => { if (!/[0-9]|./.test(event.key)) { event.preventDefault(); } }}
                  />
                </Col>
              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeUpdateModal}>
              Close
            </Button>
            <Button variant="primary" onClick={updatePrice}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal show={showReadModal} onHide={closeReadModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={2}>
                  Title
                </Form.Label>
                <Col sm={10}>
                  <Form.Control ref={titleInput} type="text" placeholder="Title" defaultValue={props.bookData.title} readOnly={true} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={2}>
                  Price
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="number" placeholder="Price" defaultValue={props.bookData.price} readOnly={true} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalPassword">
                <Form.Label column sm={2}>
                  Description
                </Form.Label>
                <Col sm={10}>
                  <Form.Control ref={descInput} as="textarea" type="text" placeholder="description" defaultValue={props.bookData.desc} readOnly={true} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formHorizontalEmail">
                <Form.Label column sm={2}>
                  Rating
                </Form.Label>
                <Col sm={10}>
                  <Form.Control ref={ratingInput} type="number" placeholder="Rating" defaultValue={props.bookData.rating}
                    onKeyDown={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalPassword" readOnly={true}>
                <Form.Label column sm={2}>
                  Image
                </Form.Label>
                <Col sm={10}>
                  <Image width={100} height={120} src={props.bookData.imgUrl} />
                </Col>
              </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeReadModal}>
              Close
            </Button>
            <Button variant="primary" onClick={updateRating}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={closeDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Book?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
            <Button variant="danger" onClick={deleteBook}>Yes</Button>
          </Modal.Footer>
        </Modal>

      </div>


    </div>
  );
}

export default Buttons