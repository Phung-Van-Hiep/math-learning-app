import React, { useState, useEffect } from 'react';
import geogebraService from '../services/geogebraService';
import './Geogebra.css'; // <--- Import CSS

const GeoGebraManagement = ({ lesson, onClose }) => {
  const [figures, setFigures] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'editor'
  
  // Editor State
  const [editorTitle, setEditorTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editorBase64, setEditorBase64] = useState('');
  const [loading, setLoading] = useState(false);

  const containerId = 'ggb-editor-canvas';

  useEffect(() => { fetchFigures(); }, [lesson.id]);

  const fetchFigures = async () => {
    const data = await geogebraService.getByLesson(lesson.id);
    setFigures(data);
  };

  // Init Editor
  useEffect(() => {
    if (view === 'editor') {
      setTimeout(() => {
        if (!window.GGBApplet) return;
        const applet = new window.GGBApplet({
          appName: "geometry", width: 800, height: 600,
          showToolBar: true, showAlgebraInput: true, showMenuBar: true,
          ggbBase64: editorBase64 || "", language: "vi"
        }, true);
        applet.inject(containerId);
      }, 100);
    }
  }, [view, editorBase64]);

  const handleSave = () => {
    if (!editorTitle.trim()) return alert("Vui lòng nhập tiêu đề!");
    setLoading(true);
    window.ggbApplet.getBase64(async (base64) => {
      const payload = { title: editorTitle, lesson_id: lesson.id, ggb_base64: base64, width: 800, height: 600, show_toolbar: true };
      try {
        editingId ? await geogebraService.update(editingId, payload) 
                  : await geogebraService.create(payload);
        alert("Thành công!");
        setView('list');
        fetchFigures();
      } catch (e) { alert("Lỗi khi lưu!"); } 
      finally { setLoading(false); }
    });
  };

  const handleAddNew = () => {
    setEditingId(null); setEditorTitle(''); setEditorBase64(''); setView('editor');
  };

  const handleEdit = (fig) => {
    setEditingId(fig.id); setEditorTitle(fig.title); setEditorBase64(fig.ggb_base64); setView('editor');
  };

  const handleDelete = async (id) => {
    if (confirm("Xóa hình này?")) {
      await geogebraService.delete(id);
      fetchFigures();
    }
  };

  // --- RENDER: EDITOR VIEW ---
  if (view === 'editor') {
    return (
      <div className="ggb-modal-content size-lg">
        <div className="ggb-modal-header">
          <h2>{editingId ? 'Chỉnh sửa hình vẽ' : 'Tạo hình vẽ mới'}</h2>
          <button className="ggb-close-btn" onClick={() => setView('list')}>×</button>
        </div>

        <div className="ggb-modal-body">
          <div className="ggb-form-group">
            <label className="ggb-label">Tiêu đề hình vẽ <span style={{color:'red'}}>*</span></label>
            <input 
              type="text" 
              className="ggb-input"
              value={editorTitle}
              onChange={(e) => setEditorTitle(e.target.value)}
              placeholder="Ví dụ: Hình chóp S.ABCD..."
            />
          </div>
          <div className="ggb-editor-container">
            <div id={containerId}></div>
          </div>
        </div>

        <div className="ggb-modal-footer">
          <button className="ggb-btn ggb-btn-secondary" onClick={() => setView('list')} disabled={loading}>Hủy bỏ</button>
          <button className="ggb-btn ggb-btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu hình vẽ"}
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: LIST VIEW ---
  return (
    <div className="ggb-modal-content size-md">
      <div className="ggb-modal-header">
        <h2>Quản lý hình học: {lesson.title}</h2>
        <button className="ggb-close-btn" onClick={onClose}>×</button>
      </div>

      <div className="ggb-modal-body">
        <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'1rem'}}>
          <button className="ggb-btn ggb-btn-success" onClick={handleAddNew}>+ Thêm mới</button>
        </div>

        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{borderBottom:'2px solid #f3f4f6', textAlign:'left'}}>
              <th style={{padding:'10px'}}>Tiêu đề</th>
              <th style={{padding:'10px', textAlign:'right'}}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {figures.map(fig => (
              <tr key={fig.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                <td style={{padding:'12px 10px', fontWeight:'500'}}>{fig.title}</td>
                <td style={{padding:'12px 10px', textAlign:'right'}}>
                  <button className="ggb-btn ggb-btn-edit" onClick={() => handleEdit(fig)}>Sửa</button>
                  <button className="ggb-btn ggb-btn-danger" onClick={() => handleDelete(fig.id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {figures.length === 0 && (
              <tr><td colSpan="2" className="ggb-loading">Chưa có hình vẽ nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="ggb-modal-footer">
        <button className="ggb-btn ggb-btn-secondary" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default GeoGebraManagement;