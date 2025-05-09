import Icons from '@e-krebs/react-library/icons.svg';
import { createRoot } from 'react-dom/client';

import inline from 'tailwind.css?inline';

import { Page } from './Page';

const shadow = document.createElement('div');
shadow.attachShadow({ mode: 'open' });
document.body.appendChild(shadow);

if (shadow.shadowRoot) {
  const link = document.createElement('style');
  link.textContent = inline;
  shadow.shadowRoot.appendChild(link);

  const cssSize = document.defaultView?.getComputedStyle(document.body).getPropertyValue('font-size');
  if (cssSize && cssSize.endsWith('px')) {
    const size = parseFloat(cssSize.substring(0, cssSize.length - 2));
    const cssZoom = document.createElement('style');
    cssZoom.textContent = `:host { zoom: calc(16 / ${size}) }`;
    shadow.shadowRoot.appendChild(cssZoom);
  }

  const container = document.createElement('div');
  shadow.shadowRoot.appendChild(container);

  const root = createRoot(container);
  root.render(
    <>
      <Icons />
      <Page />
    </>,
  );
}
