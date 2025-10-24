import { Header, BridgeHeader, ClaimInfo } from './components';
import BackgroundVideo from './components/layout/BackgroundVideo';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './components/ui/NotificationProvider';
import WallaneerEmailHandler from './components/ui/WallaneerEmailHandler';
import WalletModalCustomization from './components/ui/WalletModalCustomization';

function App() {
  return (
    <NotificationProvider>
      <WalletProvider>
        <div className="App relative min-h-screen flex flex-col overflow-hidden">
          {/* Background */}
          {/* <BackgroundVideo /> */}

          {/* Main content */}
          <main className="flex-grow flex items-center justify-center md:pt-0 relative z-10">
            <div className="max-w-[500px] w-full md:p-6 p-3 mx-auto">
              <BridgeHeader />
              <div className="mt-6">
                <ClaimInfo />
              </div>
            </div>
          </main>

          {/* Fixed header */}
          <Header />
          
          {/* Wallaneer Email Modal Handler */}
          <WallaneerEmailHandler />
          
          {/* Wallet Modal Customization */}
          <WalletModalCustomization />
        </div>
      </WalletProvider>
    </NotificationProvider>
  );
}

export default App;
