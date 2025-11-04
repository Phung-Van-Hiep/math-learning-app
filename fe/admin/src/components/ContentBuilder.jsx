import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialContent = [
  { id: '1', type: 'Giới thiệu', title: 'Giới thiệu bài học' },
  { id: '2', type: 'Video', title: 'Video bài giảng' },
  { id: '3', type: 'Nội dung', title: 'Lý thuyết' },
];

const ContentBuilder = () => {
  const [content, setContent] = useState(initialContent);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(content);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setContent(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="content">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {content.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-4 mb-4 border rounded-lg bg-white shadow"
                  >
                    <span className="font-bold">{item.type}:</span> {item.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ContentBuilder;
