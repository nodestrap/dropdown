// react:
import { default as React, useRef, useEffect, } from 'react'; // base technology of our nodestrap components
// cssfn:
import { 
// compositions:
mainComposition, 
// styles:
style, imports, } from '@cssfn/cssfn'; // cssfn core
import { 
// hooks:
createUseSheet, } from '@cssfn/react-cssfn'; // cssfn for react
import { createCssConfig, 
// utilities:
usesGeneralProps, usesPrefixedProps, usesSuffixedProps, overwriteProps, } from '@cssfn/css-config'; // Stores & retrieves configuration using *css custom properties* (css variables)
// nodestrap utilities:
import { stripoutFocusableElement, } from '@nodestrap/stripouts';
import { 
// utilities:
setRef, } from '@nodestrap/utilities';
import { 
// hooks:
usesSizeVariant, } from '@nodestrap/basic';
import { 
// hooks:
useActivePassiveState, } from '@nodestrap/indicator';
import { 
// styles:
usesCollapseLayout, usesCollapseVariants, usesCollapseStates, Collapse, } from '@nodestrap/collapse';
// styles:
export const usesDropdownComponentLayout = () => {
    return style({
        ...imports([
            // resets:
            stripoutFocusableElement(), // clear browser's default styles
        ]),
        ...style({
            // customize:
            ...usesGeneralProps(usesPrefixedProps(cssProps, 'component')), // apply general cssProps starting with component***
        }),
    });
};
export const useDropdownComponentSheet = createUseSheet(() => [
    mainComposition(imports([
        // layouts:
        usesDropdownComponentLayout(),
    ])),
], /*sheetId :*/ '2m976iztxw'); // an unique salt for SSR support, ensures the server-side & client-side have the same generated class names
export const usesDropdownLayout = () => {
    return style({
        ...imports([
            // layouts:
            usesCollapseLayout(),
        ]),
        ...style({
            // layouts:
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            // sizes:
            inlineSize: 'fit-content',
            // customize:
            ...usesGeneralProps(cssProps), // apply general cssProps
        }),
    });
};
export const usesDropdownVariants = () => {
    // dependencies:
    // layouts:
    const [sizes] = usesSizeVariant((sizeName) => style({
        // overwrites propName = propName{SizeName}:
        ...overwriteProps(cssDecls, usesSuffixedProps(cssProps, sizeName)),
    }));
    return style({
        ...imports([
            // variants:
            usesCollapseVariants(),
            // layouts:
            sizes(),
        ]),
    });
};
export const usesDropdownStates = () => {
    return style({
        ...imports([
            // states:
            usesCollapseStates(),
        ]),
    });
};
export const useDropdownSheet = createUseSheet(() => [
    mainComposition(imports([
        // layouts:
        usesDropdownLayout(),
        // variants:
        usesDropdownVariants(),
        // states:
        usesDropdownStates(),
    ])),
], /*sheetId :*/ 'q723ad22au'); // an unique salt for SSR support, ensures the server-side & client-side have the same generated class names
// configs:
export const [cssProps, cssDecls, cssVals, cssConfig] = createCssConfig(() => {
    return {
        // backgrounds:
        boxShadow: [[0, 0, '10px', 'rgba(0,0,0,0.5)']],
    };
}, { prefix: 'ddwn' });
// utilities:
const isSelfOrDescendantOf = (element, desired) => {
    let parent = element;
    do {
        if (parent === desired)
            return true; // confirmed
        // let's try again:
        parent = parent.parentElement;
    } while (parent);
    return false; // not the descendant of desired
};
export function Dropdown(props) {
    // styles:
    const sheet = useDropdownSheet();
    // rest props:
    const { 
    // essentials:
    elmRef, // moved to DropdownComponent
    // accessibilities:
    active, // from accessibilities
    inheritActive, // from accessibilities
    tabIndex, // from Dropdown
    // popups:
    targetRef, popupPlacement = (((props.orientation ?? 'block') === 'block') ? 'bottom' : 'right'), popupMiddleware, popupStrategy, popupAutoFlip = true, popupAutoShift = true, 
    // actions:
    onActiveChange, 
    // children:
    children, ...restProps } = props;
    // verifies:
    React.Children.only(children);
    if (!React.isValidElement(children))
        throw Error('Invalid child element.');
    // states:
    const activePassiveState = useActivePassiveState({ active, inheritActive: false });
    const isVisible = activePassiveState.active || (!!activePassiveState.class);
    // dom effects:
    const childRef = useRef(null);
    useEffect(() => {
        if (!isVisible)
            return; // dropdown is not shown        => nothing to do
        // setups:
        const timeoutHandler = setTimeout(() => {
            childRef.current?.focus({ preventScroll: true }); // when actived => focus the dropdown, so the user able to use [esc] key to close the dropdown
        }, 100); // give a bit time for floating-ui to load
        // cleanups:
        return () => {
            clearTimeout(timeoutHandler);
        };
    }, [isVisible]); // (re)run the setups on every time the dropdown's visible changes
    /*
        because `onActiveChange` might be different every time the Dropdown is rendered,
        so, to avoid unnecessary setup (cleanup then setup again) of `useEffect`,
        the `onActiveChange` needs to be wrapped in `useRef` object.
    */
    const onActiveChangeRef = useRef(onActiveChange);
    onActiveChangeRef.current = onActiveChange;
    useEffect(() => {
        if (!isVisible)
            return; // dropdown is not shown        => nothing to do
        const onActiveChange = onActiveChangeRef.current;
        if (!onActiveChange)
            return; // [onActiveChange] was not set => nothing to do
        const handleClick = (e) => {
            if (e.button !== 0)
                return; // only handle left click
            // although clicking on page won't change the focus, but we decided this event as lost focus on dropdown:
            handleFocus({ target: e.target });
        };
        const handleFocus = (e) => {
            const focusedTarget = e.target;
            if (!focusedTarget)
                return;
            // check if focusedTarget is inside the dropdown or not:
            if ((focusedTarget instanceof HTMLElement) && childRef.current && isSelfOrDescendantOf(focusedTarget, childRef.current))
                return; // focus is still inside dropdown => nothing to do
            // `targetRef` is dropdown friend, so focus on `targetRef` is considered not to lost focus on dropdown:
            const target = (targetRef instanceof HTMLElement) ? targetRef : targetRef?.current;
            if ((focusedTarget instanceof HTMLElement) && target && isSelfOrDescendantOf(focusedTarget, target))
                return;
            // focus is outside of dropdown => dropdown lost focus => hide dropdown
            onActiveChange(false, 'blur');
        };
        // setups:
        const timeoutHandler = setTimeout(() => {
            document.addEventListener('click', handleClick);
            document.addEventListener('focus', handleFocus, { capture: true }); // force `focus` as bubbling
        }, 0);
        // cleanups:
        return () => {
            clearTimeout(timeoutHandler);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('focus', handleFocus, { capture: true });
        };
    }, [isVisible, targetRef]); // (re)run the setups & cleanups on every time the dropdown's visible & dropdown's target changes
    // jsx:
    const dropdownComponentRef = (elm) => {
        setRef(children.props.elmRef, elm);
        setRef(elmRef, elm);
        setRef(childRef, elm);
    };
    const dropdownComponentProps = {
        // essentials:
        ref: dropdownComponentRef,
        elmRef: dropdownComponentRef,
        // accessibilities:
        tabIndex: children.props.tabIndex ?? tabIndex,
        // events:
        onActiveChange: (newActive, closeType) => {
            children.props.onActiveChange?.(newActive, closeType);
            onActiveChange?.(newActive, closeType);
        },
    };
    switch (typeof (children.type)) {
        case 'string':
            delete dropdownComponentProps.elmRef;
            delete dropdownComponentProps.onActiveChange;
            break;
        case 'function':
            delete dropdownComponentProps.ref;
            break;
    } // switch
    const dropdownComponent = React.cloneElement(children, dropdownComponentProps);
    return (React.createElement(Collapse, { ...restProps, 
        // semantics:
        semanticTag: props.semanticTag ?? [null], semanticRole: props.semanticRole ?? 'dialog', ...{
            active: activePassiveState.active,
            inheritActive: false,
        }, 
        // popups:
        targetRef: targetRef, popupPlacement: popupPlacement, popupMiddleware: popupMiddleware, popupStrategy: popupStrategy, popupAutoFlip: popupAutoFlip, popupAutoShift: popupAutoShift, 
        // variants:
        nude: props.nude ?? true, 
        // classes:
        mainClass: props.mainClass ?? sheet.main, 
        // events:
        // watch [escape key] on the whole Dropdown, including DropdownComponent & DropdownComponent's children:
        onKeyUp: (e) => {
            props.onKeyUp?.(e);
            if (!e.defaultPrevented) {
                if ((e.key === 'Escape') || (e.code === 'Escape')) {
                    if (onActiveChange) {
                        onActiveChange(false, 'shortcut');
                        e.preventDefault();
                    } // if
                } // if
            } // if
        }, onAnimationEnd: (e) => {
            props.onAnimationEnd?.(e);
            // states:
            activePassiveState.handleAnimationEnd(e);
        } }, dropdownComponent));
}
export { Dropdown as default };
