/**
 * Copyright (c) Mik BRY
 * mik@mikbry.com
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { repeat } from 'https://unpkg.com/lit-html/directives/repeat.js';
import { classMap } from 'https://unpkg.com/lit-html/directives/class-map.js';
import { useState } from 'https://unpkg.com/haunted/haunted.js';
import useDraggable from './useDraggable.js';

const DraggableList = ({ items, onChange }) => {
  const [drag, setDrag] = useState(null);
  const onDrop = (from, to) => {
    onChange('move', from, to);
    setDrag(null);
  };
  const onDrag = (from, to) => {
    console.log('onDrag', from, to);
    setDrag({ from, to });
  };
  const [startDrag] = useDraggable(onDrop, onDrag);
  return html`
    <div class='draggable-container ${classMap({ 'dragging': !!drag })}'>
      ${repeat(items, (i) => i.id, (i, index) => {
        const classes = {
          nudgedown: drag && index < drag.from && index >= drag.to,
          nudgeup: drag && index > drag.from && index <= drag.to,
          dragged:  drag && drag.from === index,
        }
        console.log('dragging', drag);
        return html`
          <div
            class='draggable-item ${classMap(classes)}'
            @mousedown='${startDrag}'
            @touchstart='${startDrag}'>
            ${i.title}
          </div>`
        }
      )}
    </div>`;
};

export default DraggableList;
