import * as React from 'react';
import '@mantine/core/styles.css';
import './App.css';
import { Portal } from '@mantine/core';

const OUTLET_NAME = 'outlet';

const useMountLog = (name: string) => {
  React.useLayoutEffect(() => {
    console.log(`[${name}] mounted`);
    return () => console.log(`[${name}] unmounted`);
  }, [name]);

  React.useEffect(() => {
    console.log(`[${name}] passive effect`);
    return () => console.log(`[${name}] passive cleanup`);
  }, [name]);
};

const A: React.FC = () => {
  useMountLog('A');
  return (
    <div className='component'>
      <h3>Component A</h3>
      <div id={OUTLET_NAME} />
    </div>
  );
};

const B: React.FC = () => {
  useMountLog('B');
  return (
    <div className='component'>
      <h3>Component B</h3>
      <div id={OUTLET_NAME} />
    </div>
  );
};

const C: React.FC = () => {
  useMountLog('C');
  return (
    <div className='component'>
      <h3>Component C</h3>
      <div id={OUTLET_NAME} />
    </div>
  );
};

type View = 'A' | 'B' | 'C';

const VIEW_MAP: Record<View, React.FC> = {
  A,
  B,
  C,
};

const App = () => {
  const [view, setView] = React.useState<View>('A');
  const Component = VIEW_MAP[view];

  return (
    <div className='app'>
      <h2>View switcher (A / B / C)</h2>
      <div className='control'>
        <button onClick={() => setView('A')}>Show A</button>
        <button onClick={() => setView('B')}>Show B</button>
        <button onClick={() => setView('C')}>Show C</button>
      </div>
      <Component />
      <Portal target={`#${OUTLET_NAME}`}>
        <span>view name: {view}</span>
      </Portal>
    </div>
  );
};

export default App;
