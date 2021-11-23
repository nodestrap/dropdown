// react:
import { default as React, useRef, useEffect, } from 'react'; // base technology of our nodestrap components
// cssfn:
import { 
// compositions:
composition, mainComposition, imports, 
// layouts:
layout, } from '@cssfn/cssfn'; // cssfn core
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
isTypeOf, setRef, } from '@nodestrap/utilities';
// nodestrap components:
import { Element, } from '@nodestrap/element';
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
export const usesDropdownElementLayout = () => {
    return composition([
        imports([
            // resets:
            stripoutFocusableElement(), // clear browser's default styles
        ]),
        layout({
            // customize:
            ...usesGeneralProps(usesPrefixedProps(cssProps, 'element')), // apply general cssProps starting with element***
        }),
    ]);
};
export const usesDropdownElement = () => {
    return composition([
        imports([
            // layouts:
            usesDropdownElementLayout(),
        ]),
    ]);
};
export const useDropdownElementSheet = createUseSheet(() => [
    mainComposition([
        imports([
            usesDropdownElement(),
        ]),
    ]),
]);
export const usesDropdownLayout = () => {
    return composition([
        imports([
            // layouts:
            usesCollapseLayout(),
        ]),
        layout({
            // customize:
            ...usesGeneralProps(cssProps), // apply general cssProps
        }),
    ]);
};
export const usesDropdownVariants = () => {
    // dependencies:
    // layouts:
    const [sizes] = usesSizeVariant((sizeName) => composition([
        layout({
            // overwrites propName = propName{SizeName}:
            ...overwriteProps(cssDecls, usesSuffixedProps(cssProps, sizeName)),
        }),
    ]));
    return composition([
        imports([
            // variants:
            usesCollapseVariants(),
            // layouts:
            sizes(),
        ]),
    ]);
};
export const usesDropdownStates = () => {
    return composition([
        imports([
            // states:
            usesCollapseStates(),
        ]),
    ]);
};
export const useDropdownSheet = createUseSheet(() => [
    mainComposition([
        imports([
            // layouts:
            usesDropdownLayout(),
            // variants:
            usesDropdownVariants(),
            // states:
            usesDropdownStates(),
        ]),
    ]),
]);
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
export function DropdownElement(props) {
    // styles:
    const sheet = useDropdownElementSheet();
    // rest props:
    const { 
    // accessibilities:
    tabIndex = -1, 
    // actions:
    onActiveChange, // not implemented
    ...restProps } = props;
    // jsx:
    return (<Element 
    // other props:
    {...restProps} 
    // accessibilities:
    {...{
        tabIndex,
    }} 
    // classes:
    mainClass={props.mainClass ?? sheet.main}/>);
}
export function Dropdown(props) {
    // styles:
    const sheet = useDropdownSheet();
    // rest props:
    const { 
    // essentials:
    elmRef, // moved to DropdownElement
    // accessibilities:
    active, // from accessibilities
    inheritActive, // from accessibilities
    tabIndex, // from Dropdown
    // popups:
    targetRef, popupPlacement = (((props.orientation ?? 'block') === 'block') ? 'bottom' : 'right'), popupModifiers, popupPosition, 
    // actions:
    onActiveChange, 
    // children:
    children, ...restProps } = props;
    // states:
    const activePassiveState = useActivePassiveState({ active, inheritActive: false });
    const isVisible = activePassiveState.active || (!!activePassiveState.class);
    // dom effects:
    const childRef = useRef(null);
    useEffect(() => {
        if (!isVisible)
            return; // dropdown is not shown        => nothing to do
        // setups:
        childRef.current?.focus({ preventScroll: true }); // when actived => focus the dropdown, so the user able to use [esc] key to close the dropdown
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
        document.addEventListener('click', handleClick);
        document.addEventListener('focus', handleFocus, { capture: true }); // force `focus` as bubbling
        // cleanups:
        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('focus', handleFocus, { capture: true });
        };
    }, [isVisible, targetRef]); // (re)run the setups & cleanups on every time the dropdown's visible & dropdown's target changes
    // jsx:
    return (<Collapse 
    // other props:
    {...restProps} 
    // semantics:
    semanticTag={props.semanticTag ?? [null]} semanticRole={props.semanticRole ?? 'dialog'} 
    // accessibilities:
    {...{
        active: activePassiveState.active,
        inheritActive: false,
    }} 
    // popups:
    {...{
        targetRef,
        popupPlacement,
        popupModifiers,
        popupPosition,
    }} 
    // variants:
    nude={props.nude ?? true} 
    // classes:
    mainClass={props.mainClass ?? sheet.main} 
    // events:
    // watch [escape key] on the whole Dropdown, including DropdownElement & DropdownElement's children:
    onKeyUp={(e) => {
            props.onKeyUp?.(e);
            if (!e.defaultPrevented) {
                if ((e.key === 'Escape') || (e.code === 'Escape')) {
                    if (onActiveChange) {
                        onActiveChange(false, 'shortcut');
                        e.preventDefault();
                    } // if
                } // if
            } // if
        }} onAnimationEnd={(e) => {
            props.onAnimationEnd?.(e);
            // states:
            activePassiveState.handleAnimationEnd(e);
        }}>
            {isTypeOf(children, DropdownElement)
            ?
                <children.type 
                // other props:
                {...children.props} 
                // essentials:
                elmRef={(elm) => {
                        setRef(children.props.elmRef, elm);
                        setRef(elmRef, elm);
                        setRef(childRef, elm);
                    }} 
                // accessibilities:
                tabIndex={tabIndex} 
                // events:
                onActiveChange={(newActive, closeType) => {
                        children.props.onActiveChange?.(newActive, closeType);
                        onActiveChange?.(newActive, closeType);
                    }}/>
            :
                <DropdownElement 
                // essentials:
                elmRef={(elm) => {
                        setRef(elmRef, elm);
                        setRef(childRef, elm);
                    }} 
                // accessibilities:
                tabIndex={tabIndex} 
                // events:
                onActiveChange={(newActive, closeType) => {
                        onActiveChange?.(newActive, closeType);
                    }}>
                    {children}
                </DropdownElement>}
        </Collapse>);
}
export { Dropdown as default };
