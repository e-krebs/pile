import { createRoot } from 'react-dom/client';

import { Page } from './Page';
import 'content/tailwind.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Page />);
} else {
  console.error("couldn't find element with id 'root'");
}
