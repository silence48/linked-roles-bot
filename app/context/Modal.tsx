import React, { type ReactElement, type FunctionComponent } from 'react';
import { useTheme } from './Theme'
import { Modal as ModalComponent } from '../components/components';
import { Challenge } from '~/templates/Challenge';
import { TxSuccess } from '~/templates/TxSuccess';
type ModalProviderProps = { children: ReactElement }
type ModalContextType = {
  isOpen: boolean;
  openModal: (action: {
    type: string;
    content?: any;
    padding?: any;
    size?: any;
    showBar?: boolean;
    onClose?: () => void;
  }) => void;
  afterClose: () => void;
  closeModal: () => void;
};

enum ModalTypeE {

}

const modalAssert = (action: { type: string; content: any }) => {
  switch (action.type) {
    case 'challenge':
      return <Challenge content={action.content} />
    case 'tx_success':
      return <TxSuccess content={action.content} />
    default:
      return <></>;
  }
};

export const ModalContext = React.createContext<ModalContextType>(
  {} as ModalContextType
);

export const ModalProvider: FunctionComponent<ModalProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = React.useState(false);
  const [state, setState] = React.useState({
    type: '',
    content: {},
    onClose: () => {},
    padding: '',
    size: '',
    showBar: true,
    overflow: false
  });

  const openModal = (action: {
    type: string;
    content?: any;
    padding?: any;
    size?: any;
    showBar?: any;
    overflow?: any;
    onClose?: any;
  }) => {
    setIsOpen(true);
    setState({
      type: action.type,
      content: action.content,
      onClose: action.onClose,
      padding: action.padding && action.padding,
      size: action.size && action.size,
      showBar: action.showBar,
      overflow: action.overflow,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const afterClose = () => {
    const { onClose } = state;
    onClose();
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, afterClose }}
    >
      {children}
      <ModalComponent
        initialState={isOpen}
        closeModal={closeModal}
        theme={theme}
        padding={state.padding}
        size={state.size}
        showBar={state.showBar}
        overflow={state.overflow}
      >
        {modalAssert(state)}
      </ModalComponent>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  return React.useContext(ModalContext);
};
