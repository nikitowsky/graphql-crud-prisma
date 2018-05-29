import React, { Component } from 'react';

import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

class App extends Component {
  render() {
    return (
      <div>
        <TodoList />
        <AddTodoForm />
      </div>
    );
  }
}

export default App;
