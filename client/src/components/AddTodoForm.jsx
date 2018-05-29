import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';
import { Button, TextField, List, ListItem, ListItemText } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import css from './AddTodoForm.module.scss';
import { GET_TODOS } from './TodoList';

const CREATE_TODO = gql`
  mutation createTodo($title: String!, $description: String!) {
    createTodo(data: { title: $title, description: $description }) {
      id
      title
      description
      complete
    }
  }
`;

export default class AddTodoForm extends Component {
  state = {
    title: '',
    description: '',
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  /**
   * Add latest added todo to list of todos
   */
  handleUpdate = (cache, { data: { createTodo } }) => {
    const { todoes } = cache.readQuery({ query: GET_TODOS });

    cache.writeQuery({
      query: GET_TODOS,
      data: { todoes: [...todoes, createTodo] },
    });
  };

  handleSubmit = (createTodo) => async (e) => {
    e.preventDefault();

    await createTodo();
    await this.setState({
      title: '',
      description: '',
    });
  };

  render() {
    const { title, description } = this.state;

    return (
      <Mutation mutation={CREATE_TODO} variables={{ title, description }} update={this.handleUpdate}>
        {(createTodo, { loading }) => {
          return (
            <form className={css.form} onSubmit={this.handleSubmit(createTodo)}>
              <List>
                <ListItem>
                  <ListItemText>
                    <TextField
                      name="title"
                      label="Title"
                      value={title}
                      onChange={this.handleChange}
                      margin="normal"
                      disabled={loading}
                      required
                      fullWidth
                    />
                  </ListItemText>

                  <ListItemText>
                    <TextField
                      name="description"
                      label="Description"
                      value={description}
                      onChange={this.handleChange}
                      disabled={loading}
                      margin="normal"
                      required
                      fullWidth
                    />
                  </ListItemText>
                </ListItem>
              </List>

              <div className={css.form__controls}>
                <Button disabled={loading} type="submit" variant="fab" color="primary" aria-label="Add">
                  <AddIcon />
                </Button>
              </div>
            </form>
          );
        }}
      </Mutation>
    );
  }
}
