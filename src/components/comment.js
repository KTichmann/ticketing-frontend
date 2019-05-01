import React from "react"
import moment from "moment"

export default (Comment = props => (
  <div
    key={props.ticket_id}
    id={props.ticket_id}
    style={{
      height: "auto",
      minHeight: "5rem",
      width: "100%",
      marginTop: "2rem",
      borderBottom: "1px solid rgba(0,0,0,.15)",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <p style={{ fontWeight: "600" }}>{props.commenter}</p>
      <p
        style={{
          fontSize: ".8rem",
          fontWeight: "600",
          color: "rgb(120,120,120)",
        }}
      >
        {moment(props.date).fromNow()}
      </p>
    </div>
    <p style={{ marginLeft: 20, maxWidth: "90%" }}>{props.content}</p>
  </div>
))
