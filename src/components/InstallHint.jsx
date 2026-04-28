import React, { useEffect, useState } from 'react';
import './InstallHint.css';

function InstallHint() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const iOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(iOS);
  }, []);

  if (!isIOS) return null;

  return (
    <div className="install-hint">
      <p>
        <strong>Tap the Share button</strong> (the square with an upward arrow) in Safari and select <em>Add to Home Screen</em> to install this app.
      </p>
    </div>
  );
}

export default InstallHint;
