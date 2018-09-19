import React, { Component } from 'react';
import 'antd/dist/antd.css';
import store from './store';
import { getInputChangeAction, getAddItemAction, getDeleteItemAction ,initListAction} from './store/actionCreators';
import TodoListUI from './TodoListUI';
import axios from 'axios';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    this.handleChange = this.handleChange.bind(this);
    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleItemDelete = this.handleItemDelete.bind(this);
    store.subscribe(this.handleStoreChange);
  }
  render() {
    return (
      <TodoListUI
        inputValue={this.state.inputValue}
        handleChange={this.handleChange}
        handleClick={this.handleClick}
        list={this.state.list}
        handleItemDelete={this.handleItemDelete}
      />
    )
  }
  componentDidMount() {
    axios.get('/list.json').then((res)=>{
      const data = res.data;
      const action = initListAction(data);
      store.dispatch(action);
    }).catch((err)=>{
      console.log(err);
    })
  }
  handleChange(e) {
    const action = getInputChangeAction(e.target.value);
    store.dispatch(action);
  }
  handleStoreChange() {
    this.setState(store.getState());
  }
  handleClick() {
    const action = getAddItemAction();
    store.dispatch(action);
  }
  handleItemDelete(index) {
    const action = getDeleteItemAction(index);
    store.dispatch(action);
  }
}

export default TodoList;