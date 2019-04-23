import React from "react"
import Layout from "../components/layout"
import { withStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"

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

function IndexPage(props) {
  const { classes } = props

  return (
    <Layout>
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Title
            </Typography>
            <Typography className={classes.text} color="textSecondary">
              Description description description description
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Title
            </Typography>
            <Typography className={classes.text} color="textSecondary">
              Description description description description
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Title
            </Typography>
            <Typography className={classes.text} color="textSecondary">
              Description description description description
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Title
            </Typography>
            <Typography className={classes.text} color="textSecondary">
              Description description description description
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Title
            </Typography>
            <Typography className={classes.text} color="textSecondary">
              Description description description description
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Title
            </Typography>
            <Typography className={classes.text} color="textSecondary">
              Description description description description
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Title
            </Typography>
            <Typography className={classes.text} color="textSecondary">
              Description description description description
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Title
            </Typography>
            <Typography className={classes.text} color="textSecondary">
              Description description description description
            </Typography>
          </CardContent>
        </Card>
        <div className={`${classes.card} ${classes.hidden}`} />
      </div>
    </Layout>
  )
}

IndexPage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(IndexPage)
