import { Modal } from 'antd';

const ModalWrapper = ({ open, onClose, title, children, footer, width = 520 }) => (
  <Modal
    open={open}
    onCancel={onClose}
    title={title}
    footer={footer}
    width={width}
    centered
    destroyOnClose
  >
    {children}
  </Modal>
);

export default ModalWrapper;
