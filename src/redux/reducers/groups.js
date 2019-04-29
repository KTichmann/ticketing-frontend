const groups = (state = { groups: [] }, action) => {
  switch (action.type) {
    case "ADD_GROUPS":
      const groups = action.groups
      return { ...state, groups: [...groups] }
    default:
      return state
  }
}

export default groups
