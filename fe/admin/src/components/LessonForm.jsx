import React from 'react';

const LessonForm = ({ lesson, onSubmit, onCancel }) => {
  const [title, setTitle] = React.useState(lesson ? lesson.title : '');
  const [section_type, setSectionType] = React.useState(lesson ? lesson.section_type : 'video');
  const [content_html, setContentHtml] = React.useState(lesson ? lesson.content_html : '');
  const [order, setOrder] = React.useState(lesson ? lesson.order : 0);
  const [geogebra_embed, setGeogebraEmbed] = React.useState(lesson ? lesson.geogebra_embed : '');
  const [is_published, setIsPublished] = React.useState(lesson ? lesson.is_published : false);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, section_type, content_html, order, geogebra_embed, is_published });
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
        <label htmlFor="section_type" className="block font-bold mb-2">
          Loại
        </label>
        <select
          id="section_type"
          value={section_type}
          onChange={(e) => setSectionType(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="video">Video</option>
          <option value="text">Text</option>
          <option value="geogebra">GeoGebra</option>
          <option value="test">Test</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="content_html" className="block font-bold mb-2">
          Nội dung HTML
        </label>
        <textarea
          id="content_html"
          value={content_html}
          onChange={(e) => setContentHtml(e.target.value)}
          className="w-full border rounded p-2"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="order" className="block font-bold mb-2">
          Thứ tự
        </label>
        <input
          type="number"
          id="order"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="geogebra_embed" className="block font-bold mb-2">
          GeoGebra Embed
        </label>
        <input
          type="text"
          id="geogebra_embed"
          value={geogebra_embed}
          onChange={(e) => setGeogebraEmbed(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="is_published" className="block font-bold mb-2">
          Xuất bản
        </label>
        <input
          type="checkbox"
          id="is_published"
          checked={is_published}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="border rounded p-2"
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
