export default interface ITopMenuData {
    id: number;
    name: string;
    subItems?: ISubMenu[];
}

export interface ISubMenu {
    id: number;
    name: string;
}
