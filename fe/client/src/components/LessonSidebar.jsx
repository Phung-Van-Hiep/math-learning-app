import React from 'react';

const LessonSidebar = ({ content, currentSection, onSectionClick }) => {
  return (
    <aside className="w-64 p-4 border-r">
      <h3 className="text-xl font-bold mb-4">Mục lục</h3>
      <ul>
        {content.map((item, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => onSectionClick(index)}
              className={`w-full text-left p-2 rounded ${
                index === currentSection
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default LessonSidebar;
