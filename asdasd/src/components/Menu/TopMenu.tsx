import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAxios } from 'src/hook/useAxios';
import styled from 'styled-components';
import { Skeleton } from '@material-ui/lab';
import ITopMenuData from 'src/model/top-menu-data.interface';
import MenuButton from './MenuButton';
import withErrorBoundary from 'src/hook/withErrorBoundary';
import { CSSPositionType } from 'src/model/css-position.enum';

interface ITopMenuProps {
    position?: keyof typeof CSSPositionType;
}

const TopMenuBlock = styled.div<ITopMenuProps>`
    position: ${props => (props.position ? props.position : 'fixed')};
    top: 0;
    width: 100vw;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 32px;
    background-color: #2d323e;
    color: white;
`;

/**
 * @param {ITopMenuData[]} menuList : this props is for when we pass menuList via props, not data fetching from the component itself
 */

interface IProps {
    className?: string;
    position?: keyof typeof CSSPositionType;
    menuList?: ITopMenuData[];
}

const TopMenu: React.FC<IProps> = ({ className, position, menuList }) => {
    const { data, isLoading } = useAxios<ITopMenuData[]>('http://www.mocky.io/v2/5d3fec2b33000062009d27bc');
    const [triggers, setTriggers] = useState([]);
    const wrapperRef = useRef<HTMLDivElement>();

    const triggerHandler = useCallback(index => {
        setTriggers(prev => prev.map((trigger, triggerIndex) => (triggerIndex === index ? !trigger : false)));
    }, []);

    const menuItemList = menuList ?? data;

    useEffect(() => {
        setTriggers(Array.isArray(data) ? new Array(data.length).fill(false) : []);
    }, [data]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef && !wrapperRef.current.contains(event.target as Node)) {
                setTriggers(Array.isArray(data) ? new Array(data.length).fill(false) : []);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [data]);

    if (isLoading) {
        return <Skeleton animation="wave" width="100%" height={64} />;
    }

    return (
        <TopMenuBlock className={className} ref={wrapperRef} position={position} data-testid="top-menu-component-test">
            {Array.isArray(menuItemList)
                ? menuItemList.map((element, dataIndex) => (
                      <MenuButton
                          key={element?.id ?? dataIndex}
                          subItems={element?.subItems || []}
                          isOpen={triggers[dataIndex]}
                          onSelect={() => triggerHandler(dataIndex)}
                          data-testid={dataIndex === 0 ? 'top-menu-component-test-first-children' : undefined}
                      >
                          {element?.name}
                      </MenuButton>
                  ))
                : null}
        </TopMenuBlock>
    );
};

export default withErrorBoundary(TopMenu);
