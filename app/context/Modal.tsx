import React, { type ReactElement, type FunctionComponent } from "react";
import { useTheme } from "./Theme";
import { Modal as ModalComponent } from "~/components/Modal";
import { DiscordLogin } from "~/components/DiscordLogin";
import { BadgeViewer } from "~/components/BadgeViewer";
import { TxSuccess } from "~/templates/TxSuccess";
import { AddStellarAccount } from "~/templates/AddStellarAccount";
import { RemoveStellarAccount } from "~/templates/RemoveStellarAccount";
import { Settings } from '~/components/Settings';
import type { ModalProps } from "~/types";

export enum ModalTypeE {
  DISCORD_LOGIN = "discord_login",
  TX_SUCCESS = "tx_success",
  BADGE_VIEWER = "badge_viewer",
  ADD_ACCOUNT = "add_account",
  REMOVE_ACCOUNT = "remove_account",
  SETTINGS = "settings",
  PROFILE = "profile",
  CONFIRMATION = "confirmation",
  DELETE_ACCOUNT = "delete_account",
  NONE = "",
}

type ModalAction = {
    type: ModalTypeE;
    content?: any;
    onClose?: () => void;
  } & Omit<ModalProps, 'children' | 'initialState' | 'closeModal' | 'closable' | 'overlay' | 'theme' >;
  

type ModalProviderProps = { children: ReactElement };


type ModalContextType = {
  isOpen: boolean;
  openModal: (action: ModalAction) => void;
  afterClose?: () => void;
  closeModal: () => void;
};


const modalAssert = (action: { type: ModalTypeE; content?: any }) => {
  switch (action.type) {
    case ModalTypeE.TX_SUCCESS:
      return <TxSuccess content={action.content} />;
    case ModalTypeE.DISCORD_LOGIN:
      return <DiscordLogin />;
    case ModalTypeE.BADGE_VIEWER:
      return <BadgeViewer />;
    case ModalTypeE.ADD_ACCOUNT:
      return <AddStellarAccount network={action.content} />;
    case ModalTypeE.REMOVE_ACCOUNT:
      return <RemoveStellarAccount public_key={action.content} />;
    case ModalTypeE.SETTINGS:
      return <Settings />;
    default:
      return <></>;
  }
};

export const ModalContext = React.createContext<ModalContextType>(
  {
    isOpen: false,
    openModal: () => {}, // init empty functions
    afterClose: () => {}, 
    closeModal: () => {}, 
  }
);

export const ModalProvider: FunctionComponent<ModalProviderProps> = ({
  children,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [state, setState] = React.useState<ModalAction>({
    type: ModalTypeE.NONE,
    content: {},
    padding: "large",
    size: "medium",
    showBar: true,
    overflow: false,
    onClose: () => {},
  });

  const openModal = (action: ModalAction) => {
    setIsOpen(true);
    setState({
      type: action.type,
      content: action.content,
      onClose: action.onClose,
      padding: action.padding,
      size: action.size === undefined ? "medium" : action.size,
      showBar: action.showBar,
      overflow: action.overflow,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const afterClose = () => {
    const { onClose } = state;
    if (onClose) {
      onClose();
    }
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
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
