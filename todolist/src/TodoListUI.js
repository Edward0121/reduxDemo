import React, { Component } from 'react';
import { Input, Button, List } from 'antd';
//无状态组件：性能比较高（因为他就是一个函数，class是一个类，
//类还有一些生命周期函数，要执行的东西多，所以一个普通组件的性能，肯定不如无状态组件的）
const TodoListUI = (props) => {
  return (
    <div>
        <div style={{ marginTop: '10px', marginLeft: '10px' }}>
          <Input
            value={props.inputValue}
            placeholder='listInfo'
            style={{ width: '300px', marginRight: '10px' }}
            onChange={props.handleChange}
          />
          <Button type="primary" onClick={props.handleClick}>提交</Button>
          <List
            style={{ marginTop: '20px', width: '300px' }}
            bordered
            dataSource={props.list}
            renderItem={(item, index) => (<List.Item onClick={() => {props.handleItemDelete(index)}}>{item}</List.Item>)}
          />
        </div>
      </div>
  )
}
// class TodoListUI extends Component {
//   render() {
//     return (
//       <div>
//         <div style={{ marginTop: '10px', marginLeft: '10px' }}>
//           <Input
//             value={this.props.inputValue}
//             placeholder='listInfo'
//             style={{ width: '300px', marginRight: '10px' }}
//             onChange={this.props.handleChange}
//           />
//           <Button type="primary" onClick={this.props.handleClick}>提交</Button>
//           <List
//             style={{ marginTop: '20px', width: '300px' }}
//             bordered
//             dataSource={this.props.list}
//             renderItem={(item, index) => (<List.Item onClick={(index) => {this.props.handleItemDelete(index)}}>{item}</List.Item>)}
//           />
//         </div>
//       </div>
//     )
//   }
// }
export default TodoListUI;