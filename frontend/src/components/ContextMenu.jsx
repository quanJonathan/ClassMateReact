import React from 'react';

const ContextMenu = ({ isVisible, top, left, onEdit, onDelete }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div style={{ position: 'absolute', top, left, border: '1px solid #ccc', background: '#fff' }}>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        <li style={{ padding: '8px', cursor: 'pointer' }} onClick={onEdit}>
          Edit
        </li>
        <li style={{ padding: '8px', cursor: 'pointer' }} onClick={onDelete}>
          Delete
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;