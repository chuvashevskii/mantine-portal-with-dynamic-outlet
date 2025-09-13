import * as React from 'react';

import { usePortalManager } from './context';

type Props = { id: string; className?: string };

/**
 * PortalOutlet is a local mount point on a step.
 * On mount it registers its DOM node in the central registry with a unique token,
 * and on unmount it unregisters the node (only if the token matches).
 * This allows PortalTarget to find where to render shared UI for the current step.
 */
export const PortalOutlet: React.FC<Props> = ({ id, className }) => {
  const { register } = usePortalManager();
  const tokenRef = React.useRef<symbol>(Symbol('outlet-token'));
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const token = tokenRef.current;

    if (ref.current) {
      // Register the physical DOM node for this outlet id
      register(id, ref.current, token);
    }

    return () => {
      // Unregister only if this exact outlet instance is being removed
      register(id, null, token);
    };
  }, [id, register]);

  return <div ref={ref} id={id} className={className} />;
};
