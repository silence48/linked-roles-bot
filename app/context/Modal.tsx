import React, { type ReactElement, type FunctionComponent } from "react";
import { useTheme } from "./Theme";
import { Modal as ModalComponent } from "~/components/Modal";
import { DiscordLogin } from '~/components/DiscordLogin';
import { StellarAccounts } from '~/components/StellarAccounts';
import { BadgeViewer } from '~/components/BadgeViewer';
import { TxSuccess } from "~/templates/TxSuccess";
type ModalProviderProps = { children: ReactElement };
type ModalContextType = {
  isOpen: boolean;
  openModal: (action: {
    type: string;
    content?: any;
    padding?: "large" | "medium" | "small" | "none";
    size?: "large" | "medium" | "small" | "fit";
    showBar?: boolean;
    onClose?: () => void;
  }) => void;
  afterClose: () => void;
  closeModal: () => void;
};

enum ModalTypeE {
  DISCORD_LOGIN = "discord_login",
  TX_SUCCESS = "tx_success",
  STELLAR_ACCOUNTS = "stellar_accounts",
  ACCOUNT_HANDLER = "account_handler",
}

const modalAssert = (action: { type: string; content: any }) => {
  switch (action.type) {
    case ModalTypeE.TX_SUCCESS:
      return <TxSuccess content={action.content} />;
    case ModalTypeE.DISCORD_LOGIN:
      return <DiscordLogin />;
    case ModalTypeE.STELLAR_ACCOUNTS:
        return <StellarAccounts />;
    default:
      return <></>;
  }
};

export const ModalContext = React.createContext<ModalContextType>(
  {} as ModalContextType
);

export const ModalProvider: FunctionComponent<ModalProviderProps> = ({
  children,
}) => {
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = React.useState(false);
  const [state, setState] = React.useState({
    type: "",
    content: {},
    onClose: () => {},
    padding: "large",
    size: "medium",
    showBar: true,
    overflow: false,
  });

  const openModal = (action: {
    type: string;
    content?: any;
    padding?: any;
    size?: "large" | "medium" | "small" | "fit" ;
    showBar?: any;
    overflow?: any;
    onClose?: any;
  }) => {
    setIsOpen(true);
    setState({
      type: action.type,
      content: action.content,
      onClose: action.onClose,
      padding: action.padding,
      size: action.size === undefined ? 'medium' : action.size,
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
