import React from 'react';

const ContentBlock = ({ type, title, children }) => {
  const colors = {
    'Giới thiệu': 'teal',
    Video: 'red',
    'Nội dung': 'blue',
    'Tương tác': 'orange',
    'Kiểm tra': 'green',
  };

  const borderColor = colors[type] || 'gray';

  return (
    <div className={`border-l-4 border-${borderColor}-500 pl-4 mb-8`}>
      <h2 className={`text-2xl font-bold text-${borderColor}-500 mb-4`}>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default ContentBlock;
