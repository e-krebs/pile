import ReactDOM from 'react-dom';

import { Page } from './Page';
import 'content/tailwind.css';

const root = document.getElementById('root');
const service = root?.getAttribute('service');

ReactDOM.render(
  <Page serviceName={service} />,
  root
);
