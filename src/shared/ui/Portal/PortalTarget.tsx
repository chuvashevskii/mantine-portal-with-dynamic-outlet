'use client';
import * as React from 'react';

import Portal from './Portal';
import { usePortalManager } from './context';

type Props = { outletId: string; children: React.ReactNode };

/** Оборачивает нужный компонент, который будет монтирован в PortalOutlet */
export const PortalTarget: React.FC<Props> = ({ outletId, children }) => {
  const { registry, version } = usePortalManager();
  const [forceKey, setForcePortalKey] = React.useState(0);
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    /** Получаем с мапы registry нужную точку входа и проверяем наличие элемента, если он есть, то записываем его в target и для обновление PortalTarget обновляем forceKey потому что в мантине target устанавливает в useRef, без forceKey ререндера не будет*/

    const entry = registry.current.get(outletId);

    if (entry) {
      setTarget(entry.el);
      setForcePortalKey((k) => k + 1);
    }
  }, [outletId, registry, version]);

  if (!target) {
    return null;
  }

  return (
    <Portal key={forceKey} target={target}>
      {children}
    </Portal>
  );
};
