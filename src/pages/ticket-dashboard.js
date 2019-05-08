import React from "react"
import Layout from "../components/layout"
import Ticket from "../components/ticket"
import { withStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"
import Modal from "@material-ui/core/Modal"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import FormHelperText from "@material-ui/core/FormHelperText"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { addTickets } from "../redux/actions/tickets"
import { connect } from "react-redux"
import withRoot from "../withRoot"
const { API_URL } = process.env

//Fetch tickets & display them appropriately
//When ticket is moved, update server...

const styles = theme => ({
  modal: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: "50rem",
    height: "30rem",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    padding: "3rem",
    fontFamily: "Lato",
    overflow: "scroll",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    margin: "0px auto",
  },
})

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

// a function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 15
const margin = 20

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  // padding: grid * 2,
  margin: `0 ${margin}px ${grid}px ${margin}px`,
  height: "10rem",
  width: "15rem",
  boxShadow: "1px 1px 5px 1px rgba(0,0,0,.2)",
  // change background colour if dragging
  background: isDragging ? "rgb(220,220,250)" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
  borderRight: "1px solid rgba(23,9,45,.2)",
  background: isDraggingOver ? "rgba(150,150,250,.2)" : "white",
  padding: grid,
  width: "19rem",
  minWidth: "19rem",
})

class TicketBoard extends React.Component {
  classes = this.props.classes
  state = {
    toDo: [],
    inProgress: [],
    testing: [],
    review: [],
    done: [],
    addATicketOpen: false,
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  fetchData(props) {
    if (props.location.state) {
      const token = sessionStorage.getItem("ticketing_token")
      const group_id = props.location.state.group_id
      // const ticketArr = props.data.tickets.filter(
      //   ticketObj => ticketObj.group_id === group_id
      // )
      // console.log("ticketArr: ", ticketArr)
      // if (ticketArr.length > 0) {
      //   this.setState(ticketArr[0].tickets)
      // } else {
      fetch(`${API_URL}/ticket/list/${group_id}`, {
        headers: {
          Authorization: token,
        },
      })
        .then(result => result.json())
        .then(result => {
          console.log(result)
          if (result.success) {
            const data = result.data
            let tickets = data.map(obj => ({
              id: obj.id,
              content: {
                title: obj.title,
                description: obj.description,
                created: obj.created_at,
                reporter: obj.reporter_email,
              },
              status: obj.status,
            }))
            const ticketsObj = {
              toDo: tickets.filter(ticket => ticket.status === "toDo"),
              inProgress: tickets.filter(
                ticket => ticket.status === "inProgress"
              ),
              testing: tickets.filter(ticket => ticket.status === "testing"),
              review: tickets.filter(ticket => ticket.status === "review"),
              done: tickets.filter(ticket => ticket.status === "done"),
            }
            props.dispatchAddTickets({ group_id, tickets: ticketsObj })
            this.setState(ticketsObj)
          } else {
            //TODO: Handle unsuccessful call
          }
        })
        .catch(error => {
          console.log("error: ", error)
          //TODO: handle error
        })
    }
    // }
  }

  componentWillReceiveProps(newProps) {
    this.fetchData(newProps)
  }

  getList = id => this.state[id]

  moveTicket(ticket_id, status) {
    console.log("move ticket: ", ticket_id, status)
    const data = `ticket_id=${ticket_id}&status=${status}`
    console.log(data)
    fetch(`${API_URL}/ticket/move`, {
      method: "PUT",
      headers: {
        Authorization: sessionStorage.getItem("ticketing_token"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
        } else {
          console.log(response)
        }
      })
      .catch(error => console.log(error))
  }
  commentOnTicket(ticket_id, comment) {
    fetch(`${API_URL}/ticket/admin-comment`, {
      method: "POST",
      headers: {
        Authorization: sessionStorage.getItem("ticketing_token"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${ticket_id}&comment=${comment}`,
    }).then(result => {
      console.log(result)
    })
  }
  fetchComments(ticket_id) {
    return fetch(`${API_URL}/ticket/comments/${ticket_id}`)
      .then(result => result.json())
      .catch(error => {
        console.log(error)
      })
  }
  onDragEnd = result => {
    const { source, destination, draggableId } = result
    // dropped outside the list
    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      )
      let colId = source.droppableId
      let state = {}
      state[colId] = items
      this.setState(state)
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      )
      let state = {}
      state[source.droppableId] = result[source.droppableId]
      state[destination.droppableId] = result[destination.droppableId]
      this.setState(state)
      this.moveTicket(draggableId, destination.droppableId)
    }
  }
  handleAddTicket(e) {
    e.preventDefault()
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    if (!title || !description) {
      if (!title) {
        this.setState({ titleError: true })
      }
      if (!description) {
        this.setState({ descriptionError: true })
      }
    } else {
      this.setState({
        titleError: false,
        descriptionError: false,
      })
      const data = {
        title: title,
        description: description,
        group_id: this.props.location.state.group_id,
        reporter_email: sessionStorage.getItem("ticketing_username"),
      }
      fetch(`${API_URL}/ticket/create`, {
        method: "POST",
        headers: {
          Authorization: sessionStorage.getItem("ticketing_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(result => {
          this.setState({
            addATicketOpen: false,
          })
        })
        .catch(error => {
          console.log(error)
          this.setState({
            addATicketOpen: false,
          })
        })
    }
  }
  render() {
    return (
      <Layout>
        <Button
          variant="contained"
          color="primary"
          style={{
            textTransform: "none",
            marginLeft: "90%",
            marginBottom: "1rem",
          }}
          onClick={() => this.setState({ addATicketOpen: true })}
        >
          Add a Ticket
        </Button>
        <Modal
          open={this.state.addATicketOpen}
          onClose={() => {
            this.fetchData(this.props)
            this.setState({ addATicketOpen: false })
          }}
        >
          <div className={this.classes.modal}>
            <form className={this.classes.container}>
              <TextField
                error={this.state.emptyTitle}
                id="title"
                label="Title"
                className={this.classes.textField}
                margin="normal"
                variant="outlined"
              />
              <FormHelperText id="title-error-text">
                {this.state.emptyTitleText}
              </FormHelperText>

              <TextField
                error={this.state.emptyDescription}
                id="description"
                label="Description"
                className={this.classes.textField}
                margin="normal"
                variant="outlined"
                multiline
                rows="6"
              />
              <FormHelperText id="description-error-text">
                {this.state.emptyDescriptionText}
              </FormHelperText>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: "1rem" }}
                onClick={e => this.handleAddTicket(e)}
              >
                Add Ticket
              </Button>
            </form>
          </div>
        </Modal>
        <div style={{ display: "flex" }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="toDo">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <h5 style={{ textAlign: "center" }}>To Do</h5>
                  {this.state.toDo.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Ticket
                            created={item.content.created}
                            reporter={item.content.reporter}
                            title={item.content.title}
                            description={item.content.description}
                            id={item.id}
                            status="To Do"
                            getComments={this.fetchComments}
                            commentOnTicket={this.commentOnTicket}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="inProgress">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <h5 style={{ textAlign: "center" }}>In Progress</h5>
                  {this.state.inProgress.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Ticket
                            created={item.content.created}
                            reporter={item.content.reporter}
                            title={item.content.title}
                            description={item.content.description}
                            id={item.id}
                            status="In Progress"
                            getComments={this.fetchComments}
                            commentOnTicket={this.commentOnTicket}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="testing">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <h5 style={{ textAlign: "center" }}>Testing</h5>
                  {this.state.testing.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      className={this.classes.ticket}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={this.classes.ticket}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Ticket
                            created={item.content.created}
                            reporter={item.content.reporter}
                            title={item.content.title}
                            description={item.content.description}
                            id={item.id}
                            status="Testing"
                            getComments={this.fetchComments}
                            commentOnTicket={this.commentOnTicket}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="review">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <h5 style={{ textAlign: "center" }}>Review</h5>
                  {this.state.review.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Ticket
                            created={item.content.created}
                            reporter={item.content.reporter}
                            title={item.content.title}
                            description={item.content.description}
                            id={item.id}
                            status="Review"
                            getComments={this.fetchComments}
                            commentOnTicket={this.commentOnTicket}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="done">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    ...getListStyle(snapshot.isDraggingOver),
                    borderRight: "none",
                  }}
                >
                  <h5 style={{ textAlign: "center" }}>Done</h5>
                  {this.state.done.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Ticket
                            created={item.content.created}
                            reporter={item.content.reporter}
                            title={item.content.title}
                            description={item.content.description}
                            id={item.id}
                            status="Done"
                            getComments={this.fetchComments}
                            commentOnTicket={this.commentOnTicket}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return { data: state.tickets }
}

const mapDispatchToProps = dispatch => {
  return { dispatchAddTickets: ticketObj => dispatch(addTickets(ticketObj)) }
}

const ConnectedTicketBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(TicketBoard)

TicketBoard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRoot(withStyles(styles)(ConnectedTicketBoard))
