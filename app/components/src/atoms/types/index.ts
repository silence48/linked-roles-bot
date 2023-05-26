export type itemsNavigationProps = {
    text: string;
    type: 'button' | 'link' | 'action';
    icon: string;
    action?: () => void;
    to?: string;
  }[];

export type HeaderProps = {
    userNavigation: any;
    component: React.ElementType;
    menu: React.ReactNode;
    network: string;
    communityMenu: React.ReactNode;
    updateTheme: () => void;
    session: boolean;
    connect: () => void;
    openSearch: () => void;
    importWallet: () => void;
    logOut: () => void;
  };
