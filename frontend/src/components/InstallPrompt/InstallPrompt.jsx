import { useState, useEffect } from 'react';
import { X, Download, Share, PlusSquare, Smartphone } from 'lucide-react';
import styles from './InstallPrompt.module.css';

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); 
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const isAppStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(isAppStandalone);

    if (isAppStandalone) return;

    const hasDismissed = localStorage.getItem('salaCerta_pwaDismissed');
    if (hasDismissed) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // MUDANÇA AQUI: De 3000 para 1000 milissegundos (1 segundo) para o iOS
    if (isIosDevice) {
      setTimeout(() => setIsVisible(true), 1000);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // MUDANÇA AQUI: De 3000 para 1000 milissegundos (1 segundo) para o Android
      setTimeout(() => setIsVisible(true), 1000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('salaCerta_pwaDismissed', 'true');
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.promptCard}>
        <button onClick={handleDismiss} className={styles.closeButton}>
          <X size={20} color="#888" />
        </button>

        {!showIOSInstructions ? (
          <div className={styles.content}>
            <div className={styles.iconCircle}>
              <Smartphone size={28} color="#111" />
            </div>
            <div className={styles.textContainer}>
              <h3>Instale o Sala Certa</h3>
              <p>Adicione à tela inicial para acesso offline e mais rápido.</p>
            </div>
            <button onClick={handleInstallClick} className={styles.installButton}>
              <Download size={18} /> Instalar
            </button>
          </div>
        ) : (
          <div className={styles.iosInstructions}>
            <h3>Instalar no iPhone</h3>
            <p>A Apple exige instalação manual. Siga os passos:</p>
            <ol>
              <li>
                Toque no ícone de Compartilhar <Share size={16} style={{ display: 'inline', margin: '0 4px', color: '#007aff' }} /> na barra inferior do Safari.
              </li>
              <li>
                Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare size={16} style={{ display: 'inline', margin: '0 4px' }} />.
              </li>
              <li>Confirme clicando em "Adicionar" no topo.</li>
            </ol>
            <button onClick={handleDismiss} className={styles.btnGotIt}>
              Entendi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}