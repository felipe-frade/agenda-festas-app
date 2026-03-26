import { Injectable } from '@angular/core';
import { MinMax } from '../types/default';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  waitForElm(selector: any) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  dragElement(
    {
      element,
      elementInner = null,
      dragHorizontal = true,
      dragVertical = true,
      limitHorizontal,
      limitVertical,
      stepsHorizontal,
      stepsVertical,
    }:
    {
      element: any,
      elementInner?: any,
      dragHorizontal?: boolean,
      dragVertical?: boolean,
      limitHorizontal?: MinMax,
      limitVertical?: MinMax,
      stepsHorizontal?: number,
      stepsVertical?: number,
    }
  ) {
    let mouseOriginX = 0;
    let mouseOriginY = 0;

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      mouseOriginX = 0;
      mouseOriginY = 0;
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();

      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      if (mouseOriginX === 0) mouseOriginX = e.clientX;
      if (mouseOriginY === 0) mouseOriginY = e.clientY;

      let mouseX = e.clientX - mouseOriginX;
      let mouseY = e.clientY - mouseOriginY;

      // set the element's new position:
      let newLeft = (element.offsetLeft - pos1);
      let newTop = (element.offsetTop - pos2);

      if (stepsHorizontal) {
        newLeft = +((mouseX / stepsHorizontal).toFixed(0)) * stepsHorizontal;
      }

      if (stepsVertical) {
        newTop = +((mouseY / stepsVertical).toFixed(0)) * stepsVertical;
      }

      if (limitHorizontal?.min !== undefined && newLeft < limitHorizontal?.min) newLeft = limitHorizontal?.min;
      if (limitHorizontal?.max !== undefined && newLeft > limitHorizontal?.max) newLeft = limitHorizontal?.max;
      
      if (limitVertical?.min !== undefined && newTop < limitVertical?.min) newTop = limitVertical?.min;
      if (limitVertical?.max !== undefined && newTop > limitVertical?.max) newTop = limitVertical?.max;

      if (dragHorizontal) element.style.left =  `${newLeft}px`;
      if (dragVertical) element.style.top =  `${newTop}px`;
    }

    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (elementInner) {
      // if present, the header is where you move the DIV from:
      elementInner.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      element.onmousedown = dragMouseDown;
    }
  }

}
