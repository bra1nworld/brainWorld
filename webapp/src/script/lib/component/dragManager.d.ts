export declare class DragManager {
    listenerEvents: string[];
    capture: boolean;
    behavior: DragManager.Behavior;
    lifeCircle: DragManager.LifeCircle;
    minMovement: 0;
    lastEvent: MouseEvent;
    bodyDraggingClass: string;
    shadow: DragManager.ShadowManager;
    constructor();
    initialize(): void;
    attachListeners(): void;
    detachListeners(): void;
}
export declare namespace DragManager {
    class LifeCircle extends Leaf.States<"waitMouseDown" | "waitInitMouseMove" | "handleInitMove" | "waitMouseContinue" | "handleMouseUp", {
        mouse: MouseEvent;
    }> {
        readonly dragManager: DragManager;
        protected data: {
            initMouseDown: MouseEvent;
            initMoveEvent: MouseEvent;
            finalUpEvent: MouseEvent;
        };
        constructor(dragManager: DragManager);
        init(): void;
        reset(): void;
        atWaitMouseDown(): void;
        atWaitInitMouseMove(): void;
        atHandleInitMove(): void;
        atWaitMouseContinue(): void;
        atHandleMouseUp(): void;
    }
    class MouseEventHelper {
        static computeRelativeMousePosition(el: HTMLElement, e: MouseEvent): {
            x: number;
            y: number;
        };
        static getMouseSrc(e: Event): HTMLElement | null;
        static isElementDraggable(el: DragManager.DraggableElement): boolean;
        static isElementDragless(el: DragManager.DraggableElement): boolean;
        static getDefaultShadow(el: any): HTMLDivElement;
        static getMousePosition(e: MouseEvent): {
            x: number;
            y: number;
        };
        static getMouseDistance(e1: MouseEvent, e2: MouseEvent): number;
        static getDraggable(e: Event): HTMLElement;
        static createCustomEvent(name: string, data: any): CustomEvent;
    }
    class Behavior {
        readonly dragManager: DragManager;
        currentDraggable: DraggableElement;
        draggingElement: DraggableElement;
        dragSession: DragManager.Session;
        constructor(dragManager: DragManager);
        clearDrag(): void;
        dragStart(e: MouseEvent): boolean;
        dragMove(e: MouseEvent): void;
        drop(e: MouseEvent): void;
    }
    class ShadowManager {
        readonly dragManager: DragManager;
        constructor(dragManager: DragManager);
        draggingShadow: HTMLElement;
        dragFix: {
            x: number;
            y: number;
        };
        savedStyle: {
            opacity: string;
            transition: string;
        };
        savedElement: DraggableElement;
        shadowScale: number;
        shadowZIndex: number;
        setShadowElement(el: HTMLElement, fix?: {
            x: number;
            y: number;
        }): void;
        updateShadowPosition(): void;
        setDraggingStyle(): void;
        clear(): void;
        restoreDraggingStyle(): void;
    }
    interface Protocol {
        type: string;
        data: any;
    }
    class Session {
        readonly dragManager: DragManager;
        protocols: Protocol[];
        protocol: Protocol;
        isConsumed: boolean;
        constructor(dragManager: DragManager);
        add(p: Protocol): void;
        consume(): void;
    }
    interface DraggableElement extends HTMLElement {
        dragBehavior?: "auto" | "none";
        dragSupport?: "disabled" | "enabled";
    }
    const instance: DragManager;
}
