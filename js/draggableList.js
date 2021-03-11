/**
 * Copyright (c) Mik BRY
 * mik@mikbry.com
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { repeat } from 'https://unpkg.com/lit-html/directives/repeat.js'
import { classMap } from 'https://unpkg.com/lit-html/directives/class-map.js'
import useDraggable from './useDraggable.js';

const DraggableList = ({ items, onChange }) => {
  const onDrop = (fromIndex, toIndex) => {
    onChange('move', fromIndex, toIndex);
  };
  const [startDrag, didDrag, draggedIndex, hoverIndex] = useDraggable(onDrop);
  const dragging = draggedIndex !== null;
  const prioritizing = draggedIndex > hoverIndex;
  return html`
    <div class='${classMap({'did-drag': didDrag})}'>
      ${repeat(items, (i) => i.id, (i, index) => {

        const classes = {
          nudged: dragging && hoverIndex !== null && index > hoverIndex - (prioritizing ? 1 : 0),
          dragged: draggedIndex === index,
        }

        return html`
          <div
            class='item ${classMap(classes)}'
            @mousedown='${startDrag}'
            @touchstart='${startDrag}'>
            ${i.title}
          </div>`
        }
      )}
    </div>`;
};

export default DraggableList;
