// src/components/NotesPanel.jsx
import React, { useState } from 'react';

export default function NotesPanel({ notes = [], onSave, onClear }) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const list = Array.isArray(notes) ? notes : (notes && Array.isArray(notes.items) ? notes.items : []);

  const submit = async (e) => {
    e?.preventDefault();
    const arr = tags.split(',').map(s => s.trim()).filter(Boolean);
    if (!content.trim()) return alert('Please add note text');
    await onSave(content, arr);
    setContent(''); setTags('');
  };

  return (
    <div className="card">
      <h3 className="section-title">Quick Notes</h3>
      <form id="noteForm" className="note-form" aria-label="Add note" onSubmit={submit}>
        <textarea id="noteInput" placeholder="Add a quick note…" rows="4" value={content} onChange={e => setContent(e.target.value)}></textarea>
        <input id="tagInput" type="text" placeholder="tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
        <div style={{display:'flex',gap:10,marginTop:8}}>
          <button className="btn accent" type="submit">Save</button>
          <button className="btn" onClick={(e) => { e.preventDefault(); if (window.confirm('Clear notes from UI?')) onClear(); }}>Clear UI</button>
        </div>
      </form>

      <div style={{marginTop:12}}>
        <h4 className="section-sub">Notes</h4>
        <div id="notesList" className="notes-list">
          {list.length === 0 ? (
            <div className="muted small">No notes</div>
          ) : list.map(n => {
            // Use a robust key fallback
            const key = n._id || n.id || (n.content && n.content.slice(0,20)) || Math.random().toString(36).slice(2,9);
            return (
              <div className="note-item" key={key}>
                <div>{n.content}</div>
                {n.tags && n.tags.length ? (
                  <div style={{marginTop:6}}>
                    {n.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
