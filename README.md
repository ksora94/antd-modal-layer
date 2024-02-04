# antd-modal-layer
An easy way to create antd modal. (using [react-simple-layer](https://github.com/ksora94/react-simple-layer))

The traditional way to create a modal with antd:
```typescript jsx
import React, {useState} from 'react';
import {Modal} from 'antd';

const App = () => {
  const [modalShown, setModalShown] = useState(false);
  
  function showModal() { setModalShown(true); }
  
  function hideModal() { setModalShown(false); }
  
  return (
      <div>
        <button onClick={showModal}>Show Modal</button>
        <Modal
            title="Basic Modal"
            visible={modalShown}
            onOk={hideModal}
            onCancel={hideModal}
        >
          <h2>Hello world!</h2>
        </Modal>
      </div>
  )
}
```

With `antd-modal-layer`, it would be:
```typescript jsx
import createModal from 'antd-modal-layer';

const App = () => {
  function showModal() {
    createModal(() => {
      return <h2>Hello world!</h2>
    }, {
      title: 'Basic Modal'
    }).render();
  }
  
  return (
      <div>
        <button onClick={showModal}>Show Modal</button>
      </div>
  )
}
```

## Install

```bash
npm install antd-modal-layer
```

## Parameters
- `Component: ForwardRefRenderFunction<LayerModalRef, LayerModalProps<P>>`: A modal child component definition. It's a function that returns a React component. The function receives two parameters: `props` and `ref`. props are the properties passed to the modal component and ref is a reference object that contains two optional methods: `onCancel` and `onOk`.
- `defaultModalProps?: ModalProps`: The default properties of the modal. It's the same as the properties of the antd modal component.
-  `root?: HTMLElement | string`: The root HTML node. If a string is provided, it will attempt to find an element in the document with that string as its ID. If no element is found, or if `root` is not provided, a new div element will be created with its ID set to 'layer-root'.

## Return Value
Same as [react-simple-layer](https://github.com/ksora94/react-simple-layer)

## Example

### Pass props to the modal child component

```typescript jsx
import createModal from 'antd-modal-layer';

interface ModalProps {
  content: string
}

function createPropsModal() {
  return createModal<ModalProps>((props) => {
    return <h2>{props.content}</h2>
  }, {
    title: 'Props modal'
  })
}

createPropsModal().render({
  content: 'Hello, World!'
});
```

### Use ref to handle modal callbacks

```typescript jsx
import {useImperativeHandle} from 'react';
import createModal from 'antd-modal-layer';

interface ModalProps {
  content: string
  onSuccess: () => void,
  onCancel: () => void
}

function createRefModal() {
  return createModal<ModalProps>((props, ref) => {
    useImperativeHandle(ref, () => ({
      onCancel: props.onCancel,
      onOk() {
        return submitSomeData().then(() => {
          props.onSuccess();
        })
      }
    }))

    return <h2>{props.content}</h2>
  }, {
    title: 'Ref modal'
  })
}

createRefModal().render({
  content: 'Hello, World!',
  onSuccess() {
    console.log('Success');
  },
  onCancel() {
    console.log('Cancel');
  }
});
```
### Use antd form in the modal

```typescript jsx
import createModal from 'antd-modal-layer';
import {useImperativeHandle} from 'react';
import {Form, Input} from 'antd';

interface ModalProps {
  content: string
  onSuccess: () => void,
  onCancel: () => void
}

function createFormModal() {
  return createModal<ModalProps>((props, ref) => {
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
      onCancel: props.onCancel,
      onOk() {
        return form.validateFields().then((values) => {
          return submitSomeData(values).then(() => {
            props.onSuccess();
          })
        })
      }
    }))

    useEffect(() => {
      form.setFieldsValue({
        content: props.content
      })
    }, []);

    return (
        <Form form={form}>
          <Form.Item name="content" rules={[{required: true}]}>
            <Input />
          </Form.Item>
        </Form>
    )
  }, {
    title: 'Form modal'
  })
}

createFormModal().render({
  content: 'Hello, World!',
  onSuccess() {
    console.log('Success');
  },
  onCancel() {
    console.log('Cancel');
  }
});
```
