# Mantine Portal dynamic target behavior

## Issue description

When using `@mantine/core` `Portal`, the portal does not move its content to a new container if the `target` prop changes dynamically for the same instance.

Instead, `Portal` looks up the DOM node and updates its internal ref in an effect, but since this does not trigger a re-render, the portal continues rendering into the **old** container until the component is fully remounted (for example, by changing `key`).

## Minimal reproduction

```tsx
import * as React from 'react';
import { Portal } from '@mantine/core';

const OUTLET_NAME = 'outlet';

const A = () => <div><h3>A</h3><div id={OUTLET_NAME} /></div>;
const B = () => <div><h3>B</h3><div id={OUTLET_NAME} /></div>;
const C = () => <div><h3>C</h3><div id={OUTLET_NAME} /></div>;

const VIEW_MAP = { A, B, C };

export default function App() {
  const [view, setView] = React.useState<'A' | 'B' | 'C'>('A');
  const Component = VIEW_MAP[view];

  return (
    <div>
      <button onClick={() => setView('A')}>Show A</button>
      <button onClick={() => setView('B')}>Show B</button>
      <button onClick={() => setView('C')}>Show C</button>
      <Component />
      <Portal target={`#${OUTLET_NAME}`}>
        <span>view name: {view}</span>
      </Portal>
    </div>
  );
}
```

Steps to reproduce:
1. Render component A with `<div id="outlet" />` and a `<Portal target="#outlet" />`.
2. Switch to component B or C (they also have `<div id="outlet" />`).
3. Portal content stays in the **previous outlet** instead of moving to the new one.

## Expected behavior

It would be useful if either:

1. `Portal` supported dynamically following the new `target`, **or**
2. Documentation explicitly stated that `target` is **not reactive** within the same instance and that a remount (e.g. with `key`) is required to move the portal.

## Proposal

Add a note to the documentation explaining this behavior:

- `target` is stored in a ref and updated inside an effect.
- Changing `target` does not trigger a re-render.
- If you need to move the portal, you must remount the `Portal` (for example, by using `key`).

## Workarounds

- Force remount with `key={someId}` when the outlet changes.
- Wrap Mantine `Portal` and trigger a state update on `target` change.
- Use a custom portal built on top of `ReactDOM.createPortal` that always renders into the current target.
****