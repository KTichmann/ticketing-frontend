import { combineReducers } from "redux"
import groups from "./groups"
import tickets from "./tickets"
export default combineReducers({
  groups,
  tickets,
})
