import React, {ForwardRefRenderFunction, useCallback, useRef, useState} from 'react';
import createLayer, {LayerComponentProps} from 'react-simple-layer';
import {ModalProps} from 'antd/es/modal';
import {Modal} from 'antd';

export type LayerModalProps<P> = LayerComponentProps<{
  /**
   * Close the modal.
   * This method is different from destroying the modal. After calling, the modal will be destroyed after the closing animation is completed.
   */
  closeModal(): void
} & P>

export type LayerModalRef = {
  /**
   * Callback when the "cancel button" of the modal is clicked.
   */
  onCancel?(): void,
  /**
   * Callback when the "confirm button" of the modal is clicked.
   * If the return value is a Promise, the modal will not be destroyed until the Promise is resolved.
   */
  onOk?(): Promise<any> | void
}

/**
 * Create a modal layer
 * @param Component modal child component definition
 * @param defaultModalProps antd Modal props
 * @param root Root html node，default is #layer-root
 */
export default function createModal<P>(
    Component: ForwardRefRenderFunction<LayerModalRef, LayerModalProps<P>>,
    defaultModalProps?: ModalProps,
    root?: HTMLElement | string
) {
  const ForwardComponent = React.forwardRef<LayerModalRef, LayerModalProps<P>>(Component);

  return createLayer<P>(props => {
    const [visible, setVisible] = useState(true);
    const [okLoading, setOkLoading] = useState(false);
    const ref = useRef<LayerModalRef>({
      onCancel() {
      },
      onOk() {
      }
    });

    const handleCancel = useCallback((e) => {
      setVisible(false);
      defaultModalProps?.onCancel && defaultModalProps.onCancel(e);
      ref.current.onCancel && ref.current.onCancel();
    }, []);

    const handleOk = useCallback(e => {
      setOkLoading(true);
      Promise.resolve(ref.current.onOk && ref.current.onOk()).then(() => {
        setOkLoading(false);
        setVisible(false);
        defaultModalProps?.onOk && defaultModalProps.onOk(e);
      }, () => {
        setOkLoading(false);
      })
    }, []);

    const closeModal = useCallback(() => {
      setVisible(false);
    }, [])

    return (
        <Modal
            open={visible}
            afterClose={props.layer!.destroy}
            destroyOnClose={true}
            onCancel={handleCancel}
            onOk={handleOk}
            okButtonProps={{loading: okLoading}}
            {...defaultModalProps}
        >
          <ForwardComponent {...(props as any)} ref={ref} closeModal={closeModal}/>
        </Modal>
    );
  }, root);
}
