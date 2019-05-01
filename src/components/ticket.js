import React, { useState, useEffect } from "react"
import Modal from "@material-ui/core/Modal"
import PropTypes from "prop-types"
import moment from "moment"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Comment from "./comment"
import { withStyles, withTheme } from "@material-ui/core/styles"

const styles = theme => ({
  ticket: {
    width: "100%",
    height: "100%",
    padding: "2rem",
  },
  modal: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: "50rem",
    height: "40rem",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    padding: "3rem",
    fontFamily: "Lato",
    overflow: "scroll",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "500",
  },
  description: {
    fontSize: ".9rem",
  },
})

const Ticket = props => {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, updateCommentText] = useState("")
  const {
    title,
    description,
    reporter,
    created,
    status,
    id,
    getComments,
  } = props

  useEffect(() => {
    getComments(id).then(result => {
      setComments(result.data)
    })
  }, [])
  const classes = props.classes
  return (
    <div>
      <div className={classes.ticket} onClick={() => setOpen(true)}>
        <h4>{props.title}</h4>
        <p>{props.description}</p>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={classes.modal}>
          <div style={{ width: "100%" }}>
            <h4 className={classes.title}>{title}</h4>
            <p className={classes.description}>
              <span
                style={{
                  display: "block",
                  fontWeight: "600",
                  fontSize: ".9rem",
                  marginBottom: "1rem",
                }}
              >
                Description:
              </span>
              {description}
            </p>
            <TextField
              id="outlined-full-width"
              style={{ margin: "8px 8px 20px 0px" }}
              placeholder="Add a comment"
              fullWidth
              multiline
              rows="2"
              margin="normal"
              variant="outlined"
              value={commentText}
              onChange={e => updateCommentText(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ textTransform: "none" }}
              onClick={() => {
                setComments([
                  {
                    ticket_id: "new",
                    content: commentText,
                    commenter: sessionStorage.getItem("ticketing_username"),
                    created_at: moment(),
                  },
                  ...comments,
                ])
                props.commentOnTicket(id, commentText)
              }}
            >
              Comment
            </Button>
            {comments.map(comment => (
              <Comment
                key={comment.ticket_id}
                content={comment.content}
                commenter={comment.commenter}
                date={comment.created_at}
                ticket_id={comment.ticket_id}
              />
            ))}
          </div>
          <div style={{ marginLeft: "4rem" }}>
            <p className={classes.status}>
              <span
                style={{
                  display: "block",
                  fontWeight: "600",
                  fontSize: ".7rem",
                }}
              >
                STATUS:
              </span>
              {status}
            </p>
            <p className={classes.reporter}>
              <span
                style={{
                  display: "block",
                  fontWeight: "600",
                  fontSize: ".7rem",
                }}
              >
                REPORTER:
              </span>
              {reporter}
            </p>
            <p className={classes.created}>
              <span
                style={{
                  display: "block",
                  fontWeight: "600",
                  fontSize: ".7rem",
                }}
              >
                CREATED:
              </span>
              {moment(created).fromNow()}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

Ticket.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

Ticket.defaultProps = {}

export default withStyles(styles, { withtheme: true })(Ticket)
