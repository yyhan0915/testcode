import clsx from 'clsx';
import React, { CSSProperties, ReactNode, useRef, useState } from 'react';
import { ISubMenu } from 'src/model/top-menu-data.interface';
import styled from 'styled-components';
import Portal from '../common/Portal';

const MenuButtonBlock = styled.div`
    padding: 16px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: 104px;

    cursor: pointer;

    &.selected {
        background-color: #1d1e20;
    }
`;

const DropDownOptionListBlock = styled.div`
    position: absolute;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    background-color: '#fff';
    box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.15);
`;

const DropDownOptionBlock = styled.div`
    background-color: #fff;
    height: 32;
    display: flex;
    justify-content: space-between;
    padding: 10px 16px;
    font-size: 13;
    font-weight: 400;
    border-radius: 4px 4px 0px 0px;
    cursor: pointer;

    &:last-of-type {
        border-radius: 0px 0px 4px 4px;
    }

    &:hover {
        background-color: #b4b4b4;
    }
`;

interface IProps {
    children: ReactNode;
    subItems: ISubMenu[];
    defaultValue?: string;
    style?: CSSProperties;
    onSelect: () => void;
    isOpen: boolean;
}

const MenuButton: React.FC<IProps> = ({ children, style, onSelect, subItems, isOpen, ...props }) => {
    const menuRef = useRef(null);
    const [coords, setCoords] = useState({ left: 0, top: 0 });

    return (
        <MenuButtonBlock
            ref={menuRef}
            onClick={() => {
                const rect = menuRef.current.getBoundingClientRect();
                setCoords({
                    left: rect.x,
                    top: rect.y + window.scrollY + rect.height + 4,
                });
                onSelect();
            }}
            style={style}
            className={clsx([isOpen && 'selected'])}
            {...props}
        >
            {children}
            {isOpen && (
                <Portal id="root">
                    <DropDownOptionListBlock
                        className="drop-down-option-list"
                        data-testid="drop-down-option-list-test-id"
                        style={{
                            position: 'absolute',
                            width: `${menuRef.current.width + 100}`,
                            top: coords.top,
                            left: coords.left,
                        }}
                    >
                        {subItems.map((option: ISubMenu, index: number) => (
                            <DropDownOptionBlock
                                className={clsx(['drop-down-option'])}
                                key={index}
                                onClick={() => {
                                    onSelect();
                                }}
                            >
                                {option.name}
                            </DropDownOptionBlock>
                        ))}
                    </DropDownOptionListBlock>
                </Portal>
            )}
        </MenuButtonBlock>
    );
};

export default MenuButton;
