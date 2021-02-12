import React, { useContext } from "react"
import { Router, Link } from "@reach/router"

import useNetlifyIdentity from "hooks/useNetlifyIdentity"
import { UserCtx } from "contexts"
// import Footer from "./components/Footer"
import Spinner from "./components/Spinner"
import InputArea from "./components/InputArea"
// import TodoItem from "./components/TodoItem"
import "./login.css"

import { useQuery, useMutation } from "react-apollo-hooks"
import gql from "graphql-tag"

const NotFound = () => (
  <div>
    <h2>Not found</h2>
    <p>Sorry, nothing here.</p>
    <Link to="/">Go back to the main page.</Link>
  </div>
)

function Login() {
  const { user, doLogin, doLogout } = useContext(UserCtx)
  const style = { cursor: "pointer" }
  var actionForm = (
    <span>
      <button style={style} onClick={doLogin}>
        Login or Sign Up
      </button>
    </span>
  )
  return (
    <div className="Login">
      {user ? (
        <button style={style} onClick={doLogout}>
          Logout
        </button>
      ) : (
        actionForm
      )}
    </div>
  )
}

function List(props) {
  return (
    <div>
      {" "}
      list here <pre>{JSON.stringify(null, 2, props)}</pre>{" "}
    </div>
  )
}

const GETALLLISTS = gql`
  query getcomments {
    allComments {
      name
      message
    }
  }
`

function AllLists() {
  const { data, error, loading } = useQuery(GETALLLISTS)
  if (loading) {
    return <Spinner />
  }
  if (error) {
    return <div>Error! {error.message}</div>
  }
  const { lists } = data

  const onSubmit = title => {} // load(addList(title))
  return (
    <div>
      <div className="listNav">
        <label>Choose a list.</label>
      </div>
      <section className="main">
        <ul className="todo-list">
          {lists.map(({ data, ref }) => {
            return (
              <li key={ref.value.id}>
                {/* <label onClick={() => alert('go')}>{data.title}</label> */}
                <label>
                  <Link to={`/list/${ref.value.id}`}>{data.title}</Link>
                </label>
              </li>
            )
          })}
        </ul>
      </section>
      <InputArea onSubmit={onSubmit} placeholder="Create a new list or choose from above." />
    </div>
  )
}

const Wrapper = props => props.children

export default function App(props) {
  const identity = useNetlifyIdentity(faunadb_token => {
    console.log("FROMAPP", faunadb_token)
    // onAuthChange(faunadb_token).then(_client => {
    //   if (_client) load(getServerLists(_client))
    // })
  })

  return (
    <UserCtx.Provider value={identity}>
      <div>
        <header className="header">
          <Login />
          {identity.user && (
            <Router>
              <AllLists path="/" />
              <Wrapper path="list">
                <List path=":listId" />
                <List path=":listId/active" />
                <List path=":listId/completed" />
                <NotFound default />
              </Wrapper>
              <NotFound default />
            </Router>
          )}
        </header>
      </div>
    </UserCtx.Provider>
  )
}
