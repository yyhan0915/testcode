import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import usePortal from '../../hook/usePortal';

interface IProps {
    id: string;
    children: ReactNode;
}

const Portal: React.FC<IProps> = ({ id, children }) => {
    const target = usePortal(id);
    return createPortal(children, target);
};

export default Portal;
