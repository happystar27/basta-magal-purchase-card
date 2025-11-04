import { BridgeHeader, ClaimInfo } from './components';
import { WalletProvider } from './contexts/WalletContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './components/ui/NotificationProvider';
import WallaneerEmailHandler from './components/ui/WallaneerEmailHandler';
import WalletModalCustomization from './components/ui/WalletModalCustomization';
import ThemeToggle from './components/ui/ThemeToggle';
import BastaImages from './components/ui/BastaImages';
import AnimeBackgroundEffects from './components/ui/AnimeBackgroundEffects';
import PoseCharacter from './components/ui/PoseCharacter';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <WalletProvider>
          <div className="flex overflow-hidden relative flex-col min-h-screen App">
          {/* Anime-style background effects */}
          <AnimeBackgroundEffects />
          
          {/* Decorative Basta Images */}
          <BastaImages />
          
          {/* Main content */}
          <main className="flex relative z-10 flex-grow justify-center items-center md:pt-0">
            <div className="max-w-[500px] w-full md:p-6 p-3 mx-auto">
              <PoseCharacter>
                <div className="">
                  <ClaimInfo />
                </div>
              </PoseCharacter>
            </div>
          </main>
          
          {/* Wallaneer Email Modal Handler */}
          <WallaneerEmailHandler />
          
          {/* Wallet Modal Customization */}
          <WalletModalCustomization />
          
        </div>
        </WalletProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
