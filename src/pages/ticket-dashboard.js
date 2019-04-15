import React from "react"
import Layout from "../components/layout"
import { withStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

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

// a little function to help us with reordering the result
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
  borderRight: "1px solid rgba(0,0,0,.3)",
  background: isDraggingOver ? "lightblue" : "white",
  padding: grid,
  width: "19rem",
})

class TicketBoard extends React.Component {
  classes = this.props.classes
  state = {
    toDo: [
      { id: 1, content: "test" },
      { id: 2, content: "testing" },
      { id: 3, content: "test 2" },
      { id: 4, content: "also more testing" },
    ],
    inProgress: [
      { id: 5, content: "test" },
      { id: 6, content: "test" },
      { id: 7, content: "test" },
      { id: 8, content: "test" },
      { id: 9, content: "test" },
      { id: 10, content: "test" },
      { id: 11, content: "test" },
      { id: 12, content: "test" },
      { id: 13, content: "test" },
      { id: 14, content: "test" },
    ],
    testing: [
      { id: 15, content: "test" },
      { id: 16, content: "test" },
      { id: 17, content: "test" },
      { id: 18, content: "test" },
      { id: 19, content: "test" },
      { id: 20, content: "test" },
      { id: 21, content: "test" },
      { id: 22, content: "test" },
      { id: 23, content: "test" },
      { id: 24, content: "test" },
    ],
    review: [
      { id: 25, content: "test2" },
      { id: 26, content: "test2" },
      { id: 27, content: "test2" },
      { id: 28, content: "test2" },
      { id: 29, content: "test2" },
      { id: 30, content: "test2" },
      { id: 31, content: "test2" },
      { id: 32, content: "test2" },
      { id: 33, content: "test2" },
      { id: 34, content: "test2" },
    ],
    done: [],
  }

  getList = id => this.state[id]

  onDragEnd = result => {
    const { source, destination } = result

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
                          {item.content}
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
                          {item.content}
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
                          {item.content}
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
                          {item.content}
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
                          {item.content}
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
