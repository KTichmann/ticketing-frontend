import React from "react"
import { withStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { connect } from "react-redux"
import { Link } from "gatsby"
import Layout from "../components/layout"
import withRoot from "../withRoot"
const { API_URL } = process.env

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    width: "calc(23rem - 4rem)",
    margin: "2rem 2rem",
    height: "11rem",
    backgroundColor: "rgba(50, 150, 200, .1)",
    boxShadow: "2px 2px 5px 2px rgba(0, 0, 30, .2)",
    transition: "all .1s",
    "&:hover": {
      transform: "translate(0%, -3%)",
      transition: "all .3s",
      boxShadow: "0px 8px 5px 2px rgba(0, 0, 30, .2)",
    },
  },
  cardContent: {
    top: "50%",
    position: "relative",
    transform: "translateY(-50%)",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1rem",
  },
  hidden: {
    backgroundColor: "rgba(0,0,0,0) !important",
    boxShadow: "none !important",
  },
})

class IndexPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      groups: [],
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      groups: newProps.data.groups,
    })
  }

  render() {
    return (
      <Layout>
        <div className={this.props.classes.root}>
          {this.state.groups.map(group => (
            <Link
              key={group.group_id}
              to="/ticket-dashboard"
              state={{ group_id: group.group_id }}
            >
              <Card className={this.props.classes.card} key={group.group_id}>
                <CardContent className={this.props.classes.cardContent}>
                  <Typography
                    className={this.props.classes.title}
                    color="textSecondary"
                  >
                    {group.title}
                  </Typography>
                  <Typography
                    className={this.props.classes.text}
                    color="textSecondary"
                  >
                    {group.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
          <div
            className={`${this.props.classes.card} ${
              this.props.classes.hidden
            }`}
          />
        </div>
      </Layout>
    )
  }
}

IndexPage.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  return { data: state.groups }
}

const ConnectedIndex = connect(mapStateToProps)(IndexPage)

export default withRoot(withStyles(styles)(ConnectedIndex))
