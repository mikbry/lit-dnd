/**
 * Copyright (c) Mik BRY
 * mik@mikbry.com
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useCallback, useState, useEffect } from 'https://unpkg.com/haunted/haunted.js';

const moveEvent = 'mousemove';
const upEvent = 'mouseup';
const getClientY = (e) => e.clientY;
const getPageY = (e) => e.pageY;

let hoverIndex = null;
const setHoverIndex = (index) => {
  hoverIndex = index;
};

const useDraggable = (onDrop = () => { }) => {
  const [didDrag, setDidDrag] = useState(false);
  const [dragged, setDragged] = useState(null);

  const moveItem = (item, containerY, itemMouseOffset, pageY) => {
    const itemAbsoluteTop = pageY - containerY;
    item.style.top = `${itemAbsoluteTop - itemMouseOffset}px`;

    const index = Math.max(Math.floor(itemAbsoluteTop / 48), 0);
    setHoverIndex(index);
    console.log('move Item', item.style.top, dragged, index);
  };

  const onMoveListener = useCallback((event) => {
    if (dragged) {
      const { item, containerY, itemMouseOffset } = dragged;
      moveItem(item, containerY, itemMouseOffset, getPageY(event));
      if (!didDrag) {
        setDidDrag(true);
      }
    }
  },[dragged, hoverIndex, didDrag]);

  const onUpListener = useCallback(() => {
    const { item, index } = dragged;
    console.log('stop drag', index, hoverIndex);
    setDragged(null);
  }, [dragged, hoverIndex]);

  useEffect(() => {
    if (dragged) {
      console.log('dragged changed', dragged);
      dragged.item.style.position = 'absolute';
      dragged.item.style.zIndex = 2;
      document.addEventListener(moveEvent, onMoveListener);
      dragged.item.addEventListener(upEvent, onUpListener);
    }
    
    return () => {
      console.log('dragged remove', dragged, didDrag, hoverIndex);
      if (dragged) {
        const { item, index } = dragged;
        document.removeEventListener(moveEvent, onMoveListener);
        item.removeEventListener(upEvent, onUpListener);
        onDrop(index, hoverIndex, didDrag);
        item.removeAttribute('style');
        setDidDrag(false);
        setHoverIndex(null);
      }
    }
  }, [dragged]);

  const startDrag = (event) => {
    event.preventDefault();
    console.log('startDrag');
    const item = event.target;
    const parent = item.parentNode;
    const containerY = parent.getBoundingClientRect().top + window.scrollY;
    const itemMouseOffset = getClientY(event) - item.getBoundingClientRect().top;
    const index = Array.from(parent.children).indexOf(item);
    setDragged({ index, item, containerY, itemMouseOffset });
    moveItem(item, containerY, itemMouseOffset, getPageY(event));
  };

  return [startDrag, didDrag, dragged ? dragged.index : dragged, hoverIndex];
};

export default useDraggable;
