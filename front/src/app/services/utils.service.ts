import { Injectable } from '@angular/core';
import { MinMax } from '../types/default';

interface DragOptions {
  element: HTMLElement;
  elementInner?: HTMLElement | null;

  dragHorizontal?: boolean;
  dragVertical?: boolean;

  limitHorizontal?: MinMax;
  limitVertical?: MinMax;

  stepsHorizontal?: number;
  stepsVertical?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  /*
  |--------------------------------------------------------------------------
  | WAIT FOR ELEMENT
  |--------------------------------------------------------------------------
  */

  waitForElm<T extends Element = HTMLElement>(
    selector: string
  ): Promise<T> {

    const existingElement = document.querySelector<T>(selector);

    if (existingElement) {
      return Promise.resolve(existingElement);
    }

    return new Promise((resolve) => {

      const observer = new MutationObserver(() => {

        const element = document.querySelector<T>(selector);

        if (!element) return;

        observer.disconnect();
        resolve(element);

      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

    });

  }


  /*
  |--------------------------------------------------------------------------
  | DRAG ELEMENT
  |--------------------------------------------------------------------------
  */

  dragElement(options: DragOptions): () => void {

    const {
      element,
      elementInner = null,

      dragHorizontal = true,
      dragVertical = true,

      limitHorizontal,
      limitVertical,

      stepsHorizontal,
      stepsVertical,
    } = options;

    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    let mouseOriginX = 0;
    let mouseOriginY = 0;


    const elementDrag = (event: MouseEvent) => {

      event.preventDefault();

      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;

      pos3 = event.clientX;
      pos4 = event.clientY;

      if (!mouseOriginX) mouseOriginX = event.clientX;
      if (!mouseOriginY) mouseOriginY = event.clientY;

      let newLeft = element.offsetLeft - pos1;
      let newTop = element.offsetTop - pos2;


      if (stepsHorizontal) {
        const mouseX = event.clientX - mouseOriginX;
        newLeft = Math.round(mouseX / stepsHorizontal) * stepsHorizontal;
      }

      if (stepsVertical) {
        const mouseY = event.clientY - mouseOriginY;
        newTop = Math.round(mouseY / stepsVertical) * stepsVertical;
      }


      newLeft = this.#applyLimit(newLeft, limitHorizontal);
      newTop = this.#applyLimit(newTop, limitVertical);


      if (dragHorizontal) {
        element.style.left = `${newLeft}px`;
      }

      if (dragVertical) {
        element.style.top = `${newTop}px`;
      }

    };


    const closeDragElement = () => {

      document.removeEventListener('mouseup', closeDragElement);
      document.removeEventListener('mousemove', elementDrag);

      mouseOriginX = 0;
      mouseOriginY = 0;

    };


    const dragMouseDown = (event: MouseEvent) => {

      event.preventDefault();

      pos3 = event.clientX;
      pos4 = event.clientY;

      document.addEventListener('mouseup', closeDragElement);
      document.addEventListener('mousemove', elementDrag);

    };


    const dragHandle = elementInner ?? element;

    dragHandle.addEventListener('mousedown', dragMouseDown);


    /*
    |--------------------------------------------------------------------------
    | RETURN CLEANUP FUNCTION (importantíssimo)
    |--------------------------------------------------------------------------
    */

    return () => {

      dragHandle.removeEventListener('mousedown', dragMouseDown);

      document.removeEventListener('mouseup', closeDragElement);
      document.removeEventListener('mousemove', elementDrag);

    };

  }


  /*
  |--------------------------------------------------------------------------
  | PRIVATE HELPERS
  |--------------------------------------------------------------------------
  */

  #applyLimit(value: number, limit?: MinMax): number {

    if (!limit) return value;

    if (limit.min !== undefined && value < limit.min) {
      return limit.min;
    }

    if (limit.max !== undefined && value > limit.max) {
      return limit.max;
    }

    return value;

  }

}