import React, { useState } from 'react';

export default function VideoCard({ video, onPostComment, children }) {
  const [text, setText] = useState('');
  const snippet = video?.snippet || {};
  const stats = video?.statistics || {};
  const thumb = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
  const isMFK = video?.status?.madeForKids || video?.status?.selfDeclaredMadeForKids;

  const submit = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    await onPostComment(text);
    setText('');
  };

  return (
    <div className="card video-card" aria-live="polite">
      <div className="thumb" id="thumb">{thumb ? <img src={thumb} alt="thumbnail" /> : 'No thumbnail'}</div>
      <div className="meta">
        <div className="meta-top">
          <h2 id="videoTitle">{snippet.title || 'Untitled'}</h2>
          <div id="videoChannel" className="muted small">{snippet.channelTitle || ''}</div>
        </div>

        <div className="meta-stats">
          <div id="viewCount" className="pill">{(stats.viewCount || 0) + ' views'}</div>
          <div id="mfkBadge" className={`pill ${isMFK ? 'muted' : ''}`}>{isMFK ? 'Audience: Made for Kids (comments disabled)' : 'Audience: Not marked for kids'}</div>
          <div id="videoId" className="muted small">ID: {video?.id || '-'}</div>
        </div>

        <div className="desc card-section" id="videoDesc">{snippet.description || '—'}</div>

        <div className="card-section">
          <form id="commentForm" className="form-inline" aria-label="Post comment" onSubmit={submit}>
            <input id="commentInput" type="text" placeholder="Write a comment…" required value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn accent" type="submit">Post</button>
          </form>

          {children}
        </div>
      </div>
    </div>
  );
}
