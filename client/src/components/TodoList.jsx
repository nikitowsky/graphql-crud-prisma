import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { List, ListItem, ListItemText, CircularProgress } from '@material-ui/core';

import TodoItem from './TodoItem';

export const GET_TODOS = gql`
  query getTodos {
    todoes {
      id
      title
      description
      complete
    }
  }
`;

const TodoList = () => (
  <Query query={GET_TODOS}>
    {({ loading, data }) => {
      const { todoes } = data;

      if (loading) {
        return (
          <center>
            <CircularProgress size={50} />
          </center>
        );
      }

      if (todoes.length === 0) {
        return (
          <List>
            <ListItem>
              <ListItemText>There is no todos yet.</ListItemText>
            </ListItem>
          </List>
        );
      }

      return <List>{todoes.map(({ id, ...item }) => <TodoItem key={id} id={id} {...item} />)}</List>;
    }}
  </Query>
);

export default TodoList;
