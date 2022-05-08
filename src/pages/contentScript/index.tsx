import { createRoot } from 'react-dom/client';

import { Page } from './Page';

const shadow = document.createElement('div');
shadow.attachShadow({ mode: 'open' });
document.body.appendChild(shadow);

if (shadow.shadowRoot) {
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL('content/tailwind.css');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  shadow.shadowRoot.appendChild(link);

  const container = document.createElement('div');
  shadow.shadowRoot.appendChild(container);

  const root = createRoot(container);
  root.render(<Page />);
}
