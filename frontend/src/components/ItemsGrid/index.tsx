import React from 'react';

import * as Types from '../../interfaces';

interface ItemsGrid {
  data: Types.Item[];
  selectedItems: number[];
  handleSelectItem: (id: number) => void;
}

export default function ItemsGrid({
  data,
  selectedItems,
  handleSelectItem,
}: ItemsGrid) {
  return (
    <ul className="items-grid">
      {data.map((item) => (
        <li
          key={item.id}
          className={selectedItems.includes(item.id) ? 'selected' : ''}
          onClick={() => handleSelectItem(item.id)}
        >
          <img src={item.image_url} alt={item.title} />
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
}
