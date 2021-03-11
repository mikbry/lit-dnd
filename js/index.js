/**
 * Copyright (c) Mik BRY
 * mik@mikbry.com
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { html } from 'https://unpkg.com/lit-html/lit-html.js';
import { component, useState } from 'https://unpkg.com/haunted/haunted.js';
import DraggableList from './draggableList.js';

const initialList = [
  {id: 'abc', title: 'Remember You At All'},
  {id: 'def', title: 'YEAH RIGHT'},
  {id: 'ghi', title: 'Speaking Terms'},
  {id: 'jkl', title: 'Cool with You'},
  {id: 'mno', title: 'Complaint Department'},
  {id: 'pqr', title: 'Dream Fortress'},
  {id: 'stu', title: 'Alter Ego'},
];

const App = () => {
  const [items, setItems] = useState(initialList);

  const onChange = (action, fromIndex, toIndex) => {
    const newItems = [...items];
    newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, items[fromIndex]);
    console.log('onChange', action, fromIndex, toIndex, items, newItems);
    setItems(newItems);
  }

  return html`
    <style>
      :host {
        display: block;
        position: relative;
      }
      .item {
        position: relative;
        height: 48px;
        width: 100%;
        display: grid;
        align-items: center;
        box-sizing: border-box;
        padding-left: 18px;
        user-select: none;

        transition: none;
        z-index: 1;

        border-bottom: 1px solid gray;
        background: white;
        font-family: sans-serif;
      }
      .item.nudged:not(.dragged) {
        transform: translate3d(0, 48px, 0);
      }
      .item.dragged {
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
      }
      .did-drag > .item {
        transition: transform 0.2s ease-out;
      }
    </style>
    ${DraggableList({ items, onChange })}
  `;
};
customElements.define('dnd-app', component(App));
