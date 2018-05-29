import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { ApolloConsumer } from 'react-apollo';
import { Checkbox, IconButton, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

import { GET_TODOS } from './TodoList';

const UPDATE_TODO = gql`
  mutation updateTodoCompletion($id: ID!, $complete: Boolean!) {
    updateTodo(where: { id: $id }, data: { complete: $complete }) {
      id
      complete
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id
    }
  }
`;

export default class TodoItem extends Component {
  state = {
    loading: false,
  };

  handleCheckboxClick = (client) => async () => {
    const { id, complete } = this.props;

    await this.setState({ loading: true });
    await client.mutate({
      mutation: UPDATE_TODO,
      variables: { id, complete: !complete },
      update: this.handleUpdate,
    });
  };

  handleDelete = (client) => async () => {
    const { id } = this.props;

    await this.setState({ loading: true });
    await client.mutate({
      mutation: DELETE_TODO,
      variables: { id },
      update: this.handleUpdate,
    });
  };

  /**
   * Update cache as long it isnt required to refetch data
   */
  handleUpdate = (cache, { data: { updateTodo, deleteTodo } }) => {
    const { todoes } = cache.readQuery({ query: GET_TODOS });

    this.setState({ loading: false });

    if (updateTodo) {
      const updatedItem = todoes.findIndex((todo) => todo.id === updateTodo.id);
      todoes[updatedItem].complete = updateTodo.complete;

      cache.writeQuery({
        query: GET_TODOS,
        data: { todoes },
      });
    }

    if (deleteTodo) {
      const removedTodo = todoes.findIndex((todo) => todo.id === deleteTodo.id);
      todoes.splice(removedTodo, 1);

      cache.writeQuery({
        query: GET_TODOS,
        data: { todoes },
      });
    }
  };

  render() {
    const { title, description, complete } = this.props;
    const { loading } = this.state;

    return (
      <ApolloConsumer>
        {(client) => {
          return (
            <ListItem disabled={loading} dense button>
              <Tooltip title={`Mark as ${complete ? 'uncompleted' : 'completed'}`} placement="bottom">
                <Checkbox onClick={this.handleCheckboxClick(client)} checked={complete} disableRipple />
              </Tooltip>

              <ListItemText primary={title} secondary={description} />

              <Tooltip title="Delete" placement="bottom">
                <IconButton onClick={this.handleDelete(client)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          );
        }}
      </ApolloConsumer>
    );
  }
}
