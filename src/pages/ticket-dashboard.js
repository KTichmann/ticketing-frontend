import React from "react"
import Layout from "../components/layout"
import { withStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
const { API_URL } = process.env

//Fetch tickets & display them appropriately
//When ticket is moved, update server...

const styles = theme => ({})

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
  padding: grid * 2,
  margin: `0 ${margin}px ${grid}px ${margin}px`,
  height: "10rem",
  width: "15rem",
  boxShadow: "1px 1px 5px 1px rgba(0,0,0,.2)",
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = isDraggingOver => ({
  borderRight: "1px solid rgba(0,0,0,.3git)",
  background: isDraggingOver ? "lightblue" : "white",
  padding: grid,
  width: "19rem",
})

class TicketBoard extends React.Component {
  classes = this.props.classes
  state = {
    toDo: [],
    inProgress: [],
    testing: [],
    review: [],
    done: [],
  }

  componentDidMount() {
    if (this.props.location.state) {
      const token = sessionStorage.getItem("ticketing_token")
      const group_id = this.props.location.state.group_id
      fetch(`${API_URL}/ticket/list/${group_id}`, {
        headers: {
          Authorization: token,
        },
      })
        .then(result => result.json())
        .then(result => {
          if (result.success) {
            const data = result.data
            let tickets = data.map(obj => ({
              id: obj.id,
              content: {
                title: obj.title,
                description: obj.description,
              },
              status: obj.status,
            }))
            this.setState({
              toDo: tickets.filter(ticket => ticket.status === "to do"),
              inProgress: tickets.filter(
                ticket => ticket.status === "in progress"
              ),
              testing: tickets.filter(ticket => ticket.status === "testing"),
              review: tickets.filter(ticket => ticket.status === "review"),
              done: tickets.filter(ticket => ticket.status === "done"),
            })
          } else {
            //TODO: Handle unsuccessful call
          }
        })
        .catch(error => {
          console.log("error: ", error)
          //TODO: handle error
        })
    }
  }

  getList = id => this.state[id]

  moveTicket(ticket_id, status) {
    const data = `` //TODO!!! ADD TICKET ID AND STATUS
    fetch(`${API_URL}/ticket/move`, {
      method: "POST",
      headers: {
        Authorization: sessionStorage.getItem("ticketing_token"),
        ContentType: "application/x-www-form-urlencoded",
      },
      body: data,
    })
      .then(response => {
        console.log(response)
      })
      .catch(error => console.log(error))
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
      this.moveTicket(draggableId, destination.droppableId)
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
    }
  }
  render() {
    return (
      <Layout>
        <div style={{ display: "flex" }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="toDo">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
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
                          <h4>{item.content.title}</h4>
                          <p>{item.content.description}</p>
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
                          <h4>{item.content.title}</h4>
                          <p>{item.content.description}</p>
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
                          <h4>{item.content.title}</h4>
                          <p>{item.content.description}</p>
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
                          <h4>{item.content.title}</h4>
                          <p>{item.content.description}</p>
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
                          <h4>{item.content.title}</h4>
                          <p>{item.content.description}</p>
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

TicketBoard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TicketBoard)
