const tickets = (state = { tickets: [] }, action) => {
  switch (action.type) {
    case "ADD_TICKET":
      const ticket = action.ticket
      return { tickets: [...state.tickets, ticket] }
    default:
      return state
  }
}

export default tickets
