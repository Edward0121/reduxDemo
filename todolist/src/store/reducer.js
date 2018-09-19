import {CHANGE_INPUT_VALUE,ADD_TODO_ITEM,DELETE_LIST_ITEM} from './actionTypes';

const defaultState = {
  inputValue: '',
  list: []
};

//注：reducer可以接收state但是绝不能修改state，这就是我们为什么要拷贝一个新的state
export default (state = defaultState, action) => {
  if (action.type === CHANGE_INPUT_VALUE) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.inputValue = action.value;
    return newState;//返回给store
  }
  if (action.type === ADD_TODO_ITEM) {
    const newState = JSON.parse(JSON.stringify(state));
    if(newState.inputValue === ""){
      return;
    }
    newState.list.push(newState.inputValue);
    newState.inputValue = '';
    return newState;
  }
  if (action.type === DELETE_LIST_ITEM) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.list.splice(action.index, 1);
    return newState;
  }
  return state;
}