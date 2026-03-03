import { useState, useEffect } from 'react';
import { X, Download, Share, PlusSquare, Smartphone } from 'lucide-react';
import styles from './InstallPrompt.module.css';

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Começa true para não piscar na tela
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Verifica se já está instalado (Standalone mode)
    const isAppStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(isAppStandalone);

    if (isAppStandalone) return;

    // 2. Verifica se o usuário já fechou esse aviso antes (não ser chato)
    const hasDismissed = localStorage.getItem('salaCerta_pwaDismissed');
    if (hasDismissed) return;

    // 3. Detecta se é um iPhone/iPad
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Se for iOS, mostramos o nosso banner customizado após 3 segundos
    if (isIosDevice) {
      setTimeout(() => setIsVisible(true), 3000);
    }

    // 4. Captura o evento nativo do Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Abre as instruções manuais para a Apple
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      // Dispara o prompt nativo do Android
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
          // --- TELA INICIAL DO BANNER ---
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
          // --- INSTRUÇÕES PARA IOS (SAFARI) ---
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