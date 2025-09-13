import * as React from 'react';
import '@mantine/core/styles.css';
import './App.css';
import { PortalProvider } from './shared/ui/Portal/context';
import { PortalTarget } from './shared/ui/Portal/PortalTarget';
import { PortalOutlet } from './shared/ui/Portal/PortalOutlet';

const OUTLET_NAME = 'outlet';

/**
 * Each of these components (A/B/C) represents a single step in a multi-step
 * questionnaire (wizard). The user fills the form step by step. On every step
 * we want to show the same "global" UI (e.g., progress indicator) rendered
 * into a local placeholder inside the current step via Portal.
 */
const A: React.FC = () => {
  return (
    <div className='component'>
      <h3>Component A</h3>
      {/* Local placeholder (Outlet) for global UI (progress, etc.) */}
      <PortalOutlet id={OUTLET_NAME} />
    </div>
  );
};

const B: React.FC = () => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // Simulate async loading for this step.
    // While loading, there is no Outlet rendered yet;
    // thus Portal cannot mount into this step until loaded becomes true.
    let timerId: ReturnType<typeof setTimeout> | null = null;

    if (!loaded) {
      timerId = setTimeout(() => setLoaded(true), 2000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [loaded]);

  if (!loaded) {
    // Loading screen of step B (no Outlet here yet).
    // PortalTarget will not find a registered outlet for this step.
    return (
      <div className='component'>
        <h3>Component B is loading</h3>
        <span>Loading</span>
      </div>
    );
  }

  // Once loaded, we finally render the Outlet and the PortalTarget
  // can attach the global UI here.
  return (
    <div className='component'>
      <h3>Component B is loaded</h3>
      <PortalOutlet id={OUTLET_NAME} />
    </div>
  );
};

const C: React.FC = () => {
  return (
    <div className='component'>
      <h3>Component C</h3>
      <PortalOutlet id={OUTLET_NAME} />
    </div>
  );
};

const VIEW_MAP = { A, B, C } as const;
type View = keyof typeof VIEW_MAP;

const App = () => {
  const [view, setView] = React.useState<View>('A');
  const Component = VIEW_MAP[view];

  return (
    // Provider holds the registry of available Outlets on the page
    // and exposes register/unregister functions.
    <PortalProvider>
      <div className='app'>
        <h2>View switcher (A / B / C)</h2>

        {/*Step navigation */}
        <div className='control'>
          <button onClick={() => setView('A')}>Show A</button>
          <button onClick={() => setView('B')}>Show B</button>
          <button onClick={() => setView('C')}>Show C</button>
        </div>

        {/* Render current step. Each step may (or may not) render an Outlet. */}
        <Component />

        {/* PortalTarget mounts the "shared" UI (e.g., progress indicator)
                into the currently registered Outlet with the given id. */}
        <PortalTarget outletId={OUTLET_NAME}>
          <span>view into name: {view}</span>
        </PortalTarget>
      </div>
    </PortalProvider>
  );
};

export default App;
