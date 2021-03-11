/**
 * Copyright (c) Mik BRY
 * mik@mikbry.com
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useState, useEffect } from 'https://unpkg.com/haunted/haunted.js';

const moveEvent = 'mousemove';
const upEvent = 'mouseup';
const getClientY = (e) => e.clientY;
const getPageY = (e) => e.pageY;

let hoverIndex = null;
const setHoverIndex = (index) => {
  hoverIndex = index;
};

const useDraggable = (onDrop = () => { }, onDrag = () => {}) => {
  const [dragged, setDragged] = useState(null);

  const moveItem = ({ index, item, startY, containerY, itemMouseOffset }, pageY) => {
    const transformY = pageY - startY;
    item.style.transform = `translateY(${transformY}px)`;

    const absoluteY = pageY - containerY - itemMouseOffset;
    let current = 0;
    let height = 0;
    const children = [...item.parentNode.children];
    children.find((child, ic) => {
      height += child.offsetHeight;
      if (absoluteY < height - (child.offsetHeight / 2) || ic === children.length - 1) {
        current = ic;
        return true;
      }
      return false;
    });
    if (hoverIndex !== current) {
      setHoverIndex(current);
      onDrag(index, hoverIndex);
    }
  };

  const onMoveListener = (event) => {
    if (dragged) {
      moveItem(dragged, getPageY(event));
    }
  };

  const onUpListener = () => {
    const { item, index } = dragged;
    console.log('stop drag', index, hoverIndex);
    setDragged(null);
  };

  useEffect(() => {
    if (dragged) {
      console.log('dragged changed', dragged);
      dragged.item.style.zIndex = 2;
      document.addEventListener(moveEvent, onMoveListener);
      dragged.item.addEventListener(upEvent, onUpListener);
    }
    
    return () => {
      console.log('dragged remove', dragged, hoverIndex);
      if (dragged) {
        const { item, index } = dragged;
        document.removeEventListener(moveEvent, onMoveListener);
        item.removeEventListener(upEvent, onUpListener);

        const onTransitionEnd = () => {
          onDrop(index, hoverIndex);
          setHoverIndex(null);
          item.removeAttribute('style');
          item.removeEventListener('transitionend', onTransitionEnd)
        }
        item.addEventListener('transitionend', onTransitionEnd)
  
        // TODO real calc
        const finalTransformY = (hoverIndex - index) * 48
        item.style.transition = 'transform 0.1s ease-out';
        item.style.transform = `translate3d(0, ${finalTransformY}px, 0)`;
      }
    }
  }, [dragged]);

  const startDrag = (event) => {
    event.preventDefault();
    console.log('startDrag');
    const item = event.target;
    const parent = item.parentNode;
    const startY = getPageY(event);
    const containerY = parent.getBoundingClientRect().top + window.scrollY;
    const itemMouseOffset = getClientY(event) - item.getBoundingClientRect().top;
    const index = Array.from(parent.children).indexOf(item);
    const drag = { index, item, startY, containerY, itemMouseOffset };
    setDragged(drag);
    moveItem(drag, getPageY(event));
  };

  return [startDrag];
};

export default useDraggable;
