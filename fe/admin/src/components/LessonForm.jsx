import React from 'react';

const LessonForm = ({ lesson, onSubmit, onCancel }) => {
  const [title, setTitle] = React.useState(lesson ? lesson.title : '');
  const [description, setDescription] = React.useState(
    lesson ? lesson.description : ''
  );
  const [grade, setGrade] = React.useState(lesson ? lesson.grade : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, grade });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="block font-bold mb-2">
          Tiêu đề
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block font-bold mb-2">
          Mô tả
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="grade" className="block font-bold mb-2">
          Lớp
        </label>
        <input
          type="text"
          id="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default LessonForm;
