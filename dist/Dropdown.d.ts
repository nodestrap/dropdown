/// <reference types="react" />
import { ElementProps } from '@nodestrap/element';
import { PopupPlacement, PopupMiddleware, PopupStrategy, OrientationName, OrientationVariant, CollapseProps } from '@nodestrap/collapse';
export declare const usesDropdownComponentLayout: () => import("@cssfn/cssfn").Rule;
export declare const useDropdownComponentSheet: import("@cssfn/types").Factory<import("jss").Classes<"main">>;
export declare const usesDropdownLayout: () => import("@cssfn/cssfn").Rule;
export declare const usesDropdownVariants: () => import("@cssfn/cssfn").Rule;
export declare const usesDropdownStates: () => import("@cssfn/cssfn").Rule;
export declare const useDropdownSheet: import("@cssfn/types").Factory<import("jss").Classes<"main">>;
export declare const cssProps: import("@cssfn/css-config").Refs<{
    boxShadow: (string | number)[][];
}>, cssDecls: import("@cssfn/css-config").Decls<{
    boxShadow: (string | number)[][];
}>, cssVals: import("@cssfn/css-config").Vals<{
    boxShadow: (string | number)[][];
}>, cssConfig: import("@cssfn/css-config").CssConfigSettings;
export declare type DropdownCloseType = 'shortcut' | 'blur';
export interface DropdownAction<TCloseType = DropdownCloseType> {
    onActiveChange?: (newActive: boolean, arg?: TCloseType) => void;
}
export interface DropdownComponentProps<TElement extends HTMLElement = HTMLElement, TCloseType = DropdownCloseType> extends DropdownAction<TCloseType>, Pick<ElementProps<TElement>, 'elmRef'> {
    tabIndex?: number;
}
export interface DropdownProps<TElement extends HTMLElement = HTMLElement, TCloseType = DropdownCloseType> extends CollapseProps<TElement>, DropdownComponentProps<TElement, TCloseType> {
}
export declare function Dropdown<TElement extends HTMLElement = HTMLElement, TCloseType = DropdownCloseType>(props: DropdownProps<TElement, TCloseType>): JSX.Element;
export { Dropdown as default };
export type { OrientationName, OrientationVariant };
export type { PopupPlacement, PopupMiddleware, PopupStrategy };
