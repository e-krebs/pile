import Icons from '@e-krebs/react-library/icons.svg';
import { createRoot } from 'react-dom/client';

import { Page } from './Page';
import 'tailwind.css';

const container = document.getElementById('root');
if (container) {
  const service = container.getAttribute('service');
  const root = createRoot(container);

  root.render(
    <>
      <Icons />
      <Page serviceName={service} />
    </>,
  );
} else {
  console.error("couldn't find element with id 'root'");
}
