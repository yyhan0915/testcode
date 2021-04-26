import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import ITopMenuData from 'src/model/top-menu-data.interface';
import TopMenu from '../TopMenu';

const menuListMock: ITopMenuData[] = [
    {
        id: 0,
        name: 'Item0',
        subItems: [
            { id: 0, name: 'SubMenu0' },
            { id: 1, name: 'SubMenu1' },
            { id: 2, name: 'SubMenu2' },
        ],
    },
    {
        id: 1,
        name: 'Item1',
        subItems: [
            { id: 0, name: 'SubMenu0' },
            { id: 1, name: 'SubMenu1' },
            { id: 2, name: 'SubMenu2' },
        ],
    },
    {
        id: 2,
        name: 'Item2',
        subItems: [
            { id: 0, name: 'SubMenu0' },
            { id: 1, name: 'SubMenu1' },
            { id: 2, name: 'SubMenu2' },
        ],
    },
    {
        id: 3,
        name: 'Item3',
    },
];

afterEach(cleanup);

describe('TopMenu component', () => {
    describe('User can see list of menu items', () => {
        it('should be rendered without crash', () => {
            const topMenu = render(<TopMenu />);
            expect(topMenu).toMatchSnapshot();
        });

        it('given menu list of items, it should has 4 menu items', async () => {
            const { getByTestId } = render(<TopMenu menuList={menuListMock} />);
            await waitFor(() => {
                expect(getByTestId('top-menu-component-test').children).toHaveLength(4);
            });
        });

        it('given menu list of items, first menu has 3 sub menus', async () => {
            const { getByTestId, findByTestId } = render(<TopMenu menuList={menuListMock} />);
            fireEvent.click(await findByTestId('top-menu-component-test-first-children'));

            await waitFor(() => {
                expect(getByTestId('drop-down-option-list-test-id').children).toHaveLength(3);
            });
        });
    });
});
