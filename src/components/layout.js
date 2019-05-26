/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children, groups }) => {
  //for production build (gatsby shenanigans)
  if (typeof window !== "undefined") {
    if (!sessionStorage.getItem("ticketing_token")) {
      if (
        window.location.pathname !== "ticketing-dashboard/user/log-in" &&
        window.location.pathname !== "ticketing-dashboard/user/sign-up"
      ) {
        window.location.replace("/user/log-in")
      }
    }
  }
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <>
          <Header siteTitle={data.site.siteMetadata.title} />
          <div
            id="mainContentLayout"
            style={{
              margin: `5rem 3rem`,
              padding: `0px 1.0875rem 1.45rem`,
              paddingTop: 0,
              transition: "margin .4s",
            }}
          >
            <main>{children}</main>
            <footer />
          </div>
        </>
      )}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
