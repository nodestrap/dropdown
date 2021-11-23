/// <reference types="react" />
import { ElementProps } from '@nodestrap/element';
import { PopupPlacement, PopupModifier, PopupPosition, OrientationName, OrientationVariant, CollapseProps } from '@nodestrap/collapse';
export declare const usesDropdownElementLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesDropdownElement: () => import("@cssfn/cssfn").StyleCollection;
export declare const useDropdownElementSheet: import("@cssfn/types").Factory<import("jss").Classes<"main">>;
export declare const usesDropdownLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesDropdownVariants: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesDropdownStates: () => import("@cssfn/cssfn").StyleCollection;
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
export interface DropdownElementProps<TElement extends HTMLElement = HTMLElement, TCloseType = DropdownCloseType> extends DropdownAction<TCloseType>, ElementProps<TElement> {
    tabIndex?: number;
}
export declare function DropdownElement<TElement extends HTMLElement = HTMLElement, TCloseType = DropdownCloseType>(props: DropdownElementProps<TElement, TCloseType>): JSX.Element;
export interface DropdownProps<TElement extends HTMLElement = HTMLElement, TCloseType = DropdownCloseType> extends CollapseProps<TElement>, DropdownElementProps<TElement, TCloseType> {
}
export declare function Dropdown<TElement extends HTMLElement = HTMLElement, TCloseType = DropdownCloseType>(props: DropdownProps<TElement, TCloseType>): JSX.Element;
export { Dropdown as default };
export type { OrientationName, OrientationVariant };
export type { PopupPlacement, PopupModifier, PopupPosition };
