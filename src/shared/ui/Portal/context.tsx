import * as React from 'react';

type OutletId = string;
type Entry = { el: HTMLElement; token: symbol };
type Registry = Map<OutletId, Entry>;

type PortalContextValue = {
  registry: React.RefObject<Registry>;
  register: (id: OutletId, el: HTMLElement | null, token: symbol) => void;
  version: number;
};

const PortalContext = React.createContext<PortalContextValue | null>(null);

export const PortalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const registry = React.useRef<Registry>(new Map());
  const [version, setVersion] = React.useState(0);

  const register = React.useCallback((id: OutletId, el: HTMLElement | null, token: symbol) => {
    if (el) {
      registry.current.set(id, { el, token });
      setVersion((v) => v + 1);
      return;
    }

    const entry = registry.current.get(id);
    if (entry && entry.token === token) {
      registry.current.delete(id);
      setVersion((v) => v + 1);
    }
  }, []);

  const value = React.useMemo(() => ({ registry, register, version }), [register, version]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
};

export const usePortalManager = () => {
  const value = React.useContext(PortalContext);

  if (!value) {
    throw new Error('usePortalManager must be used within PortalProvider');
  }

  return value;
};
