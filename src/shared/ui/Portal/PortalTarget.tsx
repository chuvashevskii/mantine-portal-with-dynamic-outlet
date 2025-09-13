import * as React from 'react';

import Portal from './Portal'; // : Mantine Portal (or wrapper)
import { usePortalManager } from './context';

type Props = { outletId: string; children: React.ReactNode };

/**
 * PortalTarget renders its children into a registered Outlet with the given id.
 * It watches the registry version: when an Outlet registers/unregisters or moves,
 * PortalTarget picks the new DOM node and forces a remount of the Portal to ensure
 * correct cleanup and re-attachment.
 */
export const PortalTarget: React.FC<Props> = ({ outletId, children }) => {
  const { registry, version } = usePortalManager();

  // Store current DOM node target; if it changes we update and force a remount.
  const [node, setNode] = React.useState<HTMLElement | null>(null);
  const [forceKey, setForcePortalKey] = React.useState(0);
  const prevNodeRef = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    // Read the latest entry for the outlet id on each version change.
    const entry = registry.current.get(outletId) ?? null;
    const nextNode = entry?.el ?? null;

    // If the physical DOM node changed, update state and bump a key
    // to fully remount the underlying <Portal>.
    if (prevNodeRef.current !== nextNode) {
      prevNodeRef.current = nextNode;
      setNode(nextNode);
      setForcePortalKey((k) => k + 1);
    }
  }, [outletId, version, registry]);

  if (!node) {
    // No registered outlet yet (e.g., step B while loading) – render nothing.
    return null;
  }

  // Remount on node change ensures Mantine Portal re-initializes its container.
  return (
    <Portal key={forceKey} target={node}>
      {children}
    </Portal>
  );
};
