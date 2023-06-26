import React from 'react';
import { Layout } from './Layout';

type ConnectWalletProps = {};

export const ConnectWallet: React.FC<ConnectWalletProps> = ({}) => {

  return (
    
    <div
      style={{
        backgroundImage: "url('https://imagedelivery.net/uDbEDRBQqhBXrrfuCRrATQ/cb3fca94-6358-47a3-6150-a10d0d7e1100/public')",
        backgroundSize: 'cover',
        height: '100vh',
        width: '100%'
      }}
    >
        <Layout>
          <div
            className="flex items-center h-screen"
          >
            <div
              className="bg-neutral-100 rounded-md p-[20px] w-full "
            >
              <div className="flex flex-col">
                <div className="flex flex-row w-full">
                  <div className="flex-1">
                    <div>Wallet Connect</div>
                    <div>Scan the QR with your phone from a wallet app</div>
                    <div>
                      
                    </div>
                  </div>
                  <div className="flex-1">
                    <div>Extensions</div>

                  </div>
                </div>
                <div>
                  <div>By Continue you accept our term of conditioons and our privacy policy</div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
    </div>
  );
};
