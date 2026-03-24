import { Injectable } from '@angular/core';

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
      dragVertical = true
    }:
    {
      element: any,
      elementInner?: any,
      dragHorizontal?: boolean,
      dragVertical?: boolean
    }
  ) {
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function elementDrag(e: any) {
      console.log("🚀 ~ Template1Component ~ elementDrag ~ e:", e)
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      if (dragVertical) element.style.top = (element.offsetTop - pos2) + "px";
      if (dragHorizontal) element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function dragMouseDown(e: any) {
      console.log("🚀 ~ Template1Component ~ dragMouseDown ~ e:", e)
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
