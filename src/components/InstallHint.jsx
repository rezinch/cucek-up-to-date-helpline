import React, { useEffect, useState } from 'react';
import './InstallHint.css';

function InstallHint() {
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check once on mount if the hint was previously dismissed
  useEffect(() => {
    const iOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(iOS);
    const stored = localStorage.getItem('installHintDismissed') === 'true';
    setDismissed(stored);
  }, []);

  // Hide component if not iOS or if user dismissed it
  if (!isIOS || dismissed) return null;

  const handleClose = () => {
    setDismissed(true);
    localStorage.setItem('installHintDismissed', 'true');
  };

  return (
    <div className="install-hint">
      <button className="install-hint-close" onClick={handleClose} aria-label="Close hint">
        &times;
      </button>
      <p>
        <strong>Tap the Share button</strong> (the square with an upward arrow) in Safari and select <em>Add to Home Screen</em> to install this app.
      </p>
    </div>
  );
}

export default InstallHint;
