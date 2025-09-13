'use client';
import * as React from 'react';

import { usePortalManager } from './context';

type Props = { id: string; className?: string };

/** Возвращает точку, куда нужно смонтировать компонент из PortalTarget*/
export const PortalOutlet: React.FC<Props> = ({ id, className }) => {
  const { register } = usePortalManager();
  const tokenRef = React.useRef<symbol>(Symbol('outlet-token'));
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    /** Записываем токен и регистрируем элемент в мапе */
    const token = tokenRef.current;

    if (ref.current) {
      register(id, ref.current, token);
    }

    return () => {
      register(id, null, token);
    };
  }, [id, register]);

  return <div ref={ref} id={id} className={className} />;
};
